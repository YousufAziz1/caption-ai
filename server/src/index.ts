import express, { Request, Response } from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { createPublicClient, http, parseEventLogs, getAddress } from 'viem'
import { celo, celoSepolia } from 'viem/chains'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import * as https from 'https'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const CELO_RPC_URL = process.env.CELO_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org'
let CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2'
if (CONTRACT_ADDRESS.toLowerCase() === '0x3c73703e6464fe6c3a7a93608779901be0629731') {
  CONTRACT_ADDRESS = '0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2'
}

// ABI of GenerationPaid event
const PAYMENT_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'requestId', type: 'string' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'GenerationPaid',
    type: 'event'
  }
] as const

// ABI of ERC20 Transfer event (for fallback verification)
const ERC20_TRANSFER_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
] as const

// Replay protection store (in-memory Set for MVP)
const processedTxHashes = new Set<string>()

// Initialize Celo public client using viem
// Detect chain from RPC url or default to Sepolia
const isMainnet = CELO_RPC_URL.includes('forno.celo.org')
const celoChain = isMainnet ? celo : celoSepolia
console.log(`Connecting to Celo public client via ${CELO_RPC_URL} (${isMainnet ? 'Mainnet' : 'Sepolia'})`)

const publicClient = createPublicClient({
  chain: celoChain,
  transport: http(CELO_RPC_URL)
})

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', chain: celoChain.name, contractAddress: CONTRACT_ADDRESS })
})

// Helper to generate image from Hugging Face Inference API
function generateHuggingFaceImage(promptText: string): Promise<string | null> {
  return new Promise((resolve) => {
    const hfKey = process.env.HF_API_KEY
    if (!hfKey || hfKey.trim() === '' || hfKey.startsWith('your_')) {
      console.log('Skipping Hugging Face image generation: No valid HF_API_KEY configured.')
      return resolve(null)
    }

    const modelName = process.env.HF_MODEL || 'black-forest-labs/FLUX.1-schnell'
    console.log(`Calling Hugging Face Inference API using model: ${modelName}`)

    const postData = JSON.stringify({ inputs: promptText })

    const options = {
      hostname: 'router.huggingface.co',
      port: 443,
      path: `/hf-inference/models/${modelName}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfKey}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          console.error(`Hugging Face image generation failed: ${res.statusCode} - ${data}`)
          resolve(null)
        })
        return
      }

      const chunks: Buffer[] = []
      res.on('data', (chunk) => { chunks.push(chunk) })
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const base64Image = buffer.toString('base64')
        const contentType = res.headers['content-type'] || 'image/png'
        resolve(`data:${contentType};base64,${base64Image}`)
      })
    })

    req.on('error', (e) => {
      console.error('Hugging Face image generation request failed:', e.message)
      resolve(null)
    })

    req.write(postData)
    req.end()
  })
}

// Helper to generate text caption using Hugging Face text model as a fallback
function generateHuggingFaceCaption(promptText: string, tone: string): Promise<{ caption: string; hashtags: string[] } | null> {
  return new Promise((resolve) => {
    const hfKey = process.env.HF_API_KEY
    if (!hfKey || hfKey.trim() === '' || hfKey.startsWith('your_')) {
      console.log('Skipping Hugging Face caption fallback: No valid HF_API_KEY.')
      return resolve(null)
    }

    const modelName = process.env.HF_TEXT_MODEL || 'Qwen/Qwen2.5-7B-Instruct'
    console.log(`Calling Hugging Face Text Inference API using model: ${modelName}`)

    const systemInstruction = `You are a premium social media expert. Generate a single caption based on the user topic. Tone: ${tone}.
Requirements:
- Keep the caption text under 200 characters.
- Do not include any tags inside the caption text itself.
- Suggest exactly 3 highly relevant hashtags.
- Return ONLY a valid JSON object in the following format:
{
  "caption": "Your generated caption here",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}`

    const postData = JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: promptText }
      ],
      max_tokens: 300,
      temperature: 0.7
    })

    const options = {
      hostname: 'router.huggingface.co',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`HF Text API returned error: ${res.statusCode} - ${data}`)
          return resolve(null)
        }

        try {
          const parsedData = JSON.parse(data)
          const content = parsedData.choices?.[0]?.message?.content?.trim()
          if (!content) return resolve(null)

          // Clean output in case model returned markdown codeblocks
          let cleanJson = content
          if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
          }

          const parsed = JSON.parse(cleanJson)
          resolve({
            caption: parsed.caption || '',
            hashtags: parsed.hashtags || []
          })
        } catch (error: any) {
          console.error('Failed to parse Hugging Face text completion response:', error.message || error)
          resolve(null)
        }
      })
    })

    req.on('error', (e) => {
      console.error('Hugging Face caption request failed:', e.message)
      resolve(null)
    })

    req.write(postData)
    req.end()
  })
}


app.post('/api/generate', async (req: Request, res: Response): Promise<any> => {
  const { walletAddress, txHash, prompt, tone } = req.body

  if (!walletAddress || !txHash || !prompt) {
    return res.status(400).json({ error: 'Missing required parameters: walletAddress, txHash, prompt' })
  }

  // Check if transaction hash was already processed (replay prevention)
  const normalizedTxHash = txHash.toLowerCase()
  if (processedTxHashes.has(normalizedTxHash)) {
    return res.status(400).json({ error: 'Transaction hash has already been used' })
  }

  try {
    if (!CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Server misconfiguration: CONTRACT_ADDRESS not set' })
    }

    console.log(`Verifying transaction: ${normalizedTxHash} for wallet: ${walletAddress}`)
    
    // 1. Fetch transaction receipt on-chain with retry logic to account for RPC node sync latency
    let receipt
    const maxRetries = 5
    for (let i = 0; i < maxRetries; i++) {
      try {
        receipt = await publicClient.getTransactionReceipt({
          hash: normalizedTxHash as `0x${string}`
        })
        if (receipt) break
      } catch (err) {
        if (i === maxRetries - 1) {
          throw err
        }
        console.log(`Transaction receipt not found yet, retrying in 1.5s... (Attempt ${i + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
    }

    if (!receipt) {
      return res.status(402).json({ error: 'Transaction receipt not found on Celo after multiple retries' })
    }

    if (receipt.status !== 'success') {
      return res.status(402).json({ error: 'Transaction has failed on-chain' })
    }

    let isPaid = false
    let verifiedDetails = ''

    const senderUser = getAddress(walletAddress)
    const configContract = getAddress(CONTRACT_ADDRESS)

    const allowedRecipients = new Set([
      configContract,
      getAddress('0x4C534383A4158fC9C4a712213700ab6D7084343a'), // Celo Mainnet contract
      getAddress('0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2'), // Celo Sepolia contract
      getAddress('0x3c73703E6464Fe6C3A7A93608779901BE0629731')   // Old EOA (legacy)
    ])

    const allowedTokens = new Set([
      getAddress('0x765de816845861e75a25fca122bb6898b8b1282a'), // cUSD Mainnet
      getAddress('0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b'), // cUSD Sepolia (USDm)
      getAddress('0x874069fa1eb16d44d622f2e0ca25eea172369bc1')  // cUSD Sepolia (alt)
    ])

    // Mode A: Try parsing the GenerationPaid smart contract event first
    try {
      const logs = parseEventLogs({
        abi: PAYMENT_CONTRACT_ABI,
        logs: receipt.logs,
        eventName: 'GenerationPaid'
      })

      if (logs.length > 0) {
        const paidUser = getAddress(logs[0].args.user)
        if (paidUser === senderUser) {
          isPaid = true
          verifiedDetails = `Smart contract payment verified! RequestId: ${logs[0].args.requestId}, Fee Paid: ${logs[0].args.amount}`
        } else {
          return res.status(402).json({ error: 'Transaction sender in event does not match payment sender address' })
        }
      }
    } catch (err: any) {
      console.log('Skipping GenerationPaid parsing (non-compatible contract/receipt):', err.message || err)
    }

    // Mode B (Fallback): Parse standard ERC20 cUSD transfer events
    if (!isPaid) {
      try {
        const transferLogs = parseEventLogs({
          abi: ERC20_TRANSFER_ABI,
          logs: receipt.logs,
          eventName: 'Transfer'
        })

        for (const log of transferLogs) {
          const tokenAddress = getAddress(log.address)
          const from = getAddress(log.args.from)
          const to = getAddress(log.args.to)
          const value = log.args.value

          if (
            allowedTokens.has(tokenAddress) &&
            from === senderUser &&
            allowedRecipients.has(to) &&
            value >= 10000000000000000n // 0.01 cUSD (1 * 10^16)
          ) {
            isPaid = true
            verifiedDetails = `Fallback cUSD Transfer verified! Token: ${tokenAddress}, Recipient: ${to}, Value: ${value}`
            break
          }
        }
      } catch (err: any) {
        console.error('Failed to parse ERC20 Transfer logs:', err.message || err)
      }
    }

    if (!isPaid) {
      return res.status(402).json({ error: 'No valid payment (GenerationPaid event or direct cUSD transfer) found for this transaction' })
    }

    console.log(verifiedDetails)

    // 3. Mark transaction as processed
    processedTxHashes.add(normalizedTxHash)

    // 4. Generate caption using Google Gemini API
    const selectedTone = tone || 'Hype'
    const finalPrompt = `
      You are a premium social media expert.
      Generate a single caption based on this request: "${prompt}".
      The tone must be: ${selectedTone}.
      
      Requirements:
      - Keep the caption text under 200 characters.
      - Do not include any tags inside the caption text itself.
      - Suggest exactly 3 highly relevant hashtags.
      - Return ONLY a valid JSON object in the following format:
      {
        "caption": "Your generated caption here",
        "hashtags": ["#tag1", "#tag2", "#tag3"]
      }
      
      Do not include markdown code block formatting (like \`\`\`json). Return raw JSON string only.
    `

    console.log(`Executing Gemini and Hugging Face generation in parallel. Tone: ${selectedTone}`)
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    const model = genAI.getGenerativeModel({ model: geminiModel })

    // Execute content and image generation in parallel
    const [geminiResult, imageUrl] = await Promise.all([
      model.generateContent(finalPrompt).catch(err => {
        console.error('Gemini content generation failed:', err)
        return null
      }),
      generateHuggingFaceImage(prompt).catch(err => {
        console.error('Hugging Face image generation failed:', err)
        return null
      })
    ])

    let captionData: { caption: string; hashtags: string[] } | null = null

    if (geminiResult) {
      const responseText = geminiResult.response.text().trim()
      let cleanJson = responseText
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
      }
      try {
        const parsed = JSON.parse(cleanJson)
        captionData = {
          caption: parsed.caption || '',
          hashtags: parsed.hashtags || []
        }
      } catch (parseErr) {
        console.error('Failed to parse Gemini output as JSON:', responseText, parseErr)
        captionData = {
          caption: responseText.slice(0, 200),
          hashtags: ['#captionai', '#celo', '#minipay']
        }
      }
    }

    // Fallback to Hugging Face text model if Gemini failed or was skipped
    if (!captionData) {
      console.log('Gemini failed/quota exceeded. Attempting Hugging Face text model fallback...')
      captionData = await generateHuggingFaceCaption(prompt, selectedTone)
    }

    if (!captionData) {
      throw new Error('Both Gemini and Hugging Face caption generation failed. Please verify API keys.')
    }

    return res.json({
      caption: captionData.caption,
      hashtags: captionData.hashtags,
      imageUrl: imageUrl || undefined
    })
  } catch (error: any) {
    console.error('Generation verification error:', error)
    return res.status(500).json({ error: `Internal server error: ${error.message || error}` })
  }
})

app.listen(PORT, () => {
  console.log(`CaptionAI backend server running on port ${PORT}`)
})

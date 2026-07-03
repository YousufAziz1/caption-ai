# CaptionAI — Pay-Per-Use AI MiniApp for MiniPay

**CaptionAI** is a premium social media caption generator built specifically for Celo's **MiniPay** (Opera's self-custodial stablecoin wallet). Instead of purchasing monthly subscriptions, users pay a micro-fee of **0.02 cUSD** (~₹1.60 INR) per generation on-chain. This provides an excellent growth driver for the Celo network and aligns with the Proof of Ship milestone.

---

## ⚡ Tech Stack & Architecture

- **Smart Contracts (Solidity + Hardhat):**
  - Zero-custody fee processor that transfers cUSD directly from the user's wallet to a treasury address and emits a unique `GenerationPaid` receipt event.
- **Backend (Express + Node + TypeScript + Viem + Gemini API):**
  - Listens to Celo transaction hashes.
  - Verifies transaction validity (checks receiver address, ERC20 logs, sender signature, and protects against replay attacks).
  - Triggers Google Gemini `gemini-2.0-flash` model to return curated captions in structured JSON format.
- **Frontend (Vite + React 18 + TailwindCSS + Wagmi + Viem):**
  - Mobile-first layout (optimized for 375px–380px viewports).
  - Instantly auto-connects to MiniPay's injected provider.
  - Custom UI/UX: Floating particle/mesh gradients and micro-interactions.

```
┌──────────────┐                 ┌─────────────┐                 ┌─────────────┐
│  Vite React  │───(1) Pay Fee──▶│   Caption   │───(2) Forward──▶│  Treasury   │
│   Frontend   │                 │   Contract  │                 │   Address   │
└──────────────┘                 └─────────────┘                 └─────────────┘
       │                                                                │
  (3) Send Tx                                                      (Emits Log)
       │                                                                │
       ▼                                                                ▼
┌──────────────┐                                                 ┌─────────────┐
│   Express    │◀────────────────(4) Verify Logs On-Chain─────────│ Celo Node   │
│   Backend    │                                                 │ (Sepolia/   │
└──────────────┘                                                 │  Mainnet)   │
       │                                                         └─────────────┘
  (5) Call Gemini
       │
       ▼
┌──────────────┐
│  Gemini AI   │
└──────────────┘
```

---

## 🎨 Premium UX Optimization: One-Time Pre-Approval

To save users from signing **two wallet prompts** (Approve ERC20 + Pay Contract) for every single caption generation, the frontend implements a smart allowance check:
1. When the user taps **Generate**, the client checks their remaining cUSD allowance.
2. If the allowance is less than `0.02 cUSD`, the client requests a one-time approval of **0.50 cUSD** (enough to cover 25 generations).
3. For subsequent generations, the allowance check passes, and the user signs **exactly one prompt** (the `payAndGenerate` fee transfer) directly inside MiniPay.

---

## 📁 Directory Structure

```
caption-ai/
├── contracts/        # Hardhat contracts workspace
│   ├── contracts/    # Solidity source code (Payment contract, Mock token)
│   ├── scripts/      # Deployment scripts (target-aware)
│   └── test/         # Comprehensive Hardhat unit tests
├── server/           # Express server API
│   └── src/          # TypeScript entry point (viem validator + Gemini integration)
└── client/           # React frontend app
    ├── src/          # Vite entry files, hooks, views, and styles
    └── tailwind/     # Premium CSS variables & animations
```

---

## 🚀 Getting Started

### 1. Smart Contracts

Go to the `contracts/` directory and install dependencies:
```bash
cd contracts
pnpm install --prefer-offline
```

Configure your environment variables by copying `.env.example`:
```bash
cp .env.example .env
```
Fill in your `PRIVATE_KEY` (containing testnet/mainnet CELO/cUSD) and your `CELOSCAN_API_KEY`.

**Available Scripts:**
- `pnpm compile` — Compiles contracts and generates typings.
- `pnpm test` — Runs the test suite verifying forwarding, allowance rules, and ownership controls.
- `pnpm deploy:sepolia` — Deploys to Celo Sepolia Testnet.
- `pnpm deploy:mainnet` — Deploys to Celo Mainnet.

Once deployed, copy the address of the `CaptionAIPayment` contract. You will need to paste this into your client and server configurations.

---

### 2. Backend Server

Go to the `server/` directory and install dependencies:
```bash
cd ../server
pnpm install --prefer-offline
```

Create a `.env` file:
```bash
cp .env.example .env
```
Provide the required variables:
- `GEMINI_API_KEY`: API Key from Google AI Studio.
- `CONTRACT_ADDRESS`: The deployed `CaptionAIPayment` contract address.
- `CELO_RPC_URL`: Set to `https://forno.celo.org` for Mainnet, or keep default Sepolia.

**Available Scripts:**
- `pnpm dev` — Starts the development server with hot-reloading at `http://localhost:3001`.
- `pnpm build` — Compiles TypeScript into JS output in `dist/`.
- `pnpm start` — Runs the compiled server.

---

### 3. Frontend Client

Go to the `client/` directory and install dependencies:
```bash
cd ../client
pnpm install --prefer-offline
```

Configure env variables. Create `.env`:
```env
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here
VITE_API_BASE_URL=http://localhost:3001
```

**Available Scripts:**
- `pnpm dev` — Starts Vite dev server locally.
- `pnpm build` — Compiles and bundles React client for production build.

---

## 🔒 Verification & Replay Protection

The Express backend implements strict security checks:
- **Receipt Querying:** Queries the Celo RPC directly using `viem` to verify that the transaction receipt exists, succeeded, and targeted the correct contract address.
- **Log Verification:** Parses the receipt logs to check if the `GenerationPaid` event was emitted, verifying that the user address matches the prompt requestor.
- **Replay Protection:** Keeps track of processed transaction hashes. If a transaction hash is sent twice, the backend rejects it instantly, ensuring each micro-fee is only used once.

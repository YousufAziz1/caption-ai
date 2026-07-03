import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { celo, celoSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Create a React Query client
const queryClient = new QueryClient()

// Create Wagmi Config for Celo networks
export const wagmiConfig = createConfig({
  chains: [celoSepolia, celo],
  connectors: [
    injected({
      target: 'metaMask' // Default standard fallback target, MiniPay also intercepts standard injected
    })
  ],
  transports: {
    [celoSepolia.id]: http('https://forno.celo-sepolia.celo-testnet.org'),
    [celo.id]: http('https://forno.celo.org')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)

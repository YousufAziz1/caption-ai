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
  chains: [celo, celoSepolia],
  connectors: [
    injected()
  ],
  transports: {
    [celo.id]: http('https://forno.celo.org'),
    [celoSepolia.id]: http('https://forno.celo-sepolia.celo-testnet.org')
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

import { http, createConfig } from 'wagmi'
import { base, baseSepolia, mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http('https://tiniest-blue-grass.base-sepolia.quiknode.pro/124adb33473c69ec0cdbf47a5a30611cfd4438b0/'),
    [base.id]: http(),
  },
  ssr: true,
})

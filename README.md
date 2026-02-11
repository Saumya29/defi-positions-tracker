# DeFi Positions Tracker

Track your Aave V3 and Uniswap V3 positions on Ethereum mainnet.

## Features

- 🏦 **Aave V3**: View supplied assets, borrowed amounts, collateral status, and health factor
- 🦄 **Uniswap V3**: Track LP positions, in-range status, and unclaimed fees
- 🔍 **Any Wallet**: Enter any Ethereum address to view positions (not just your own)
- ⚡ **Real-time**: Auto-refreshes every 60 seconds

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **viem** - Ethereum interactions
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS** - Styling

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Optional: Use a custom RPC (recommended for production)
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```

## License

MIT

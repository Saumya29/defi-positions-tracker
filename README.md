# DeFi Positions Tracker

One dashboard to monitor your Aave V3 lending positions and Uniswap V3 liquidity pools on Ethereum.

## Demo

<video src="demo.mp4" width="100%" autoplay loop muted playsinline></video>

![Demo](demo.gif)

## Why I built this

I had ETH supplied on Aave, a couple of Uniswap LP positions, and no single place to see it all. Checking each protocol's UI separately got old fast. So I built a simple dashboard - paste any wallet address and see everything at once.

## What it shows

- **Aave V3** - Supplied assets, borrowed amounts, collateral status, health factor, LTV
- **Uniswap V3** - LP positions, in-range/out-of-range status, unclaimed trading fees
- **Any wallet** - Not limited to your own. Enter any Ethereum address to view positions
- **Auto-refresh** - Updates every 60 seconds

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Blockchain:** viem
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Optionally set `NEXT_PUBLIC_RPC_URL` in `.env.local` for a custom RPC endpoint.

## License

MIT

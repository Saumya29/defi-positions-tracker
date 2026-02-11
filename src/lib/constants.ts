// Contract Addresses - Ethereum Mainnet
export const ADDRESSES = {
  // Aave V3 Pool
  AAVE_V3_POOL: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2' as const,
  // Aave V3 Pool Data Provider
  AAVE_V3_POOL_DATA_PROVIDER: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3' as const,
  // Uniswap V3 NFT Position Manager
  UNISWAP_V3_NFT_MANAGER: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88' as const,
  // Uniswap V3 Factory
  UNISWAP_V3_FACTORY: '0x1F98431c8aD98523631AE4a59f267346ea31F984' as const,
} as const;

// Common tokens
export const TOKENS: Record<string, { symbol: string; decimals: number; address: string }> = {
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': { symbol: 'WETH', decimals: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': { symbol: 'USDC', decimals: 6, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': { symbol: 'USDT', decimals: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  '0x6B175474E89094C44Da98b954EescdEcd6E0E29D': { symbol: 'DAI', decimals: 18, address: '0x6B175474E89094C44Da98b954EedscdEcd6E0E29D' },
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': { symbol: 'WBTC', decimals: 8, address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0': { symbol: 'wstETH', decimals: 18, address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' },
  '0xae78736Cd615f374D3085123A210448E74Fc6393': { symbol: 'rETH', decimals: 18, address: '0xae78736Cd615f374D3085123A210448E74Fc6393' },
};

export function getTokenInfo(address: string): { symbol: string; decimals: number } {
  const normalized = address.toLowerCase();
  for (const [addr, info] of Object.entries(TOKENS)) {
    if (addr.toLowerCase() === normalized) {
      return info;
    }
  }
  return { symbol: address.slice(0, 6) + '...' + address.slice(-4), decimals: 18 };
}

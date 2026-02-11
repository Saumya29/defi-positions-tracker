'use client';

import { useUniswapPositions } from '@/hooks/useUniswapPositions';

interface UniswapPositionsProps {
  address: string;
}

export function UniswapPositions({ address }: UniswapPositionsProps) {
  const { data: positions, isLoading, error } = useUniswapPositions(address);

  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg" />
          <h2 className="text-xl font-semibold text-white">Uniswap V3</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-zinc-800 rounded w-1/4" />
          <div className="h-20 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900/50 border border-red-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-2">Uniswap V3</h2>
        <p className="text-red-400">Failed to load positions</p>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Uniswap V3</h2>
        </div>
        <p className="text-zinc-500">No positions found</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Uniswap V3</h2>
        </div>
        <span className="text-zinc-500 text-sm">{positions.length} position{positions.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid gap-4">
        {positions.map((position) => (
          <div
            key={position.tokenId.toString()}
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {position.token0Symbol}/{position.token1Symbol}
                </span>
                <span className="px-2 py-0.5 bg-zinc-700 rounded text-xs text-zinc-400">
                  {position.fee}%
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                position.inRange 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {position.inRange ? 'In Range' : 'Out of Range'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Token ID</p>
                <p className="text-white font-mono">#{position.tokenId.toString()}</p>
              </div>
              <div>
                <p className="text-zinc-500">Liquidity</p>
                <p className="text-white">{position.liquidity > 0n ? '●' : '○'}</p>
              </div>
              <div>
                <p className="text-zinc-500">Fees Owed ({position.token0Symbol})</p>
                <p className="text-green-400">
                  {position.tokensOwed0 > 0n ? Number(position.tokensOwed0) / 1e18 : '0'}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Fees Owed ({position.token1Symbol})</p>
                <p className="text-green-400">
                  {position.tokensOwed1 > 0n ? Number(position.tokensOwed1) / 1e18 : '0'}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-700/50">
              <p className="text-zinc-500 text-xs">
                Tick Range: {position.tickLower} → {position.tickUpper}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

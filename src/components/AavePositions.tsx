'use client';

import { useAavePositions } from '@/hooks/useAavePositions';

interface AavePositionsProps {
  address: string;
}

export function AavePositions({ address }: AavePositionsProps) {
  const { data, isLoading, error } = useAavePositions(address);

  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg" />
          <h2 className="text-xl font-semibold text-white">Aave V3</h2>
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
        <h2 className="text-xl font-semibold text-white mb-2">Aave V3</h2>
        <p className="text-red-400">Failed to load positions</p>
      </div>
    );
  }

  if (!data || data.positions.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Aave V3</h2>
        </div>
        <p className="text-zinc-500">No positions found</p>
      </div>
    );
  }

  const { positions, accountData } = data;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">A</span>
        </div>
        <h2 className="text-xl font-semibold text-white">Aave V3</h2>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">Total Collateral</p>
          <p className="text-white text-lg font-semibold">
            ${Number(accountData.totalCollateralUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">Total Debt</p>
          <p className="text-white text-lg font-semibold">
            ${Number(accountData.totalDebtUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">Health Factor</p>
          <p className={`text-lg font-semibold ${
            accountData.healthFactor === '∞' ? 'text-green-400' :
            Number(accountData.healthFactor) > 2 ? 'text-green-400' :
            Number(accountData.healthFactor) > 1.5 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {accountData.healthFactor === '∞' ? '∞' : Number(accountData.healthFactor).toFixed(2)}
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">LTV</p>
          <p className="text-white text-lg font-semibold">{accountData.ltv}%</p>
        </div>
      </div>

      {/* Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Asset</th>
              <th className="text-right py-3 px-4 text-zinc-500 text-sm font-medium">Supplied</th>
              <th className="text-right py-3 px-4 text-zinc-500 text-sm font-medium">Borrowed</th>
              <th className="text-center py-3 px-4 text-zinc-500 text-sm font-medium">Collateral</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.asset} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-4 px-4">
                  <span className="text-white font-medium">{position.symbol}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  {Number(position.supplied) > 0 ? (
                    <span className="text-green-400">
                      {Number(position.supplied).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </span>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  {Number(position.borrowed) > 0 ? (
                    <span className="text-red-400">
                      {Number(position.borrowed).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </span>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  {position.isCollateral ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500/20 text-green-400 rounded">✓</span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-zinc-800 text-zinc-600 rounded">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

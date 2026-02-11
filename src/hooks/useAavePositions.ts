'use client';

import { useQuery } from '@tanstack/react-query';
import { publicClient } from '@/lib/viem';
import { ADDRESSES, getTokenInfo } from '@/lib/constants';
import { AAVE_POOL_ABI, AAVE_POOL_DATA_PROVIDER_ABI } from '@/lib/abis/aave-pool';
import { formatUnits, type Address } from 'viem';

export interface AavePosition {
  asset: string;
  symbol: string;
  supplied: string;
  suppliedRaw: bigint;
  borrowed: string;
  borrowedRaw: bigint;
  isCollateral: boolean;
}

export interface AaveAccountData {
  totalCollateralUSD: string;
  totalDebtUSD: string;
  availableBorrowsUSD: string;
  healthFactor: string;
  ltv: string;
}

async function fetchAavePositions(address: Address): Promise<{
  positions: AavePosition[];
  accountData: AaveAccountData;
}> {
  // Fetch user reserves data
  const [userReservesData, accountData] = await Promise.all([
    publicClient.readContract({
      address: ADDRESSES.AAVE_V3_POOL_DATA_PROVIDER,
      abi: AAVE_POOL_DATA_PROVIDER_ABI,
      functionName: 'getUserReservesData',
      args: [address],
    }),
    publicClient.readContract({
      address: ADDRESSES.AAVE_V3_POOL,
      abi: AAVE_POOL_ABI,
      functionName: 'getUserAccountData',
      args: [address],
    }),
  ]);

  const reserves = userReservesData[0];
  
  // Filter and map positions
  const positions: AavePosition[] = reserves
    .filter((r) => r.scaledATokenBalance > 0n || r.scaledVariableDebt > 0n || r.principalStableDebt > 0n)
    .map((reserve) => {
      const tokenInfo = getTokenInfo(reserve.underlyingAsset);
      const totalDebt = reserve.scaledVariableDebt + reserve.principalStableDebt;
      
      return {
        asset: reserve.underlyingAsset,
        symbol: tokenInfo.symbol,
        supplied: formatUnits(reserve.scaledATokenBalance, tokenInfo.decimals),
        suppliedRaw: reserve.scaledATokenBalance,
        borrowed: formatUnits(totalDebt, tokenInfo.decimals),
        borrowedRaw: totalDebt,
        isCollateral: reserve.usageAsCollateralEnabledOnUser,
      };
    });

  // Parse account data (values are in 8 decimals for USD)
  const parsedAccountData: AaveAccountData = {
    totalCollateralUSD: formatUnits(accountData[0], 8),
    totalDebtUSD: formatUnits(accountData[1], 8),
    availableBorrowsUSD: formatUnits(accountData[2], 8),
    ltv: (Number(accountData[4]) / 100).toFixed(2),
    healthFactor: accountData[5] === BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      ? '∞'
      : formatUnits(accountData[5], 18),
  };

  return { positions, accountData: parsedAccountData };
}

export function useAavePositions(address: string | undefined) {
  return useQuery({
    queryKey: ['aave-positions', address],
    queryFn: () => fetchAavePositions(address as Address),
    enabled: !!address && address.startsWith('0x') && address.length === 42,
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // 1 minute
  });
}

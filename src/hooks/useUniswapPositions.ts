'use client';

import { useQuery } from '@tanstack/react-query';
import { publicClient } from '@/lib/viem';
import { ADDRESSES, getTokenInfo } from '@/lib/constants';
import { UNISWAP_V3_NFT_MANAGER_ABI, UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_POOL_ABI } from '@/lib/abis/uniswap-v3';
import { type Address } from 'viem';

export interface UniswapPosition {
  tokenId: bigint;
  token0: string;
  token1: string;
  token0Symbol: string;
  token1Symbol: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  inRange: boolean;
  poolAddress: string;
}

function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

async function fetchUniswapPositions(address: Address): Promise<UniswapPosition[]> {
  // Get number of positions
  const balance = await publicClient.readContract({
    address: ADDRESSES.UNISWAP_V3_NFT_MANAGER,
    abi: UNISWAP_V3_NFT_MANAGER_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  if (balance === 0n) return [];

  // Get all token IDs
  const tokenIds = await Promise.all(
    Array.from({ length: Number(balance) }, (_, i) =>
      publicClient.readContract({
        address: ADDRESSES.UNISWAP_V3_NFT_MANAGER,
        abi: UNISWAP_V3_NFT_MANAGER_ABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, BigInt(i)],
      })
    )
  );

  // Fetch position details
  const positions = await Promise.all(
    tokenIds.map(async (tokenId) => {
      const position = await publicClient.readContract({
        address: ADDRESSES.UNISWAP_V3_NFT_MANAGER,
        abi: UNISWAP_V3_NFT_MANAGER_ABI,
        functionName: 'positions',
        args: [tokenId],
      });

      // Get pool address
      const poolAddress = await publicClient.readContract({
        address: ADDRESSES.UNISWAP_V3_FACTORY,
        abi: UNISWAP_V3_FACTORY_ABI,
        functionName: 'getPool',
        args: [position[2], position[3], position[4]],
      });

      // Get current tick from pool
      let currentTick = 0;
      try {
        const slot0 = await publicClient.readContract({
          address: poolAddress,
          abi: UNISWAP_V3_POOL_ABI,
          functionName: 'slot0',
        });
        currentTick = slot0[1];
      } catch {
        // Pool might not exist or be uninitialized
      }

      const tickLower = position[5];
      const tickUpper = position[6];
      const inRange = currentTick >= tickLower && currentTick <= tickUpper;

      const token0Info = getTokenInfo(position[2]);
      const token1Info = getTokenInfo(position[3]);

      return {
        tokenId,
        token0: position[2],
        token1: position[3],
        token0Symbol: token0Info.symbol,
        token1Symbol: token1Info.symbol,
        fee: position[4] / 10000, // Convert to percentage
        tickLower,
        tickUpper,
        liquidity: position[7],
        tokensOwed0: position[10],
        tokensOwed1: position[11],
        inRange,
        poolAddress,
      };
    })
  );

  // Filter out closed positions (zero liquidity)
  return positions.filter((p) => p.liquidity > 0n);
}

export function useUniswapPositions(address: string | undefined) {
  return useQuery({
    queryKey: ['uniswap-positions', address],
    queryFn: () => fetchUniswapPositions(address as Address),
    enabled: !!address && address.startsWith('0x') && address.length === 42,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

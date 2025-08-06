'use client';

import { useAccount, useReadContract, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { chainExTokenABI, chainExTokenAddress } from '@/lib/contracts';
import { Coins } from 'lucide-react';

export function ChainExTokenCard() {
  const { address, isConnected } = useAccount();

  const { data: tokenName, isLoading: isNameLoading } = useReadContract({
    abi: chainExTokenABI,
    address: chainExTokenAddress,
    functionName: 'name',
  });

  const { data: tokenSymbol, isLoading: isSymbolLoading } = useReadContract({
    abi: chainExTokenABI,
    address: chainExTokenAddress,
    functionName: 'symbol',
  });

  const { data: totalSupply, isLoading: isTotalSupplyLoading } = useReadContract({
    abi: chainExTokenABI,
    address: chainExTokenAddress,
    functionName: 'totalSupply',
  });

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,
    token: chainExTokenAddress,
  });

  const formattedTotalSupply = totalSupply ? formatUnits(totalSupply, 18) : '0';
  const formattedBalance = balance ? parseFloat(balance.formatted).toFixed(4) : '0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Coins className="h-6 w-6 text-primary" />
          <CardTitle>ChainEx Token ({isSymbolLoading ? <Skeleton className="h-6 w-14 inline-block" /> : tokenSymbol})</CardTitle>
        </div>
        <CardDescription>
          {isNameLoading ? <Skeleton className="h-5 w-48" /> : tokenName} is the native token of the ChainEx ecosystem.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Your Balance</span>
            {isBalanceLoading ? <Skeleton className="h-8 w-32" /> : (
                <span className="text-2xl font-bold font-headline">{formattedBalance} {tokenSymbol}</span>
            )}
        </div>
        <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Total Supply</span>
            {isTotalSupplyLoading ? <Skeleton className="h-8 w-48" /> : (
                <span className="text-2xl font-bold font-headline">{formattedTotalSupply}</span>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

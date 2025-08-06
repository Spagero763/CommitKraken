'use client';

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { chainExMembershipABI, chainExMembershipAddress } from '@/lib/contracts';
import { Loader2, BadgePercent } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export function ChainExMembershipCard() {
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();
  
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: mintPrice, isLoading: isPriceLoading } = useReadContract({
    abi: chainExMembershipABI,
    address: chainExMembershipAddress,
    functionName: 'mintPrice',
  });

  const { data: name, isLoading: isNameLoading } = useReadContract({
    abi: chainExMembershipABI,
    address: chainExMembershipAddress,
    functionName: 'name',
  });

  const handleMint = async () => {
    if (!mintPrice) return;
    try {
      const hash = await writeContractAsync({
        abi: chainExMembershipABI,
        address: chainExMembershipAddress,
        functionName: 'mint',
        args: ['ipfs://your-metadata-uri-here'], // Placeholder URI
        value: mintPrice,
      });
      setTxHash(hash);
      toast({ title: 'Transaction Sent', description: 'Minting your NFT...' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to mint NFT.' });
    }
  };
  
  const formattedPrice = mintPrice ? formatEther(mintPrice) : '0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <BadgePercent className="h-6 w-6 text-primary" />
          <CardTitle>Membership NFT</CardTitle>
        </div>
        <CardDescription>
          Mint a {isNameLoading ? <Skeleton className="h-5 w-24 inline-block"/> : name} to get perks and discounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Become a premium member of the ChainEx community.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="text-lg font-bold">
            Mint Price: {isPriceLoading ? <Skeleton className="h-6 w-20 inline-block"/> : `${formattedPrice} ETH`}
        </div>
        <Button onClick={handleMint} disabled={isConfirming || isPriceLoading} className="w-full">
            {isConfirming ? (
                <>
                    <Loader2 className="mr-2 animate-spin" /> Minting...
                </>
            ) : "Mint Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

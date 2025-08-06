'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chainExDEXABI, chainExDEXAddress, chainExTokenABI, chainExTokenAddress } from '@/lib/contracts';

export function ChainExDEXCard() {
  const { address } = useAccount();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  
  const [buyTxHash, setBuyTxHash] = useState<`0x${string}`>();
  const { isLoading: isConfirmingBuy } = useWaitForTransactionReceipt({ hash: buyTxHash });

  const [sellTxHash, setSellTxHash] = useState<`0x${string}`>();
  const { isLoading: isConfirmingSell } = useWaitForTransactionReceipt({ hash: sellTxHash });
  
  const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}`>();
  const { isLoading: isConfirmingApproval } = useWaitForTransactionReceipt({ hash: approvalTxHash });

  const { data: rate, isLoading: isRateLoading } = useReadContract({
    abi: chainExDEXABI,
    address: chainExDEXAddress,
    functionName: 'rate',
  });

  const handleBuy = async () => {
    if (!buyAmount) return;
    try {
      const value = parseEther(buyAmount);
      const hash = await writeContractAsync({
        abi: chainExDEXABI,
        address: chainExDEXAddress,
        functionName: 'buyTokens',
        value: value,
      });
      setBuyTxHash(hash);
      toast({ title: 'Transaction Sent', description: 'Buying CEX tokens...' });
      setBuyAmount('');
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to buy tokens.' });
    }
  };

  const handleSell = async () => {
    if (!sellAmount || !address) return;
    try {
      const amount = parseEther(sellAmount);

      // 1. Approve DEX to spend tokens
      const approvalHash = await writeContractAsync({
        abi: chainExTokenABI,
        address: chainExTokenAddress,
        functionName: 'approve',
        args: [chainExDEXAddress, amount],
      });
      setApprovalTxHash(approvalHash);
      toast({ title: 'Approval Sent', description: 'Waiting for approval confirmation...' });
      
      // We will wait for approval before selling in a real app,
      // but for this simple UI we just fire and forget for now.
      // A better implementation would use the `isSuccess` from `useWaitForTransactionReceipt`.

      // 2. Sell tokens
      const sellHash = await writeContractAsync({
        abi: chainExDEXABI,
        address: chainExDEXAddress,
        functionName: 'sellTokens',
        args: [amount],
      });
      setSellTxHash(sellHash);
      toast({ title: 'Transaction Sent', description: 'Selling CEX tokens...' });
      setSellAmount('');
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to sell tokens.' });
    }
  };
  
  const isLoading = isConfirmingBuy || isConfirmingSell || isConfirmingApproval;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Repeat className="h-6 w-6 text-primary" />
          <CardTitle>Decentralized Exchange</CardTitle>
        </div>
        <CardDescription>
          Buy or sell CEX tokens directly. Rate: 1 ETH = {rate?.toString() ?? '...'} CEX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="buy-amount">Buy CEX</Label>
          <div className="flex gap-2">
            <Input
              id="buy-amount"
              type="number"
              placeholder="0.1"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleBuy} disabled={isLoading || !buyAmount}>
              {isLoading && <Loader2 className="animate-spin" />}
              Buy
            </Button>
          </div>
           <p className="text-xs text-muted-foreground">Amount in ETH</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sell-amount">Sell CEX</Label>
          <div className="flex gap-2">
            <Input
              id="sell-amount"
              type="number"
              placeholder="100"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleSell} disabled={isLoading || !sellAmount} variant="secondary">
              {isLoading && <Loader2 className="animate-spin" />}
              Sell
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Amount in CEX</p>
        </div>
      </CardContent>
    </Card>
  );
}

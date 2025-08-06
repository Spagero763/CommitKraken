'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PiggyBank } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chainExStakingABI, chainExStakingAddress, chainExTokenABI, chainExTokenAddress } from '@/lib/contracts';
import { Skeleton } from '@/components/ui/skeleton';

type ActionState = 'idle' | 'approving' | 'staking' | 'withdrawing';

export function ChainExStakingCard() {
  const { address } = useAccount();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  const [stakeAmount, setStakeAmount] = useState('');
  const [actionState, setActionState] = useState<ActionState>('idle');

  const [stakeTxHash, setStakeTxHash] = useState<`0x${string}`>();
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}`>();
  const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}`>();

  const { data: stakedBalance, isLoading: isBalanceLoading, refetch: refetchStakedBalance } = useReadContract({
    abi: chainExStakingABI,
    address: chainExStakingAddress,
    functionName: 'balances',
    args: [address!],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  const { data: reward, isLoading: isRewardLoading, refetch: refetchReward } = useReadContract({
    abi: chainExStakingABI,
    address: chainExStakingAddress,
    functionName: 'calculateReward',
    args: [address!],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  const onTransactionSuccess = (message: string) => {
    toast({ title: 'Success!', description: message });
    refetchStakedBalance();
    refetchReward();
    setActionState('idle');
  };

  const { isLoading: isConfirmingStake } = useWaitForTransactionReceipt({ 
    hash: stakeTxHash,
    onSuccess: () => onTransactionSuccess('Your tokens have been staked.'),
  });

  const { isLoading: isConfirmingWithdraw } = useWaitForTransactionReceipt({ 
    hash: withdrawTxHash,
    onSuccess: () => onTransactionSuccess('Your stake and rewards have been withdrawn.'),
  });
  
  const { isSuccess: isApprovalSuccess, isLoading: isConfirmingApproval } = useWaitForTransactionReceipt({ 
    hash: approvalTxHash,
  });

  React.useEffect(() => {
    if (isApprovalSuccess && actionState === 'approving') {
        toast({ title: 'Approval Confirmed', description: 'You can now complete your transaction.' });
        handleStakeTokens();
    }
  }, [isApprovalSuccess, actionState]);

  const handleApproveAndStake = async () => {
    if (!stakeAmount || !address) return;
    setActionState('approving');
    try {
      const amount = parseEther(stakeAmount);
      const approvalHash = await writeContractAsync({
        abi: chainExTokenABI,
        address: chainExTokenAddress,
        functionName: 'approve',
        args: [chainExStakingAddress, amount],
      });
      setApprovalTxHash(approvalHash);
      toast({ title: 'Approval Sent', description: 'Waiting for approval confirmation...' });
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to send approval.' });
        setActionState('idle');
    }
  };
  
  const handleStakeTokens = async () => {
    if (!stakeAmount || !address) return;
    setActionState('staking');
    try {
        const amount = parseEther(stakeAmount);
        const stakeHash = await writeContractAsync({
            abi: chainExStakingABI,
            address: chainExStakingAddress,
            functionName: 'stake',
            args: [amount],
        });
        setStakeTxHash(stakeHash);
        toast({ title: 'Transaction Sent', description: 'Staking CEX tokens...' });
        setStakeAmount('');
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to stake tokens.' });
        setActionState('idle');
    }
  };

  const handleWithdraw = async () => {
    if (!stakedBalance || stakedBalance === 0n) return;
    setActionState('withdrawing');
    try {
      const hash = await writeContractAsync({
        abi: chainExStakingABI,
        address: chainExStakingAddress,
        functionName: 'withdraw',
      });
      setWithdrawTxHash(hash);
      toast({ title: 'Transaction Sent', description: 'Withdrawing your stake and rewards...' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to withdraw.' });
      setActionState('idle');
    }
  };

  const isLoading = isConfirmingStake || isConfirmingWithdraw || isConfirmingApproval;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <PiggyBank className="h-6 w-6 text-primary" />
          <CardTitle>CEX Token Staking</CardTitle>
        </div>
        <CardDescription>
          Stake your CEX tokens to earn passive rewards.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="stake-amount">Stake CEX</Label>
            <div className="flex gap-2 mt-2">
                <Input
                id="stake-amount"
                type="number"
                placeholder="1000"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                disabled={isLoading}
                />
                <Button onClick={handleApproveAndStake} disabled={isLoading || !stakeAmount}>
                    {isLoading && <Loader2 className="animate-spin" />}
                    {actionState === 'approving' || isConfirmingApproval ? 'Approving...' : actionState === 'staking' || isConfirmingStake ? 'Staking...' : 'Stake'}
                </Button>
            </div>
        </div>
        <div className="flex justify-around bg-muted p-4 rounded-lg">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Stake</p>
                {isBalanceLoading ? <Skeleton className="h-7 w-24 mt-1" /> : (
                    <p className="text-2xl font-bold font-headline">{stakedBalance ? parseFloat(formatEther(stakedBalance)).toFixed(4) : '0'}</p>
                )}
            </div>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Rewards</p>
                {isRewardLoading ? <Skeleton className="h-7 w-24 mt-1" /> : (
                    <p className="text-2xl font-bold font-headline">{reward ? parseFloat(formatEther(reward)).toFixed(4) : '0'}</p>
                )}
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleWithdraw} variant="secondary" disabled={isLoading || !stakedBalance || stakedBalance === 0n}>
            {isConfirmingWithdraw ? (
                <>
                    <Loader2 className="mr-2 animate-spin" /> Withdrawing...
                </>
            ) : "Withdraw All & Claim Rewards"}
        </Button>
      </CardFooter>
    </Card>
  );
}

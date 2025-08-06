'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChainExTokenCard } from '@/components/features/chainex/ChainExTokenCard';
import { ChainExDEXCard } from '@/components/features/chainex/ChainExDEXCard';
import { ChainExMembershipCard } from '@/components/features/chainex/ChainExMembershipCard';
import { ChainExStakingCard } from '@/components/features/chainex/ChainExStakingCard';
import { Header } from '@/components/features/chainex/Header';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center text-center h-[60vh]">
              <h2 className="text-3xl font-bold font-headline mb-4">
                Welcome to ChainEx
              </h2>
              <p className="text-muted-foreground mb-8">
                Connect your wallet to get started with the future of decentralized exchange.
              </p>
              <ConnectButton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <ChainExTokenCard />
              </div>
              <ChainExDEXCard />
              <ChainExMembershipCard />
              <div className="md:col-span-2">
                <ChainExStakingCard />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

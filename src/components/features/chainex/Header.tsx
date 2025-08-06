'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Waves } from 'lucide-react';
import { ThemeToggle } from '../commit-kraken/ThemeToggle';
import { useAccount } from 'wagmi';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="p-4 sm:p-6 container mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
            ChainEx
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            {isConnected && <ConnectButton />}
        </div>
      </div>
    </header>
  );
}

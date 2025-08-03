'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Waves } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';

type User = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
} | null;

type HeaderProps = {
    user?: User,
    onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="p-4 sm:p-6 container mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
            CommitKraken
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={user.image || ''} alt={user.name || 'User'}/>
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                     <Button variant="ghost" size="icon" onClick={onLogout}>
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Log out</span>
                    </Button>
                </div>
            ) : (
                <Skeleton className="h-10 w-28" />
            )}
        </div>
      </div>
    </header>
  );
}

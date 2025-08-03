'use client';

import { Button } from '@/components/ui/button';
import { Github, LogOut, Waves } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';

export function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  
  const handleSignIn = async () => {
    await signIn('github');
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };


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
            {status === 'loading' ? (
                <Skeleton className="h-10 w-28" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className='relative h-10 w-10 rounded-full'>
                            <Avatar className='h-10 w-10'>
                                <AvatarImage src={user.image || ''} alt={user.name || 'User'}/>
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button onClick={handleSignIn}>
                    <Github className="mr-2 h-4 w-4" />
                    Connect to GitHub
                </Button>
            )}
        </div>
      </div>
    </header>
  );
}

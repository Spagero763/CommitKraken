'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Waves } from 'lucide-react';
import { Github } from 'lucide-react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signIn('github');
    // The page will redirect, so we don't need to set isSigningIn back to false
  };

  if (status === 'loading' || status === 'authenticated') {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-lg text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your dashboard...</span>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
            <div className="flex flex-col items-center text-center mb-8">
                <Waves className="h-12 w-12 text-primary mb-4" />
                <h1 className="text-3xl font-bold font-headline text-foreground">Welcome to CommitKraken</h1>
                <p className="text-muted-foreground mt-2">Sign in to gamify your commit history and boost your productivity.</p>
            </div>
            <Button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full button-interactive"
                size="lg"
            >
                {isSigningIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                <Github className="mr-2 h-5 w-5" />
                )}
                Sign in with GitHub
            </Button>
        </div>
    </div>
  );
}

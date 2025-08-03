'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Waves } from 'lucide-react';
import { auth, isFirebaseConfigured, signInWithGithub } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/features/commit-kraken/ThemeToggle';


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (isFirebaseConfigured && auth) {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              router.push('/');
            }
          });
          return () => unsubscribe();
        }
      }, [router]);

    const handleSignIn = async () => {
        try {
            await signInWithGithub();
            router.push('/');
        } catch (error) {
            console.error("Sign in failed:", error);
            toast({
                variant: 'destructive',
                title: 'Sign in Failed',
                description: 'Could not sign in with GitHub. Please try again.',
            });
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-md animate-fade-in-up">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <Waves className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold font-headline text-foreground">
                            CommitKraken
                        </h1>
                    </div>
                    <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                    <CardDescription>Sign in to gamify your commit history and unleash your productivity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignIn} className="w-full" disabled={!isFirebaseConfigured}>
                        <Github className="mr-2" />
                        Sign In with GitHub
                    </Button>
                    {!isFirebaseConfigured && (
                         <p className="text-xs text-muted-foreground text-center mt-4">
                            GitHub sign-in is currently disabled. Please configure Firebase to enable it.
                         </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

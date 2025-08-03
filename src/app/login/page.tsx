'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/features/commit-kraken/ThemeToggle';
import Loading from '../loading';


export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { toast } = useToast();

    useEffect(() => {
        if (status === 'authenticated') {
          router.push('/');
        }
      }, [status, router]);

    const handleSignIn = async () => {
        try {
            const result = await signIn('github', { redirect: false });
            if (result?.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Sign in failed:", error);
            toast({
                variant: 'destructive',
                title: 'Sign in Failed',
                description: 'Could not sign in with GitHub. Please try again.',
            });
        }
    };
    
    if (status === 'loading') {
        return <Loading />
    }

    if (status === 'authenticated') {
        return <Loading /> // Or a redirect component
    }

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
                    <CardTitle className="text-2xl">Welcome!</CardTitle>
                    <CardDescription>Sign in to gamify your commit history and unleash your productivity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignIn} className="w-full">
                        <Github className="mr-2" />
                        Sign In with GitHub
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

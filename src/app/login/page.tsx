'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Waves, User, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateProfileHeader } from '@/ai/flows/generate-profile-header';


export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (!name || !githubUrl || !db) {
      alert('Please enter your name and GitHub URL.');
      return;
    }
    
    setIsSigningIn(true);

    const githubUsername = githubUrl.split('/').pop() || 'github';
    const email = `${githubUsername.toLowerCase()}@example.com`;
    
    const user = {
      name,
      email,
      image: `https://avatars.githubusercontent.com/${githubUsername}`,
    };

    try {
      const userRef = doc(db, 'users', user.email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // User is new, generate header and create their document
        const headerData = await generateProfileHeader({ name: user.name });
        
        await setDoc(userRef, {
          name: user.name,
          image: user.image,
          commitsMade: 0,
          commitStreak: 15,
          topicsCompleted: [],
          motto: headerData.motto,
          imageUrl: headerData.imageUrl,
        });
      }

      // Store the mock session in localStorage
      localStorage.setItem('mockUserSession', JSON.stringify(user));
      
      router.push('/');

    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred during sign-in. Please try again.");
      setIsSigningIn(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Waves className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Welcome to CommitKraken
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your details to start gamifying your commit history.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="e.g., Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                disabled={isSigningIn}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub Profile URL</Label>
             <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="github-url"
                type="text"
                placeholder="e.g., https://github.com/ada"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="pl-10"
                disabled={isSigningIn}
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSignIn}
          disabled={isSigningIn || !name || !githubUrl}
          className="w-full button-interactive mt-6"
          size="lg"
        >
          {isSigningIn ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}

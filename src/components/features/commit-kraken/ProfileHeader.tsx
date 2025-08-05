
'use client';

import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Code } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

type ProfileHeaderProps = {
  user: User;
  imageUrl: string;
  motto: string;
};

export function ProfileHeader({ user, imageUrl, motto }: ProfileHeaderProps) {
  if (!user) {
    return <Skeleton className="h-[200px] w-full rounded-lg" />;
  }

  return (
    <div
      className="relative flex h-[200px] w-full items-end justify-start rounded-lg bg-cover bg-center p-6 text-white shadow-lg animate-fade-in-up"
      style={{
        backgroundImage: imageUrl 
          ? `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(${imageUrl})`
          : 'linear-gradient(to right, #111, #333)',
      }}
    >
      <div className="z-10">
        <div className="flex items-center gap-4">
           <Avatar className='h-16 w-16 border-2 border-primary bg-background/20 backdrop-blur-sm'>
              <AvatarImage src={user.image || ''} alt={user.name || 'User'}/>
              <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold font-headline">
              {user.name || 'Welcome, Coder!'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Code className="h-4 w-4 text-accent" />
              <p className="text-sm font-light italic text-accent">
                {motto || 'Code with passion. Build with purpose.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { getProfileHeader } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Code } from 'lucide-react';

type ProfileHeaderProps = {
  user: User | null;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [headerData, setHeaderData] = useState<{
    imageUrl: string;
    motto: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeader = async () => {
      setIsLoading(true);
      const result = await getProfileHeader({
        name: user?.displayName || 'The Coder',
      });
      if (result.success && result.data) {
        setHeaderData(result.data);
      }
      setIsLoading(false);
    };

    fetchHeader();
  }, [user]);

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-lg" />;
  }

  return (
    <div
      className="relative flex h-[200px] w-full items-end justify-start rounded-lg bg-cover bg-center p-6 text-white shadow-lg animate-fade-in-up"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(${headerData?.imageUrl})`,
      }}
    >
      <div className="z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-full border-2 border-primary p-2 bg-background/20 backdrop-blur-sm">
            <UserIcon className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-headline">
              {user?.displayName || 'Welcome, Coder!'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Code className="h-4 w-4 text-accent" />
              <p className="text-sm font-light italic text-accent">
                {headerData?.motto}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

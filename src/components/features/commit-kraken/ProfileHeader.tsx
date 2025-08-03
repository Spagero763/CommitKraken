'use client';

import { useState, useEffect } from 'react';
import type { Session } from 'next-auth';
import { getProfileHeader } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Code } from 'lucide-react';

type ProfileHeaderProps = {
  user: Session['user'] | null;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [headerData, setHeaderData] = useState<{
    imageUrl: string;
    motto: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeader = async () => {
      if (!user?.name) {
        setIsLoading(false);
        return;
      };
      setIsLoading(true);
      try {
        const result = await getProfileHeader({
          name: user.name,
        });
        if (result.success && result.data) {
          setHeaderData(result.data);
        }
      } catch (error) {
        console.error("Failed to generate profile header", error);
        setHeaderData(null); // Ensure no broken UI on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeader();
  }, [user]);

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-lg" />;
  }

  if (!user) {
    return null; // Don't render anything if there's no user
  }

  return (
    <div
      className="relative flex h-[200px] w-full items-end justify-start rounded-lg bg-cover bg-center p-6 text-white shadow-lg animate-fade-in-up"
      style={{
        backgroundImage: headerData?.imageUrl 
          ? `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(${headerData.imageUrl})`
          : 'linear-gradient(to right, #111, #333)',
      }}
    >
      <div className="z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-full border-2 border-primary p-2 bg-background/20 backdrop-blur-sm">
            <UserIcon className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-headline">
              {user.name || 'Welcome, Coder!'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Code className="h-4 w-4 text-accent" />
              <p className="text-sm font-light italic text-accent">
                {headerData?.motto || 'Code with passion. Build with purpose.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

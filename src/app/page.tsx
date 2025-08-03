'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileHeader } from '@/components/features/commit-kraken/ProfileHeader';
import { ProgressCard } from '@/components/features/commit-kraken/ProgressCard';
import { StreakCard } from '@/components/features/commit-kraken/StreakCard';
import { RepositoryCard } from '@/components/features/commit-kraken/RepositoryCard';
import { AiCommitGenerator } from '@/components/features/commit-kraken/AiCommitGenerator';
import { SchedulerCard } from '@/components/features/commit-kraken/SchedulerCard';
import { CommitChallengeCard } from '@/components/features/commit-kraken/CommitChallengeCard';
import {
  UpcomingCommitsTable,
  type ScheduledCommit,
} from '@/components/features/commit-kraken/UpcomingCommitsTable';
import { CommitActivityChart } from '@/components/features/commit-kraken/CommitActivityChart';
import { AchievementsCard } from '@/components/features/commit-kraken/AchievementsCard';
import { Header } from '@/components/features/commit-kraken/Header';
import { VideoGeneratorCard } from '@/components/features/commit-kraken/VideoGeneratorCard';
import Loading from './loading';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const initialCommits: ScheduledCommit[] = [
  {
    message: 'refactor: Update styling components',
    date: '2024-08-15',
    time: '10:00 AM',
    status: 'Scheduled',
  },
  {
    message: 'docs: Add documentation for scheduler',
    date: '2024-08-15',
    time: '02:30 PM',
    status: 'Scheduled',
  },
  {
    message: 'fix: Resolve issue with AI message generation',
    date: '2024-08-16',
    time: '11:00 AM',
    status: 'Scheduled',
  },
  {
    message: 'feat: Initial dashboard setup',
    date: '2024-08-14',
    time: '04:00 PM',
    status: 'Done',
  },
];

type MockUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [scheduledCommits, setScheduledCommits] = useState<ScheduledCommit[]>(initialCommits);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(0);
  const [commitStreak, setCommitStreak] = useState(15);
  const [topicsCompleted, setTopicsCompleted] = useState<string[]>([]);
  
  useEffect(() => {
    // Check for mock session in localStorage
    const savedSession = localStorage.getItem('mockUserSession');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('mockUserSession');
    router.push('/login');
  };

  const addCommit = (commit: Omit<ScheduledCommit, 'status'>) => {
    const newCommit: ScheduledCommit = { ...commit, status: 'Scheduled' };
    setScheduledCommits((prevCommits) =>
      [...prevCommits, newCommit].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  };
  
  const handleCorrectAnswer = (topic: string) => {
    setAnsweredCorrectly(count => count + 1);
    if (!topicsCompleted.includes(topic)) {
      setTopicsCompleted(prevTopics => [...prevTopics, topic]);
    }
  }

  if (isLoading || !user) {
    return <Loading />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <ProfileHeader user={user} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className='animate-fade-in-up' style={{animationDelay: '100ms'}}>
              <ProgressCard commitsMade={answeredCorrectly} />
            </div>
            <div className='animate-fade-in-up' style={{animationDelay: '200ms'}}>
              <StreakCard streak={commitStreak} />
            </div>
            <div className='animate-fade-in-up' style={{animationDelay: '300ms'}}>
              <RepositoryCard user={user} />
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{animationDelay: '400ms'}}>
              <CommitActivityChart />
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <AchievementsCard correctAnswers={answeredCorrectly} streak={commitStreak} topicsCompleted={topicsCompleted.length} />
            </div>
            <div className="lg:col-span-3 animate-fade-in-up" style={{animationDelay: '600ms'}}>
              <VideoGeneratorCard />
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{animationDelay: '700ms'}}>
              <CommitChallengeCard onCorrectAnswer={handleCorrectAnswer} />
            </div>
            <div className="md:col-span-2 lg:col-span-2 animate-fade-in-up" style={{animationDelay: '800ms'}}>
              <AiCommitGenerator />
            </div>
            <div className="lg:col-span-1 animate-fade-in-up" style={{animationDelay: '900ms'}}>
              <SchedulerCard onScheduleCommit={addCommit} />
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{animationDelay: '1000ms'}}>
              <UpcomingCommitsTable scheduledCommits={scheduledCommits} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Header } from '@/components/features/commit-kraken/Header';
import { ProgressCard } from '@/components/features/commit-kraken/ProgressCard';
import { StreakCard } from '@/components/features/commit-kraken/StreakCard';
import { RepositoryCard } from '@/components/features/commit-kraken/RepositoryCard';
import { AiCommitGenerator } from '@/components/features/commit-kraken/AiCommitGenerator';
import { SchedulerCard } from '@/components/features/commit-kraken/SchedulerCard';
import {
  UpcomingCommitsTable,
  type ScheduledCommit,
} from '@/components/features/commit-kraken/UpcomingCommitsTable';

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

export default function Home() {
  const [scheduledCommits, setScheduledCommits] = useState<ScheduledCommit[]>(initialCommits);

  const addCommit = (commit: Omit<ScheduledCommit, 'status'>) => {
    const newCommit: ScheduledCommit = { ...commit, status: 'Scheduled' };
    setScheduledCommits((prevCommits) =>
      [...prevCommits, newCommit].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProgressCard />
            <StreakCard />
            <RepositoryCard />
            <div className="lg:col-span-2">
              <AiCommitGenerator />
            </div>
            <SchedulerCard onScheduleCommit={addCommit} />
            <div className="lg:col-span-3">
              <UpcomingCommitsTable scheduledCommits={scheduledCommits} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

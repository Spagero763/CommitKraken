import { Header } from '@/components/features/commit-kraken/Header';
import { ProgressCard } from '@/components/features/commit-kraken/ProgressCard';
import { StreakCard } from '@/components/features/commit-kraken/StreakCard';
import { RepositoryCard } from '@/components/features/commit-kraken/RepositoryCard';
import { AiCommitGenerator } from '@/components/features/commit-kraken/AiCommitGenerator';
import { SchedulerCard } from '@/components/features/commit-kraken/SchedulerCard';
import { UpcomingCommitsTable } from '@/components/features/commit-kraken/UpcomingCommitsTable';

export default function Home() {
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
            <SchedulerCard />
            <div className="lg:col-span-3">
              <UpcomingCommitsTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

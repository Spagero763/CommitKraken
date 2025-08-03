'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

type MockUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [scheduledCommits, setScheduledCommits] = useState<ScheduledCommit[]>([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(0);
  const [commitStreak, setCommitStreak] = useState(15);
  const [topicsCompleted, setTopicsCompleted] = useState<string[]>([]);
  
  useEffect(() => {
    const savedSession = localStorage.getItem('mockUserSession');
    if (savedSession) {
      const parsedUser = JSON.parse(savedSession);
      setUser(parsedUser);
      fetchCommits(parsedUser.name);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const fetchCommits = async (userName: string | null) => {
    if (!db || !userName) return;
    try {
      const commitsRef = collection(db, 'users', userName, 'scheduledCommits');
      const q = query(commitsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const commits = querySnapshot.docs.map(doc => doc.data() as ScheduledCommit);
      setScheduledCommits(commits);
    } catch (error) {
        console.error("Error fetching commits: ", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mockUserSession');
    router.push('/login');
  };

  const addCommit = async (commit: Omit<ScheduledCommit, 'status'>) => {
    if (!db || !user?.name) return;
    const newCommit: ScheduledCommit = { ...commit, status: 'Scheduled' };
    try {
      const commitsRef = collection(db, 'users', user.name, 'scheduledCommits');
      await addDoc(commitsRef, newCommit);
      setScheduledCommits(prev => [newCommit, ...prev]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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

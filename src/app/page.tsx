'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
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

type UserProgress = {
  commitsMade: number;
  commitStreak: number;
  topicsCompleted: string[];
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [scheduledCommits, setScheduledCommits] = useState<ScheduledCommit[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    commitsMade: 0,
    commitStreak: 0,
    topicsCompleted: [],
  });
  
  useEffect(() => {
    const savedSession = localStorage.getItem('mockUserSession');
    if (savedSession) {
      const parsedUser = JSON.parse(savedSession) as MockUser;
      setUser(parsedUser);
      if (parsedUser.name) {
        fetchCommits(parsedUser.name);
        fetchUserProgress(parsedUser.name);
      }
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const fetchCommits = async (userName: string) => {
    if (!db) return;
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

  const fetchUserProgress = async (userName: string) => {
    if (!db) return;
    try {
        const progressRef = doc(db, 'users', userName, 'progress');
        const docSnap = await getDoc(progressRef);
        if (docSnap.exists()) {
            setUserProgress(docSnap.data() as UserProgress);
        } else {
            // Initialize progress if it doesn't exist
            const initialProgress: UserProgress = { commitsMade: 0, commitStreak: 15, topicsCompleted: [] };
            await setDoc(progressRef, initialProgress);
            setUserProgress(initialProgress);
        }
    } catch (error) {
        console.error("Error fetching user progress: ", error);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('mockUserSession');
    setUser(null);
    router.push('/login');
  };

  const addCommit = async (commit: Omit<ScheduledCommit, 'status'>) => {
    if (!db || !user?.name) return;
    const newCommit: ScheduledCommit = { ...commit, status: 'Scheduled' };
    try {
      const commitsRef = collection(db, 'users', user.name, 'scheduledCommits');
      await addDoc(commitsRef, newCommit);
      // Re-fetch to keep it simple, or add to state optimistically
      fetchCommits(user.name);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  
  const handleCorrectAnswer = async (topic: string) => {
    if (!db || !user?.name) return;
    
    const newProgress: UserProgress = {
      ...userProgress,
      commitsMade: userProgress.commitsMade + 1,
      topicsCompleted: userProgress.topicsCompleted.includes(topic) 
        ? userProgress.topicsCompleted 
        : [...userProgress.topicsCompleted, topic],
    };

    try {
      const progressRef = doc(db, 'users', user.name, 'progress');
      await setDoc(progressRef, newProgress);
      setUserProgress(newProgress);
    } catch (error) {
      console.error("Error updating user progress: ", error);
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
              <ProgressCard commitsMade={userProgress.commitsMade} />
            </div>
            <div className='animate-fade-in-up' style={{animationDelay: '200ms'}}>
              <StreakCard streak={userProgress.commitStreak} />
            </div>
            <div className='animate-fade-in-up' style={{animationDelay: '300ms'}}>
              <RepositoryCard user={user} />
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{animationDelay: '400ms'}}>
              <CommitActivityChart />
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <AchievementsCard correctAnswers={userProgress.commitsMade} streak={userProgress.commitStreak} topicsCompleted={userProgress.topicsCompleted.length} />
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc, deleteDoc, updateDoc, Timestamp, where } from 'firebase/firestore';
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
import { CommitActivityChart, type CommitActivityData } from '@/components/features/commit-kraken/CommitActivityChart';
import { AchievementsCard } from '@/components/features/commit-kraken/AchievementsCard';
import { Header } from '@/components/features/commit-kraken/Header';
import { VideoGeneratorCard } from '@/components/features/commit-kraken/VideoGeneratorCard';
import Loading from './loading';
import { subDays, format, startOfDay } from 'date-fns';

type MockUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UserProgress = {
  commitsMade: number;
  commitStreak: number;
  topicsCompleted: string[];
  motto: string;
  imageUrl: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [scheduledCommits, setScheduledCommits] = useState<ScheduledCommit[]>([]);
  const [commitActivity, setCommitActivity] = useState<CommitActivityData[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    commitsMade: 0,
    commitStreak: 0,
    topicsCompleted: [],
    motto: '',
    imageUrl: '',
  });
  
  useEffect(() => {
    const savedSession = localStorage.getItem('mockUserSession');
    if (savedSession) {
      const parsedUser = JSON.parse(savedSession) as MockUser;
      setUser(parsedUser);
      if (parsedUser.email) {
        fetchCommits(parsedUser.email);
        fetchUserProgress(parsedUser.email);
        fetchCommitActivity(parsedUser.email);
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if(!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const fetchCommits = async (userId: string) => {
    if (!db) return;
    try {
      const commitsRef = collection(db, 'users', userId, 'scheduledCommits');
      const q = query(commitsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const commits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduledCommit));
      setScheduledCommits(commits);
    } catch (error) {
        console.error("Error fetching commits: ", error);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchCommitActivity = async (userId: string) => {
    if (!db) return;
    try {
      const activityRef = collection(db, 'users', userId, 'commitActivity');
      const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
      const q = query(activityRef, where('timestamp', '>=', sevenDaysAgo));
      const querySnapshot = await getDocs(q);
      
      const activityByDay: {[key: string]: number} = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const date = (data.timestamp as Timestamp).toDate();
        const formattedDate = format(date, 'MMM d');
        activityByDay[formattedDate] = (activityByDay[formattedDate] || 0) + 1;
      });

      const chartData = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const formattedDate = format(date, 'MMM d');
        return {
          date: formattedDate,
          commits: activityByDay[formattedDate] || 0,
        };
      });

      setCommitActivity(chartData);

    } catch (error) {
      console.error("Error fetching commit activity: ", error);
    }
  }

  const fetchUserProgress = async (userId: string) => {
    if (!db) return;
    try {
        const progressRef = doc(db, 'users', userId);
        const docSnap = await getDoc(progressRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProgress({
                commitsMade: data.commitsMade || 0,
                commitStreak: data.commitStreak || 15,
                topicsCompleted: data.topicsCompleted || [],
                motto: data.motto || 'Code with passion. Build with purpose.',
                imageUrl: data.imageUrl || '',
            });
        } else {
            // This case should ideally not be hit if login page sets progress
            const initialProgress: UserProgress = { commitsMade: 0, commitStreak: 15, topicsCompleted: [], motto: '', imageUrl: '' };
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

  const addCommit = async (commit: Omit<ScheduledCommit, 'status' | 'id'>) => {
    if (!db || !user?.email) return;
    const newCommit: Omit<ScheduledCommit, 'id'> = { ...commit, status: 'Scheduled' };
    try {
      const commitsRef = collection(db, 'users', user.email, 'scheduledCommits');
      const docRef = await addDoc(commitsRef, newCommit);
      setScheduledCommits(prevCommits => [{...newCommit, id: docRef.id}, ...prevCommits]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateCommit = async (commit: ScheduledCommit) => {
    if (!db || !user?.email) return;
    try {
        const commitRef = doc(db, 'users', user.email, 'scheduledCommits', commit.id);
        await updateDoc(commitRef, {
            message: commit.message,
            date: commit.date,
            time: commit.time,
        });
        setScheduledCommits(prevCommits => prevCommits.map(c => c.id === commit.id ? commit : c));
    } catch (error) {
        console.error("Error updating document: ", error);
    }
  };

  const deleteCommit = async (commitId: string) => {
    if (!db || !user?.email) return;
    try {
        const commitRef = doc(db, 'users', user.email, 'scheduledCommits', commitId);
        await deleteDoc(commitRef);
        setScheduledCommits(prevCommits => prevCommits.filter(c => c.id !== commitId));
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
  };
  
  const handleCorrectAnswer = async (topic: string) => {
    if (!db || !user?.email) return;
    
    const today = format(new Date(), 'MMM d');
    setCommitActivity(prev => {
        const todayData = prev.find(d => d.date === today);
        if (todayData) {
            return prev.map(d => d.date === today ? {...d, commits: d.commits + 1} : d);
        }
        return [...prev, { date: today, commits: 1 }];
    });


    const updatedProgress = {
      ...userProgress,
      commitsMade: userProgress.commitsMade + 1,
      topicsCompleted: [...new Set([...userProgress.topicsCompleted, topic])],
    };
    setUserProgress(updatedProgress);

    try {
      const progressRef = doc(db, 'users', user.email);
      await setDoc(progressRef, { 
        commitsMade: updatedProgress.commitsMade,
        topicsCompleted: updatedProgress.topicsCompleted,
       }, { merge: true });

      const activityRef = collection(db, 'users', user.email, 'commitActivity');
      await addDoc(activityRef, {
        timestamp: Timestamp.now(),
        topic: topic,
      });

    } catch (error) {
      console.error("Error updating user progress: ", error);
      // Re-fetch to ensure UI consistency on error
      if (user?.email) {
        fetchUserProgress(user.email);
        fetchCommitActivity(user.email);
      }
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
          <ProfileHeader user={user} imageUrl={userProgress.imageUrl} motto={userProgress.motto} />
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
              <CommitActivityChart data={commitActivity} />
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
              <UpcomingCommitsTable 
                scheduledCommits={scheduledCommits} 
                onEditCommit={updateCommit}
                onDeleteCommit={deleteCommit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

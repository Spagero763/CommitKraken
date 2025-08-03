'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Award, BadgeCheck, Flame, GitBranch, Medal, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

type AchievementsCardProps = {
  correctAnswers: number;
  streak: number;
  topicsCompleted: number;
};

export function AchievementsCard({ correctAnswers, streak, topicsCompleted }: AchievementsCardProps) {

  const achievements = [
    {
      icon: <Trophy className="h-8 w-8 text-yellow-400" />,
      title: 'Streak Starter',
      description: 'Achieve a 5-day commit streak.',
      unlocked: streak >= 5,
    },
    {
      icon: <Flame className="h-8 w-8 text-orange-400" />,
      title: 'Streak Pro',
      description: 'Achieve a 15-day commit streak.',
      unlocked: streak >= 15,
    },
    {
      icon: <Medal className="h-8 w-8 text-slate-400" />,
      title: 'Streak Master',
      description: 'Achieve a 30-day commit streak.',
      unlocked: streak >= 30,
    },
    {
      icon: <BadgeCheck className="h-8 w-8 text-green-400" />,
      title: 'Challenge Champion',
      description: 'Answer 10 challenge questions correctly.',
      unlocked: correctAnswers >= 10,
    },
    {
        icon: <Award className="h-8 w-8 text-blue-400" />,
        title: 'Commit Centurion',
        description: 'Make 100 commits.',
        unlocked: correctAnswers >= 100,
    },
    {
        icon: <Star className="h-8 w-8 text-purple-400" />,
        title: 'Polymath',
        description: 'Complete a challenge in all topics.',
        unlocked: topicsCompleted >= 5,
    },
    {
        icon: <GitBranch className="h-8 w-8 text-red-400" />,
        title: 'Commit Pioneer',
        description: 'Make your first commit.',
        unlocked: correctAnswers >= 1,
    }
  ].sort((a, b) => (a.unlocked === b.unlocked) ? 0 : a.unlocked ? -1 : 1);


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <CardTitle>Achievements</CardTitle>
        </div>
        <CardDescription>
          Unlock badges for your accomplishments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center text-center gap-2 rounded-lg border p-4 transition-all duration-300',
                achievement.unlocked ? 'bg-card shadow-lg' : 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'flex-shrink-0 transition-transform duration-500',
                   achievement.unlocked && 'animate-fade-in-up'
                )}
              >
                {React.cloneElement(achievement.icon, { className: cn(achievement.icon.props.className, !achievement.unlocked && 'grayscale opacity-30')})}
              </div>
              <div className="flex-1">
                <p className={cn("font-semibold", achievement.unlocked ? 'text-card-foreground': 'text-muted-foreground')}>
                  {achievement.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Award, BadgeCheck, Medal, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const achievements = [
  {
    icon: <Trophy className="h-8 w-8 text-yellow-400" />,
    title: 'Streak Starter',
    description: 'Achieve a 5-day commit streak.',
    unlocked: true,
  },
  {
    icon: <Medal className="h-8 w-8 text-orange-400" />,
    title: 'Streak Pro',
    description: 'Achieve a 10-day commit streak.',
    unlocked: true,
  },
  {
    icon: <Award className="h-8 w-8 text-indigo-400" />,
    title: 'Commit Centurion',
    description: 'Make 100 commits.',
    unlocked: false,
  },
  {
    icon: <BadgeCheck className="h-8 w-8 text-green-400" />,
    title: 'Challenge Champion',
    description: 'Answer 10 challenge questions correctly.',
    unlocked: false,
  },
];

export function AchievementsCard() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-4 rounded-lg border p-4 transition-opacity',
                !achievement.unlocked && 'opacity-50'
              )}
            >
              <div
                className={cn(
                  'flex-shrink-0',
                  !achievement.unlocked && 'grayscale'
                )}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-card-foreground">
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

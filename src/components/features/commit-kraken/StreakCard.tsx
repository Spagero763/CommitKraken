import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame } from 'lucide-react';

type StreakCardProps = {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Commit Streak</CardTitle>
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <CardDescription>Keep the fire burning!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-center gap-2">
            <span className="font-bold text-6xl font-headline text-orange-500">{streak}</span>
            <span className="text-xl text-muted-foreground">Days</span>
        </div>
      </CardContent>
    </Card>
  );
}

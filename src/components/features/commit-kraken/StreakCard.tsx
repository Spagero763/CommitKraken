import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export function StreakCard() {
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
        <div className="flex items-center gap-3">
            <span className="font-bold text-4xl font-headline text-orange-500">15</span>
            <span className="text-xl text-muted-foreground">Days</span>
        </div>
      </CardContent>
    </Card>
  );
}

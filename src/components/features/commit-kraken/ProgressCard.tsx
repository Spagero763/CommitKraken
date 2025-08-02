import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

export function ProgressCard() {
  const commitsMade = 128;
  const goalCommits = 500;
  const progress = (commitsMade / goalCommits) * 100;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Commit Goal</CardTitle>
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>You're on your way to 500 commits!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-bold text-4xl font-headline">{commitsMade}</span>
          <span className="text-lg text-muted-foreground">/ {goalCommits}</span>
        </div>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}

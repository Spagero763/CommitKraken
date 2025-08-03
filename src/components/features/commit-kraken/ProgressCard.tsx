import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

type ProgressCardProps = {
  commitsMade?: number;
}

export function ProgressCard({ commitsMade = 0 }: ProgressCardProps) {
  const goalCommits = 500;
  const progress = (commitsMade / goalCommits) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground card-interactive">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Commit Goal</CardTitle>
          <Target className="h-5 w-5 text-primary-foreground/80" />
        </div>
        <CardDescription className="text-primary-foreground/90">You're on your way to 500 commits!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-bold text-5xl font-headline">{commitsMade}</span>
          <span className="text-xl text-primary-foreground/80">/ {goalCommits}</span>
        </div>
        <Progress value={progress} className="bg-primary-foreground/30 [&>div]:bg-primary-foreground" />
      </CardContent>
    </Card>
  );
}

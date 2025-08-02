import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

export function ProgressCard() {
  const commitsMade = 128;
  const goalCommits = 1500;
  const progress = (commitsMade / goalCommits) * 100;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Progress</CardTitle>
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>Towards your goal of {goalCommits} commits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="font-bold text-2xl font-headline">{commitsMade}</span>
          <div className="flex-1">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1 text-right">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

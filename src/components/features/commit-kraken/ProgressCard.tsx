import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target } from 'lucide-react';

export function ProgressCard() {
  const commitsMade = 128;
  const goalCommits = commitsMade + 1;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Next Commit</CardTitle>
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>Keep the momentum going!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="font-bold text-4xl font-headline">{commitsMade}</div>
            <div className="text-sm text-muted-foreground">commits made</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';
import type { Session } from 'next-auth';

type RepositoryCardProps = {
  user: Session['user'] | null;
}

export function RepositoryCard({ user }: RepositoryCardProps) {
  return (
    <Card className='card-interactive'>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Repository</CardTitle>
            <GitBranch className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>Your connected repository</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 bg-muted p-3 rounded-md border">
            <div className="font-mono text-sm font-semibold text-muted-foreground">
                {user?.name ? `${user.name}/commit-kraken-project` : 'your-org/commit-kraken-project'}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

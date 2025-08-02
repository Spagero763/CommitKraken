import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

export function RepositoryCard() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Repository</CardTitle>
            <GitBranch className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>Your connected repository</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 bg-secondary p-3 rounded-md">
            <div className="font-mono text-sm font-semibold text-secondary-foreground">
                your-org/commit-kraken-project
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

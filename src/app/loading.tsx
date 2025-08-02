import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-lg text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading your dashboard...</span>
      </div>
    </div>
  );
}

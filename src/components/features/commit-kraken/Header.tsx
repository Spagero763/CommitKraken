import { Button } from '@/components/ui/button';
import { Github, Waves } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 sm:p-6 container mx-auto">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <Waves className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
            CommitKraken
          </h1>
        </div>
        <Button>
          <Github className="mr-2" />
          Connect to GitHub
        </Button>
      </div>
    </header>
  );
}

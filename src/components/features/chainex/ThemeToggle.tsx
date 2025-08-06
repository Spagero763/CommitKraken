'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  // The theme is initialized to 'dark' in the RootLayout, so we can use that as the default.
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    const initialTheme = root.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.remove(theme);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    root.classList.add(newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled={true} />;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

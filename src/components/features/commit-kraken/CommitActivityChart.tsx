'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { GitCommit } from 'lucide-react';
import { subDays, format } from 'date-fns';
import { useEffect, useState } from 'react';

const chartConfig = {
  desktop: {
    label: 'Commits',
    color: 'hsl(var(--primary))',
  },
};

type ChartData = {
    date: string;
    desktop: number;
}[];

export function CommitActivityChart() {
  const [chartData, setChartData] = useState<ChartData>([]);

  useEffect(() => {
    const today = new Date();
    const data = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        return {
            date: format(date, 'MMM d'),
            desktop: Math.floor(Math.random() * 10) + 1,
        };
    });
    setChartData(data);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <GitCommit className="h-6 w-6 text-primary" />
          <CardTitle>Commit Activity</CardTitle>
        </div>
        <CardDescription>Your commit history for the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="desktop" 
              fill="var(--color-desktop)" 
              radius={8} 
              animationDuration={500}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

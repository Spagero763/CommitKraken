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

const chartConfig = {
  commits: {
    label: 'Commits',
    color: 'hsl(var(--primary))',
  },
};

export type CommitActivityData = {
  date: string;
  commits: number;
};

type CommitActivityChartProps = {
  data: CommitActivityData[];
};

export function CommitActivityChart({ data }: CommitActivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <GitCommit className="h-6 w-6 text-primary" />
          <CardTitle>Commit Activity</CardTitle>
        </div>
        <CardDescription>
          Your commit history for the last 7 days from challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 20 }}
          >
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
              dataKey="commits"
              fill="var(--color-commits)"
              radius={8}
              animationDuration={500}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

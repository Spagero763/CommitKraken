'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CalendarPlus, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ScheduledCommit } from './UpcomingCommitsTable';

const formSchema = z.object({
  message: z.string().min(5, {
    message: 'Commit message must be at least 5 characters.',
  }),
  date: z.date({
    required_error: 'A date is required.',
  }),
  time: z.string().min(1, { message: 'A time is required.' }),
});

type SchedulerCardProps = {
  onScheduleCommit: (commit: Omit<ScheduledCommit, 'status'>) => void;
};

export function SchedulerCard({ onScheduleCommit }: SchedulerCardProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      date: new Date(),
      time: '09:00',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { message, date, time } = values;
    const [hours, minutes] = time.split(':');
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(hours, 10));
    dateWithTime.setMinutes(parseInt(minutes, 10));

    const formattedTime = dateWithTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });


    onScheduleCommit({
      message,
      date: format(dateWithTime, 'yyyy-MM-dd'),
      time: formattedTime,
    });
    
    toast({
      title: 'Commit Scheduled!',
      description: `Your commit "${message}" is scheduled.`,
    });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CalendarPlus className="h-6 w-6 text-primary" />
              <CardTitle>Schedule a Commit</CardTitle>
            </div>
            <CardDescription>Plan your commits in advance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commit Message</FormLabel>
                  <FormControl>
                    <Input placeholder="feat: Implement new feature" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="time" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <CalendarPlus className="mr-2" />
              Schedule Commit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

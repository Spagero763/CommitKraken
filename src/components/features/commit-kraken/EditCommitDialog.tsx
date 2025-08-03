'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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

type EditCommitDialogProps = {
  commit: ScheduledCommit;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (commit: ScheduledCommit) => Promise<void>;
};

export function EditCommitDialog({ commit, isOpen, onClose, onUpdate }: EditCommitDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (commit) {
      // Parse the date and time from the commit strings to pre-fill the form
      const date = parse(commit.date, 'yyyy-MM-dd', new Date());
      const time24hr = format(parse(commit.time, 'hh:mm a', new Date()), 'HH:mm');

      form.reset({
        message: commit.message,
        date: date,
        time: time24hr,
      });
    }
  }, [commit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUpdating(true);
    const { message, date, time } = values;
    
    // Combine date and time correctly for formatting
    const [hours, minutes] = time.split(':');
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(hours, 10));
    dateWithTime.setMinutes(parseInt(minutes, 10));

    const updatedCommit: ScheduledCommit = {
      ...commit,
      message,
      date: format(dateWithTime, 'yyyy-MM-dd'),
      time: format(dateWithTime, 'hh:mm a'),
    };
    
    await onUpdate(updatedCommit);
    setIsUpdating(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Scheduled Commit</DialogTitle>
          <DialogDescription>
            Make changes to your scheduled commit here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                  <FormItem className="flex flex-col">
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
             <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose} disabled={isUpdating}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

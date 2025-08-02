'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Copy, Loader2 } from 'lucide-react';
import { getAiCommitMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  diff: z.string().min(10, {
    message: 'Diff must be at least 10 characters.',
  }),
});

export function AiCommitGenerator() {
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diff: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedMessage('');
    const result = await getAiCommitMessage(values);
    setIsLoading(false);

    if (result.success) {
      setGeneratedMessage(result.message || '');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  function handleCopy() {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    toast({
      title: 'Copied!',
      description: 'Commit message copied to clipboard.',
    });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-accent" />
              <CardTitle>AI Commit Message Generator</CardTitle>
            </div>
            <CardDescription>
              Paste your code changes (diff) below to generate a commit message.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="diff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Git Diff</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your git diff here..."
                      className="min-h-[150px] font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {generatedMessage && (
              <FormItem>
                <FormLabel>Generated Message</FormLabel>
                <div className="flex gap-2">
                  <Input readOnly value={generatedMessage} className="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : <Bot className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

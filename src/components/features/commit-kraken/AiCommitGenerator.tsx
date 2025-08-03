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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Copy, Loader2 } from 'lucide-react';
import { getAiCommitMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const personalities = ['professional', 'witty', 'concise', 'descriptive'];
const commitTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];

const formSchema = z.object({
  diff: z.string().min(10, {
    message: 'Diff must be at least 10 characters.',
  }),
  personality: z.string(),
  type: z.string(),
});

export function AiCommitGenerator() {
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diff: '',
      personality: 'professional',
      type: 'feat',
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
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle>AI Commit Message Generator</CardTitle>
            </div>
            <CardDescription>
              Paste your code changes (diff) below and select your preferences to generate a commit message.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commit Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a commit type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commitTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Personality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a personality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {personalities.map(p => (
                          <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <Button type="submit" disabled={isLoading}>
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

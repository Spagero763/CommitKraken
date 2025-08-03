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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clapperboard, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
});

export function VideoGeneratorCard() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A kraken coding on a laptop in a neon-lit underwater city.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setVideoUrl(null);
    setStatusMessage('Sending prompt to the video generator...');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: values.prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video.');
      }

      const result = await response.json();

      if (result.success && result.videoUrl) {
        setStatusMessage('Video generated successfully!');
        setVideoUrl(result.videoUrl);
        toast({
          title: 'Success!',
          description: 'Your video has been generated.',
        });
      } else {
        throw new Error(result.error || 'Failed to generate video.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred.';
      setStatusMessage('An error occurred during video generation.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="card-interactive">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clapperboard className="h-6 w-6 text-primary" />
              <CardTitle>AI Video Generator</CardTitle>
            </div>
            <CardDescription>
              Describe a scene and the AI will generate a short video clip. This
              can take up to a minute.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Prompt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{statusMessage} Please wait...</span>
              </div>
            )}
            {videoUrl && (
              <div>
                <FormLabel>Generated Video</FormLabel>
                <div className="mt-2 rounded-lg border bg-black">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full aspect-video"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="button-interactive"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Video
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

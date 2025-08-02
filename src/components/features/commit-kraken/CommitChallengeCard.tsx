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
import { BrainCircuit, Loader2 } from 'lucide-react';
import { getNewQuestion } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  answer: z.string().min(10, {
    message: 'Answer must be at least 10 characters.',
  }),
});

type CommitChallengeCardProps = {
  onCorrectAnswer: () => void;
};

export function CommitChallengeCard({ onCorrectAnswer }: CommitChallengeCardProps) {
  const [question, setQuestion] = useState<{ text: string; topic: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: '',
    },
  });

  const handleGetQuestion = async () => {
    setIsLoading(true);
    setQuestion(null);
    form.reset();
    const result = await getNewQuestion({ topic: 'JavaScript' }); // Hardcoded for now
    setIsLoading(false);

    if (result.success && result.question && result.topic) {
      setQuestion({ text: result.question, topic: result.topic });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement answer checking
    console.log(values);
    setIsChecking(true);
    // Simulate checking
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChecking(false);
    onCorrectAnswer();
    toast({
      title: 'Correct!',
      description: 'Great job! That counts as a commit.',
    });
    setQuestion(null);
    form.reset();
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <CardTitle>Commit Challenge</CardTitle>
        </div>
        <CardDescription>
          Answer a question to make a commit. Each correct answer counts as one commit towards your goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!question && (
          <div className="flex justify-center">
            <Button onClick={handleGetQuestion} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get New Question
            </Button>
          </div>
        )}
        {question && (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <Alert>
                  <AlertTitle className='font-semibold'>{question.topic} Question</AlertTitle>
                  <AlertDescription>{question.text}</AlertDescription>
                </Alert>

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Answer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your answer here..."
                        className="min-h-[100px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" disabled={isChecking}>
                  {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Answer
                </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

'use server';

/**
 * @fileOverview A flow for generating software development questions.
 *
 * - generateQuestion - A function that generates a question.
 * - GenerateQuestionInput - The input type for the generateQuestion function.
 * - GenerateQuestionOutput - The return type for the generateQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuestionInputSchema = z.object({
  topic: z.string().describe('The topic for the question (e.g., React, JavaScript, CSS).'),
});
export type GenerateQuestionInput = z.infer<typeof GenerateQuestionInputSchema>;

const GenerateQuestionOutputSchema = z.object({
  question: z.string().describe('The generated question.'),
  topic: z.string().describe('The topic of the question.'),
});
export type GenerateQuestionOutput = z.infer<typeof GenerateQuestionOutputSchema>;

export async function generateQuestion(input: GenerateQuestionInput): Promise<GenerateQuestionOutput> {
  return generateQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionPrompt',
  input: { schema: GenerateQuestionInputSchema },
  output: { schema: GenerateQuestionOutputSchema },
  prompt: `You are an AI that generates technical interview questions for software developers.

  Generate a single, clear, and concise question about the following topic: {{{topic}}}.
  The question should be suitable for a mid-level developer.
  Do not provide the answer.
  Return the question and the topic.
  `,
});

const generateQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuestionFlow',
    inputSchema: GenerateQuestionInputSchema,
    outputSchema: GenerateQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

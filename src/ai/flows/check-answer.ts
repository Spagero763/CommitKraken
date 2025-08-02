'use server';

/**
 * @fileOverview A flow for checking if an answer to a question is correct.
 *
 * - checkAnswer - A function that checks an answer.
 * - CheckAnswerInput - The input type for the checkAnswer function.
 * - CheckAnswerOutput - The return type for the checkAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckAnswerInputSchema = z.object({
  question: z.string().describe('The question that was asked.'),
  answer: z.string().describe('The user-provided answer.'),
});
export type CheckAnswerInput = z.infer<typeof CheckAnswerInputSchema>;

const CheckAnswerOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the answer is correct.'),
  feedback: z.string().describe('Feedback on the answer, explaining why it is correct or incorrect.'),
});
export type CheckAnswerOutput = z.infer<typeof CheckAnswerOutputSchema>;

export async function checkAnswer(input: CheckAnswerInput): Promise<CheckAnswerOutput> {
  return checkAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkAnswerPrompt',
  input: { schema: CheckAnswerInputSchema },
  output: { schema: CheckAnswerOutputSchema },
  prompt: `You are an AI that evaluates answers to technical interview questions.

  Question: {{{question}}}
  Answer: {{{answer}}}

  Evaluate the answer and determine if it is correct. Provide brief feedback explaining why the answer is correct or incorrect.
  Your feedback should be encouraging and helpful.
  `,
});

const checkAnswerFlow = ai.defineFlow(
  {
    name: 'checkAnswerFlow',
    inputSchema: CheckAnswerInputSchema,
    outputSchema: CheckAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

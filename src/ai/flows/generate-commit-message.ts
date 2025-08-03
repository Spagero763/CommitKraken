'use server';

/**
 * @fileOverview A flow for generating commit messages based on changes.
 *
 * - generateCommitMessage - A function that generates a commit message.
 * - GenerateCommitMessageInput - The input type for the generateCommitMessage function.
 * - GenerateCommitMessageOutput - The return type for the generateCommitMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommitMessageInputSchema = z.object({
  diff: z
    .string()
    .describe('The diff of the changes to be committed.'),
  personality: z.string().describe('The personality to use for the commit message (e.g., professional, witty).'),
  type: z.string().describe('The type of commit (e.g., feat, fix, docs).'),
});
export type GenerateCommitMessageInput = z.infer<typeof GenerateCommitMessageInputSchema>;

const GenerateCommitMessageOutputSchema = z.object({
  message: z.string().describe('The generated commit message.'),
});
export type GenerateCommitMessageOutput = z.infer<typeof GenerateCommitMessageOutputSchema>;

export async function generateCommitMessage(input: GenerateCommitMessageInput): Promise<GenerateCommitMessageOutput> {
  return generateCommitMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommitMessagePrompt',
  input: {schema: GenerateCommitMessageInputSchema},
  output: {schema: GenerateCommitMessageOutputSchema},
  prompt: `You are an AI that generates commit messages. You will adopt the following personality: {{{personality}}}.

  The user has provided a diff of their changes and specified the commit type as '{{{type}}}'.

  Generate a concise and informative commit message that starts with the type (e.g., "feat:", "fix:", "docs:"). The message should summarize the changes in the diff.

  Diff:
  \`\`\`diff
  {{{diff}}}
  \`\`\`

  The entire commit message should be no more than 72 characters long.
  `,
});

const generateCommitMessageFlow = ai.defineFlow(
  {
    name: 'generateCommitMessageFlow',
    inputSchema: GenerateCommitMessageInputSchema,
    outputSchema: GenerateCommitMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

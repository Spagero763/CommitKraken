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
  prompt: `You are an AI that generates commit messages based on the provided diff.\n
   Generate a concise and informative commit message that summarizes the changes described in the following diff:

  \`\`\`diff
  {{{diff}}}
  \`\`\`

  The commit message should be no more than 72 characters long.
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

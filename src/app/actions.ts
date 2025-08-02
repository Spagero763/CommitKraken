'use server';

import {
  generateCommitMessage,
  type GenerateCommitMessageInput,
} from '@/ai/flows/generate-commit-message';

export async function getAiCommitMessage(input: GenerateCommitMessageInput): Promise<{
  success: boolean;
  message: string | null;
}> {
  try {
    const result = await generateCommitMessage(input);
    if (result.message) {
      return { success: true, message: result.message };
    }
    return { success: false, message: 'AI failed to generate a message.' };
  } catch (error) {
    console.error('Error generating commit message:', error);
    return {
      success: false,
      message: 'An unexpected error occurred.',
    };
  }
}

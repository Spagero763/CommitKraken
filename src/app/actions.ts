'use server';

import {
  generateCommitMessage,
  type GenerateCommitMessageInput,
} from '@/ai/flows/generate-commit-message';
import {
  generateQuestion,
  type GenerateQuestionInput,
} from '@/ai/flows/generate-question';

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

export async function getNewQuestion(input: GenerateQuestionInput): Promise<{
  success: boolean;
  question: string | null;
  topic: string | null;
  error: string | null;
}> {
  try {
    const result = await generateQuestion(input);
    if (result.question) {
      return { success: true, question: result.question, topic: result.topic, error: null };
    }
    return { success: false, question: null, topic: null, error: 'AI failed to generate a question.' };
  } catch (error) {
    console.error('Error generating question:', error);
    return {
      success: false,
      question: null,
      topic: null,
      error: 'An unexpected error occurred while fetching a new question.',
    };
  }
}

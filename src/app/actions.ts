'use server';

import {
  generateCommitMessage,
  type GenerateCommitMessageInput,
} from '@/ai/flows/generate-commit-message';
import {
  generateQuestion,
  type GenerateQuestionInput,
} from '@/ai/flows/generate-question';
import {
  checkAnswer,
  type CheckAnswerInput
} from '@/ai/flows/check-answer';
import {
  generateProfileHeader,
  type GenerateProfileHeaderInput,
  type GenerateProfileHeaderOutput,
} from '@/ai/flows/generate-profile-header';
import { generateVideo as generateVideoFlow } from '@/ai/flows/generate-video';

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

export async function checkChallengeAnswer(input: CheckAnswerInput): Promise<{
  success: boolean;
  isCorrect: boolean;
  feedback: string;
  error?: string | null;
}> {
  try {
    const result = await checkAnswer(input);
    return { success: true, isCorrect: result.isCorrect, feedback: result.feedback };
  } catch (error) {
    console.error('Error checking answer:', error);
    return {
      success: false,
      isCorrect: false,
      feedback: 'An unexpected error occurred while checking the answer.',
    };
  }
}

export async function getProfileHeader(
  input: GenerateProfileHeaderInput
): Promise<{
  success: boolean;
  data: GenerateProfileHeaderOutput | null;
  error?: string | null;
}> {
  try {
    const result = await generateProfileHeader(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating profile header:', error);
    return {
      success: false,
      data: null,
      error: 'An unexpected error occurred while generating the profile header.',
    };
  }
}

// This is required to extend the default 5 minute timeout for serverless functions.
// Video generation can take a while.
export const maxDuration = 120; // 2 minutes

export async function generateVideo(
  prompt: string
): Promise<{
  success: boolean;
  videoUrl: string | null;
  error?: string | null;
}> {
  try {
    const result = await generateVideoFlow(prompt);
    return { success: true, videoUrl: result };
  } catch (error) {
    console.error('Error generating video:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      success: false,
      videoUrl: null,
      error: errorMessage,
    };
  }
}

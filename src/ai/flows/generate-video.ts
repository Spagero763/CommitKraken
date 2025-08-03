'use server';
/**
 * @fileOverview A flow for generating video from a text prompt.
 *
 * - generateVideo - A function that handles the video generation process.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateVideo(prompt: string): Promise<string> {
  let { operation } = await ai.generate({
    model: googleAI.model('veo-2.0-generate-001'),
    prompt,
    config: {
      durationSeconds: 5,
      aspectRatio: '16:9',
    },
  });

  if (!operation) {
    throw new Error('Expected the model to return an operation');
  }

  while (!operation.done) {
    await sleep(5000); // Poll every 5 seconds
    operation = await ai.checkOperation(operation);
  }

  if (operation.error) {
    throw new Error(`Failed to generate video: ${operation.error.message}`);
  }

  const video = operation.output?.message?.content.find((p) => !!p.media);
  if (!video || !video.media) {
    throw new Error('Failed to find the generated video in the operation result.');
  }

  // The media URL from Veo is temporary and requires an API key to access.
  // To make it usable on the client, we fetch it and convert it to a data URI.
  const videoUrlWithKey = `${video.media.url}&key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(videoUrlWithKey);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }
  
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = response.headers.get('content-type') || 'video/mp4';

  return `data:${contentType};base64,${base64}`;
}

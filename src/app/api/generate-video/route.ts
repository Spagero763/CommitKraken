import { generateVideo as generateVideoFlow } from '@/ai/flows/generate-video';
import { NextResponse } from 'next/server';

// This is required to extend the default 5 minute timeout for serverless functions.
// Video generation can take a while.
export const maxDuration = 120; // 2 minutes

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const videoUrl = await generateVideoFlow(prompt);

    return NextResponse.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
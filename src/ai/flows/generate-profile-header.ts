'use server';

/**
 * @fileOverview A flow for generating a unique profile header.
 *
 * - generateProfileHeader - A function that generates a header image and motto.
 * - GenerateProfileHeaderInput - The input type for the generateProfileHeader function.
 * - GenerateProfileHeaderOutput - The return type for the generateProfileHeader function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProfileHeaderInputSchema = z.object({
  name: z.string().describe('The name of the user to generate the header for.'),
});
export type GenerateProfileHeaderInput = z.infer<
  typeof GenerateProfileHeaderInputSchema
>;

const GenerateProfileHeaderOutputSchema = z.object({
  motto: z.string().describe('A short, inspiring developer motto.'),
  imageUrl: z
    .string()
    .describe(
      "A generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProfileHeaderOutput = z.infer<
  typeof GenerateProfileHeaderOutputSchema
>;

export async function generateProfileHeader(
  input: GenerateProfileHeaderInput
): Promise<GenerateProfileHeaderOutput> {
  return generateProfileHeaderFlow(input);
}

const mottoPrompt = ai.definePrompt({
  name: 'generateMottoPrompt',
  input: { schema: z.object({ name: z.string() }) },
  output: { schema: z.object({ motto: z.string() }) },
  prompt: `Generate a short, inspiring, and slightly quirky developer motto for a user named {{{name}}}. It should be a single sentence.`,
});

const generateProfileHeaderFlow = ai.defineFlow(
  {
    name: 'generateProfileHeaderFlow',
    inputSchema: GenerateProfileHeaderInputSchema,
    outputSchema: GenerateProfileHeaderOutputSchema,
  },
  async ({ name }) => {
    const [mottoResult, imageResult] = await Promise.all([
      mottoPrompt({ name }),
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate an abstract, artistic, visually pleasing header image for a developer named ${name}. The image should be sleek, modern, and suitable for a dark-themed tech dashboard. Use a palette of deep navy, neon magenta, and bright cyan. Focus on abstract geometric shapes, flowing lines, and a sense of digital energy. Do not include any text.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    ]);

    if (!imageResult.media) {
      throw new Error('Image generation failed.');
    }

    return {
      motto: mottoResult.output?.motto || 'Code with passion.',
      imageUrl: imageResult.media.url,
    };
  }
);

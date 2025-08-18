'use server';
/**
 * @fileOverview Implements an AI flow to enhance Groq chat responses with relevant external information.
 *
 * - improveGroqChatResponse - A function that takes user input and enhances the Groq chat response.
 * - ImproveGroqChatResponseInput - The input type for the improveGroqChatResponse function.
 * - ImproveGroqChatResponseOutput - The return type for the improveGroqChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveGroqChatResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to the chat bot.'),
  groqResponse: z.string().describe('The initial response from the Groq chat model.'),
});
export type ImproveGroqChatResponseInput = z.infer<typeof ImproveGroqChatResponseInputSchema>;

const ImproveGroqChatResponseOutputSchema = z.object({
  enhancedResponse: z
    .string()
    .describe('The Groq chat response enhanced with external information.'),
  suggestedUrl: z
    .string()
    .nullable()
    .describe('An optional URL providing relevant external information.'),
});
export type ImproveGroqChatResponseOutput = z.infer<
  typeof ImproveGroqChatResponseOutputSchema
>;

export async function improveGroqChatResponse(
  input: ImproveGroqChatResponseInput
): Promise<ImproveGroqChatResponseOutput> {
  return improveGroqChatResponseFlow(input);
}

const findRelevantInformation = ai.defineTool(
  {
    name: 'findRelevantInformation',
    description:
      'This tool will use a search engine to find relevant information related to the user question. It will then return a URL to the user to view.',
    inputSchema: z.object({
      query: z
        .string()
        .describe('The search query to use to find relevant information.'),
    }),
    outputSchema: z.string().describe('The URL of the relevant information.'),
  },
  async input => {
    // This is a placeholder implementation.  In a real application, this would
    // call a search engine and return a URL.
    console.log(`Searching for ${input.query}`);
    return `https://example.com/search-results-for-${input.query.replace(
      / /g,
      '-'
    )}`;
  }
);

const prompt = ai.definePrompt({
  name: 'improveGroqChatResponsePrompt',
  input: {
    schema: ImproveGroqChatResponseInputSchema,
  },
  output: {
    schema: ImproveGroqChatResponseOutputSchema,
  },
  tools: [findRelevantInformation],
  prompt: `You are a helpful AI assistant. Your task is to refine a response from another AI. The final response MUST be in the same language as the user's original input.

User's Input: "{{userInput}}"
Initial AI Response: "{{groqResponse}}"

**Instructions:**

1.  **Language Match (Top Priority):** Your entire rewritten response ("enhancedResponse") must be exclusively in the language of the "{{userInput}}". No exceptions.
2.  **Conversational Tone:** Make the response natural and friendly.
3.  **Integrate Information:** Smoothly incorporate the key information from the "{{groqResponse}}". Do not simply repeat it.
4.  **Use Tools Wisely:** If a web link would be genuinely helpful, use the 'findRelevantInformation' tool to get a URL and place it in the 'suggestedUrl' field.

Rewrite the response to be more helpful and human, strictly maintaining the original language of the user's request.`,
});

const improveGroqChatResponseFlow = ai.defineFlow(
  {
    name: 'improveGroqChatResponseFlow',
    inputSchema: ImproveGroqChatResponseInputSchema,
    outputSchema: ImproveGroqChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
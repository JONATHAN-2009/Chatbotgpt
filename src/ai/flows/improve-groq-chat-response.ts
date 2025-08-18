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
  prompt: `You are an AI assistant. Your primary goal is to refine and enhance a response from another AI, ensuring it is conversational and strictly in the same language as the user's input.

The user's query is:
"{{userInput}}"

The initial AI response is:
"{{groqResponse}}"

**Your Task:**
Rewrite the initial AI response based on these strict guidelines:

1.  **Language Adherence (CRITICAL):**
    -   Identify the language of the user's input ("{{userInput}}").
    -   Your entire rewritten response (**"enhancedResponse"**) MUST be exclusively in that identified language.
    -   DO NOT, under any circumstances, switch to English or any other language.

2.  **Conversational Tone:**
    -   Make the response sound natural, friendly, and human-like. Avoid robotic or overly formal phrasing.

3.  **Natural Integration:**
    -   Smoothly weave the essential information from the original response ("{{groqResponse}}") into a more engaging and fluid answer.

4.  **Helpful Tool Use:**
    -   If providing a link would be beneficial, use the 'findRelevantInformation' tool to get a relevant URL. Include this URL in the 'suggestedUrl' field.

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

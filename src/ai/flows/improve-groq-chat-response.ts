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
  enhancedResponse: z.string().describe('The Groq chat response enhanced with external information.'),
  suggestedUrl: z.string().optional().describe('An optional URL providing relevant external information.'),
});
export type ImproveGroqChatResponseOutput = z.infer<typeof ImproveGroqChatResponseOutputSchema>;

export async function improveGroqChatResponse(input: ImproveGroqChatResponseInput): Promise<ImproveGroqChatResponseOutput> {
  return improveGroqChatResponseFlow(input);
}

const findRelevantInformation = ai.defineTool({
  name: 'findRelevantInformation',
  description: 'This tool will use a search engine to find relevant information related to the user question. It will then return a URL to the user to view.',
  inputSchema: z.object({
    query: z.string().describe('The search query to use to find relevant information.'),
  }),
  outputSchema: z.string().describe('The URL of the relevant information.'),
}, async (input) => {
  // This is a placeholder implementation.  In a real application, this would
  // call a search engine and return a URL.
  console.log(`Searching for ${input.query}`);
  return `https://example.com/search-results-for-${input.query.replace(/ /g, '-')}`;
});

const prompt = ai.definePrompt({
  name: 'improveGroqChatResponsePrompt',
  input: {
    schema: ImproveGroqChatResponseInputSchema,
  },
  output: {
    schema: ImproveGroqChatResponseOutputSchema,
  },
  tools: [findRelevantInformation],
  prompt: `You are an AI assistant that enhances responses from a chat model by adding relevant external information.

  The user has provided the following input:
  {{userInput}}

  The initial response from the chat model is:
  {{groqResponse}}

  Your task is to improve the response by:
  1.  Adding additional information that is relevant to the user's input.
  2.  Suggesting a URL where the user can find more information, if appropriate.  You must decide whether to use the findRelevantInformation tool, passing in the user's input as the query.

  If you find a relevant URL, set the suggestedUrl field to the URL.  Otherwise, leave it blank.

  Make sure to include the original groqResponse in the enhancedResponse.

  Here is the output you should follow:
  { 
    enhancedResponse: string,
    suggestedUrl?: string,
  }`,
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

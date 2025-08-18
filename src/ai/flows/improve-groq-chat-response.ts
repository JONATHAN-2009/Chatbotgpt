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
    .optional()
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
  prompt: `You are an AI assistant that enhances responses from a chat model by adding relevant external information. Your primary goal is to make the response more helpful and informative.

The user has provided the following input:
{{userInput}}

The initial response from the chat model is:
{{groqResponse}}

Your task is to improve this response by following these steps:
1.  Analyze the user's input and the initial response to understand the context.
2.  Critically evaluate the initial response. Is it complete? Is it accurate? Can it be improved with more details or a relevant link?
3.  If the user's query could benefit from external information (like a tutorial, an article, or documentation), use the 'findRelevantInformation' tool to search for a relevant URL. Pass the user's original input as the query for the tool.
4.  Rewrite the initial response to be more comprehensive and helpful. Integrate the original response naturally.
5.  If you found a relevant URL with the tool, include it in the 'suggestedUrl' field in your output. Otherwise, leave this field blank.

Ensure the 'enhancedResponse' includes the core information from the original 'groqResponse' but is presented in a more complete and useful way.

Here is the output format you must follow:
{
  "enhancedResponse": "string",
  "suggestedUrl": "string | null"
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

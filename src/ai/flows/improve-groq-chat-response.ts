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
  prompt: `You are an AI assistant. Your goal is to refine and enhance the response from another AI to make it sound more natural, human, and conversational.

The user said:
"{{userInput}}"

The other AI responded with:
"{{groqResponse}}"

Your task is to rewrite the AI's response. Here are your guidelines:
- **Be conversational:** Use a friendly, approachable tone. Avoid overly formal or robotic language.
- **Maintain Language:** Critically detect the language of the user's input and respond *only* in that language.
- **Integrate Information Naturally:** Weave the core information from the original response into a more fluid and engaging answer.
- **Use Tools When Helpful:** If the user's query could be better answered with a link to an article, tutorial, or other resource, use the 'findRelevantInformation' tool to find a relevant URL. If you use the tool, include the URL in the 'suggestedUrl' field.
- **Don't be a list:** Do not just list facts. Explain concepts in a simple, easy-to-understand way.

Rewrite the response to be more helpful and human-like, while keeping the essential information.

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

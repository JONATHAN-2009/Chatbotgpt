import { improveGroqChatResponse } from '@/ai/flows/improve-groq-chat-response';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse(JSON.stringify({ error: 'Missing GEMINI_API_KEY in environment variables' }), { status: 500 });
    }
    const { userInput, groqResponse } = await req.json();
    if (!userInput || !groqResponse) {
        return new NextResponse(JSON.stringify({ error: 'Missing userInput or groqResponse' }), { status: 400 });
    }
    const result = await improveGroqChatResponse({ userInput, groqResponse });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[ENHANCE_API_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to enhance response';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

    
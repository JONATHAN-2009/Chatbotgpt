import { improveGroqChatResponse } from '@/ai/flows/improve-groq-chat-response';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userInput, groqResponse } = await req.json();
    if (!userInput || !groqResponse) {
        return new NextResponse(JSON.stringify({ error: 'Missing userInput or groqResponse' }), { status: 400 });
    }
    const result = await improveGroqChatResponse({ userInput, groqResponse });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[ENHANCE_API_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to enhance response' }), { status: 500 });
  }
}

import { summarizeChatHistory } from '@/ai/flows/summarize-chat-history';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { chatHistory } = await req.json();
    if (!chatHistory) {
        return new NextResponse(JSON.stringify({ error: 'Missing chatHistory' }), { status: 400 });
    }
    const result = await summarizeChatHistory({ chatHistory });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[SUMMARIZE_API_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to summarize chat' }), { status: 500 });
  }
}

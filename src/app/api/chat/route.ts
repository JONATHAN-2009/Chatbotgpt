import Groq from 'groq-sdk';
import { Stream } from 'groq-sdk/streaming';

export const runtime = 'edge';

function toDataStream(stream: Stream<Groq.Chat.CompletionChunk>) {
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const data = `data: ${JSON.stringify(chunk)}\n\n`;
                controller.enqueue(encoder.encode(data));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
        },
    });
    return readableStream;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return new Response('Missing messages in request body', { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
        return new Response('Missing GROQ_API_KEY in environment variables', { status: 500 });
    }
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const stream = await groq.chat.completions.create({
      model: 'compound-beta',
      messages,
      stream: true,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
    });

    const dataStream = toDataStream(stream);

    return new Response(dataStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        }
    });

  } catch (error) {
    console.error('[CHAT_API_ERROR]', error);
    let errorMessage = 'An unknown error occurred';
    if(error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(`Error: ${errorMessage}`, { status: 500 });
  }
}

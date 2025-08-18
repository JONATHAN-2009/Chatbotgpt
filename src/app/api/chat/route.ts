import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return new Response('Missing messages in request body', { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
        return new Response('Missing GROQ_API_KEY in environment variables', { status: 500 });
    }

    const stream = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
    });

    return new Response(stream.toReadableStream());

  } catch (error) {
    console.error('[CHAT_API_ERROR]', error);
    let errorMessage = 'An unknown error occurred';
    if(error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(`Error: ${errorMessage}`, { status: 500 });
  }
}

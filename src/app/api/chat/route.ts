import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are an expert Nigerian Stock Exchange (NGX) analyst. 
You must answer financial questions and explain complex concepts in very simple, relatable Nigerian ways so anyone can understand. 
Use everyday analogies that a typical Nigerian can relate to (e.g., market traders, Danfo buses, owning a shop in Balogun market, etc.). 
Keep your tone friendly, professional, yet culturally grounded.`;

    const result = await streamText({
      model: google('gemini-3.5-flash') as any,
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

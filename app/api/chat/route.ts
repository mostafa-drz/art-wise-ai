import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini } from '../googleAI';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, context } = body;

    const { text, newHistory } = await chatWithGemini(message, history, context);

    const response = new NextResponse(JSON.stringify({ text, newHistory }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new NextResponse(JSON.stringify({ error: 'An unknown error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

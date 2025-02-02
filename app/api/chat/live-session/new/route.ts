import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const OPENAI_API_KEY = process.env.OPEN_AI_API_KEY;
  const OPENAI_REALTIME_SESSION_URL = process.env.OPEN_AI_REALTIME_SESSION_URL;
  const OPENAI_MODEL_ID = process.env.OPEN_AI_MODEL_ID;
  const body = await req.json();
  if (!OPENAI_API_KEY || !OPENAI_REALTIME_SESSION_URL || !OPENAI_MODEL_ID) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  const response = await fetch(OPENAI_REALTIME_SESSION_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL_ID,
      ...body,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        error: 'Failed to create session',
        errorFromOpenAI: await response.json(),
      },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

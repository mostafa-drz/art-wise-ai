import { NextRequest, NextResponse } from 'next/server';
import { getInformationFromGemini } from '../googleAI';

// a get handler, which recives the input and returns the output
export async function POST(req: NextRequest) {
  const body = await req.json();
  const aiResponse = await getInformationFromGemini(
    { language: body.language },
    {inlineData:{ data: body.image, mimeType: body.type }},
  );
  const response = new NextResponse(aiResponse, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
}

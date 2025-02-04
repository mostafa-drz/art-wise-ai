import { NextRequest, NextResponse } from 'next/server';
import { getInformationFromGemini } from '../googleAI';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageURL = formData.get('imageURL') as string;
    const language = formData.get('language') as string;

    if (!imageURL) {
      return new NextResponse(JSON.stringify({ error: 'Invalid image url' }), { status: 400 });
    }

    const aiResponse = await getInformationFromGemini(
      { language },
      { fileData: { fileUri: imageURL, mimeType: 'image/jpeg' } }, // Assuming JPEG, adjust as needed
    );

    if (!aiResponse) {
      return new NextResponse(JSON.stringify({ error: 'No response from AI' }), { status: 500 });
    }

    // add imageURL back to the response
    const parsedAIResponse = JSON.parse(aiResponse);

    return new NextResponse(JSON.stringify({ ...parsedAIResponse, imageURL }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/identify:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

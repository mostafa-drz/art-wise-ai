import { NextRequest, NextResponse } from 'next/server';
import { generatePodcast } from '../googleAI';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { context, language = 'en-US', gender = 'NEUTRAL' } = body;

    // Validate input
    if (!context) {
      return new NextResponse(
        JSON.stringify({ error: 'Artwork context is required to generate a podcast.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Generate the podcast
    const { audio } = await generatePodcast(context, language, gender);

    // Convert the audio buffer to base64
    const audioBase64 = Buffer.from(audio).toString('base64');

    // Send back the base64 audio data
    return NextResponse.json({ audioUrl: audioBase64 }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating podcast:', error.message);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error generating podcast:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate podcast. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

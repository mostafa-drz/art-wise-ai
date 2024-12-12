import { NextRequest, NextResponse } from 'next/server';
import { generatePodcast } from '../googleAI';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { context, language = 'en-US', gender = VoiceGender.NEUTRAL } = body;

    // Validate input
    if (!context) {
      return new NextResponse(
        JSON.stringify({ error: 'Artwork context is required to generate a podcast.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate the podcast
    const { script, audioBase64 } = await generatePodcast(context, language, gender);

    // Return the generated script and audio to the client
    const response = new NextResponse(
      JSON.stringify({ script, audioBase64 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return response;
  } catch (error: any) {
    console.error('Error generating podcast:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate podcast. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
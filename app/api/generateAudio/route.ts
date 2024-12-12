import { NextRequest, NextResponse } from 'next/server';
import { generatePodcast } from '../googleAI';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { context, language = 'en-US', gender = 'NEUTRAL' } = body;

    // Validate input
    if (!context) {
      return new NextResponse(
        JSON.stringify({ error: 'Artwork context is required to generate a podcast.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate the podcast
    const { audio } = await generatePodcast(context, language, gender);

    const fileName = 'temp-audio.mp3';
    const filePath = path.join(process.cwd(), 'public', 'temp', fileName);
   
       // Ensure the temp directory exists
       const tempDir = path.dirname(filePath);
       if (!fs.existsSync(tempDir)) {
         fs.mkdirSync(tempDir, { recursive: true });
       }
   
       fs.writeFileSync(filePath, audio);
   
       // Step 4: Create the public URL
       const fileUrl = `/temp/${fileName}`;
   
       // Send back the public URL
       return NextResponse.json({ audioUrl: fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Error generating podcast:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate podcast. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import textToSpeech, {protos as ttsProtos}from '@google-cloud/text-to-speech';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const genAI = new GoogleGenerativeAI(API_KEY);
const ttsClient = new textToSpeech.TextToSpeechClient();

export async function getInformationFromGemini(input: Input | undefined, imagePart: ImagePart) {
  if (!input) {
    throw Error('No input provided');
  }
  if (!imagePart) {
    throw Error('No image provided');
  }
  const model = genAI.getGenerativeModel({
    model: MODEL ,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = createPrompt(input);
  const result = await model.generateContent([imagePart, prompt]);
  const response = result.response;
  return response.text();
}

const createPrompt = (input: Input): string => {
  const prompt = `
You are an art-savvy assistant with a professional, friendly, and engaging tone.

### Task:
Analyze the provided inline image data and return a structured JSON response in the following format, adhering to the Output interface. Tailor your responses for accuracy, simplicity, and storytelling.

### Output Interface:
\`\`\`
interface Output {
  art_title: string; // The title of the artwork
  artist_name: string; // The name of the artist
  date: string; // The date the artwork was created
  more_about_artist: string; // A brief about the artist (complimentary data)
  brief_history: string; // Why the artwork is famous, its significance, and context
  technical_details: string; // Art-specific details: techniques, visual elements, and what to observe
  other_facts: string; // Any fun, social, or historical facts
  originalImageURL: string; // A URL representing the artwork image
  recommended: RecommendedArt[]; // Recommended similar artworks
  imageBase64?: string; // Optional base64 representation of the input image
}
\`\`\`

### RecommendedArt Format:
Each recommended artwork must include:
- \`art_title\`: Title of the artwork.
- \`artist_name\`: Artist's name.
- \`date\`: Year of creation.
- \`image_url\`: Image URL (JPG/PNG preferred; return "undefined" if unavailable).

### Input:
You receive an inline image with its MIME type and user preferences:
\`\`\`
{
  "image": "base64-encoded-string",
  "type": "image/png",
  "language": "en-US"
}
\`\`\`

### Response Guidelines:
- Translate the response into the user's preferred \`language\` (default: en-US).
- Use storytelling to make the details engaging and educational.
- Include all fields in the Output interface, ensuring JSON validity.

### Example Output:
\`\`\`
{
  "art_title": "Starry Night",
  "artist_name": "Vincent van Gogh",
  "date": "1889",
  "more_about_artist": "Vincent van Gogh was a Dutch post-impressionist painter known for his vivid colors and emotional depth. He struggled with mental illness and poverty throughout his life.",
  "brief_history": "Starry Night is one of Vincent van Gogh's most famous paintings. It was created during his stay at the asylum in Saint-Rémy-de-Provence and represents his imaginative view of the night sky.",
  "technical_details": "The painting features swirling patterns in the sky, bold brushstrokes, and vibrant blues and yellows that create movement and emotion.",
  "other_facts": "Despite its fame, Van Gogh considered this painting a failure. It is now housed in the Museum of Modern Art in New York.",
  "originalImageURL": "https://example.com/starry-night.jpg",
  "recommended": [
    {
      "art_title": "Irises",
      "artist_name": "Vincent van Gogh",
      "date": "1889",
      "image_url": "https://example.com/irises.jpg"
    },
    {
      "art_title": "Wheatfield with Crows",
      "artist_name": "Vincent van Gogh",
      "date": "1890",
      "image_url": "https://example.com/wheatfield-crows.jpg"
    },
    {
      "art_title": "The Bedroom",
      "artist_name": "Vincent van Gogh",
      "date": "1888",
      "image_url": "https://example.com/the-bedroom.jpg"
    }
  ],
  "imageBase64": "base64-encoded-string"
}
\`\`\`

### Notes:
1. Use trusted sources for accuracy.
2. Preserve the JSON structure strictly for compatibility with \`JSON.parse()\`.
3. If a field cannot be populated, return an empty string or "undefined" where appropriate.
4. Focus on storytelling to make the data engaging.

### Input:
${JSON.stringify(input)}
`;
  return prompt;
};

const SYSTEM_CHAT_PROMPT: Content = {
  role: 'system',
  parts: [
    {
      text: `
You are an AI art advisor. Answer questions about artworks using reliable, accurate information. 
Respond in a professional, friendly, and passionate tone. Use markdown to format your responses beautifully, including:

- **Headers** for key sections.
- **Bullet points** for lists.
- **Bold** text for emphasis.

Never invent information; always rely on trustworthy sources.
`,
    },
  ],
};

export const chatWithGemini = async (
  message: string,
  history: Content[],
  context: Output, // Artwork details
): Promise<{ text: string; newHistory: Content[] }> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  // Limit history to avoid performance overhead
  const MAX_HISTORY_LENGTH = 10;
  const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH);

  // Add artwork context on first message only
  const historyToUse =
    trimmedHistory.length > 0
      ? trimmedHistory
      : [
          {
            role: 'user',
            parts: [
              {
                text: `
Here is the artwork information for reference:

\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Feel free to ask any questions about it.
              `,
              },
            ],
          },
        ];

  try {
    // Start conversation
    const chat = model.startChat({
      history: historyToUse,
      systemInstruction: SYSTEM_CHAT_PROMPT,
    });

    // Send the user's message
    const result = await chat.sendMessage(message);
    const text = result.response.text();
    const newHistory = await chat.getHistory();

    return { text, newHistory };
  } catch (error) {
    console.error('Error in chatWithGemini:', error);
    return {
      text: 'Apologies, something went wrong. Please try again later.',
      newHistory: history,
    };
  }
};

/**
 * Generates a 3-minute podcast script with Gemini covering all aspects of the artwork.
 */
export async function generatePodcastScript(context: Output): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `
You are an AI art podcast creator. Generate a concise, engaging 3-minute podcast script based on the following artwork details:

\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

### Content Guidelines:
1. Start with the artwork title and artist name.
2. Share a brief history of the artwork and its significance.
3. Explain the technical details of the artwork (visual elements, techniques).
4. Share one or two fun or historical facts to engage the audience.
5. End with a smooth conclusion or recommendations for other notable works.

Keep the tone professional, friendly, and engaging. Ensure the script is within 3 minutes when read aloud (around 400-450 words).
`;

  const result = await model.generateContent([prompt]);
  return result.response.text();
}


/**
 * Converts the podcast script into an audio stream (base64) and returns it to the client.
 */
export async function generateAudioStream(
  text: string,
  languageCode: string = 'en-US',
  gender: VoiceGender = VoiceGender.NEUTRAL,
): Promise<string> {
  const request = {
    input: { text },
    voice: { languageCode, ssmlGender: gender },
    // google.cloud.texttospeech.v1.IAudioConfig
    audioConfig: { audioEncoding: ttsProtos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  // check if the response is an audio content
  if (!response.audioContent) {
    throw new Error('No audio content found in the response');
  }
  return `data:audio/mp3;base64,${response.audioContent.toString()}`;
}

/**
 * Generates a podcast script and converts it to audio.
 */
export async function generatePodcast(context: Output, language: string = 'en-US', gender: VoiceGender = VoiceGender.NEUTRAL) {
  try {
    const script = await generatePodcastScript(context);
    const audioBase64 = await generateAudioStream(script, language, gender);
    return { script, audioBase64 };
  } catch (error) {
    console.error('Error generating podcast:', error);
    throw new Error('Failed to generate podcast. Please try again.');
  }
}

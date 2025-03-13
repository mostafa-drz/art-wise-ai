import { getVercelOidcToken } from '@vercel/functions/oidc';
import textToSpeech, { protos as ttsProtos } from '@google-cloud/text-to-speech';
import { VertexAI, GenerateContentRequest, Content } from '@google-cloud/vertexai';
import { VoiceGender, Input, Output } from '../types';
import { BaseExternalAccountClient, ExternalAccountClient } from 'google-auth-library';

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// Initialize clients
const vertexClient = createVertexClient();
const ttsClient = createTextToSpeechClient();

function getGoogleAuthClient() {
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Google Auth Client is not available in development mode');
  }
  const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
  const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
  const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
  const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
  const authClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      // Use the Vercel OIDC token as the subject token
      getSubjectToken: getVercelOidcToken,
    },
  }) as BaseExternalAccountClient;
  if (!authClient) {
    throw new Error('Failed to create Google Auth Client');
  }
  console.log('authClient', authClient);
  return authClient;
}

function createVertexClient() {
  const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID as string;
  const GCP_VERTEX_MODEL_LOCATION = process.env.GCP_VERTEX_MODEL_LOCATION as string;

  if (process.env.NODE_ENV === 'development') {
    return new VertexAI({ project: GCP_PROJECT_ID, location: GCP_VERTEX_MODEL_LOCATION });
  }

  const authClient = getGoogleAuthClient();

  return new VertexAI({
    project: GCP_PROJECT_ID,
    location: GCP_VERTEX_MODEL_LOCATION,
    googleAuthOptions: {
      authClient,
    },
  });
}

function createTextToSpeechClient() {
  if (process.env.NODE_ENV === 'development') {
    return new textToSpeech.TextToSpeechClient();
  }
  const authClient = getGoogleAuthClient();
  return new textToSpeech.TextToSpeechClient({ authClient });
}

export async function getInformationFromGemini(
  input: Input,
  imagePart: { fileData: { fileUri: string; mimeType: string } },
) {
  if (!input || !imagePart) {
    throw new Error('Input or image data is missing');
  }

  const model = vertexClient.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = createPrompt(input);

  const request: GenerateContentRequest = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            fileData: {
              fileUri: imagePart.fileData.fileUri,
              mimeType: imagePart.fileData.mimeType,
            },
          },
        ],
      },
    ],
  };

  try {
    const result = await model.generateContent(request);
    const response = result.response;
    return response.candidates?.[0].content?.parts[0].text;
  } catch (error) {
    console.error('Error communicating with Vertex AI:', error);
    throw new Error('Failed to retrieve data from Vertex AI');
  }
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
}
\`\`\`

### RecommendedArt Format:
Each recommended artwork must include:
- \`art_title\`: Title of the artwork.
- \`artist_name\`: Artist's name.
- \`date\`: Year of creation.

### Input:
You receive an inline image with its MIME type and user preferences:
\`\`\`
{
  "imageURL": "the image URL of uploaded art",
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
  let model;
  try {
    model = vertexClient.getGenerativeModel({ model: MODEL });
  } catch (error) {
    console.error('Error getting generative model:', error);
    throw new Error('Failed to get generative model');
  }

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
    const text = result.response?.candidates?.[0]?.content?.parts[0]?.text;
    const newHistory = await chat.getHistory();
    if (!text) {
      throw new Error('No response provided by the model');
    }
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
 * Generates a storytelling script in SSML format using Gemini.
 */
/**
 * Generates a storytelling script in SSML format using Gemini.
 *
 * @param {Output} context - The artwork details to be included in the SSML script.
 * @returns {Promise<string>} - The generated SSML script.
 */
export async function generateAudioSSML(context: Output): Promise<string> {
  const model = vertexClient.getGenerativeModel({ model: MODEL });

  // Updated prompt to generate SSML
  const prompt = `
You are an AI storyteller and SSML expert. Your task is to generate a natural, engaging, and conversational storytelling script about the given artwork in valid SSML format.
The output should be approximately 3 minutes of audio and covering all aspects of art context provided.

### Artwork Details:
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

### SSML Content Guidelines:
1. Wrap the entire script in <speak> tags.
2. Use <break> tags to introduce natural pauses between sentences or sections.
   - Short breaks for small pauses: <break time="500ms"/>.
   - Longer breaks between sections: <break time="1s"/>.
3. Use <emphasis> tags to highlight key phrases or names.
4. Adjust speaking rate and pitch naturally using <prosody> where necessary.
5. Keep the tone conversational, friendly, and engaging.
6. Ensure the script flows like someone is telling a story, avoiding bullet points or list-like structures.

### Example SSML:
<speak>
  This is the artwork titled <emphasis level="strong">Starry Night</emphasis>, painted by <emphasis>Vincent van Gogh</emphasis>. 
  <break time="500ms"/>
  Created in 1889, it reflects the artist's view from his asylum room window. 
  <prosody rate="slow" pitch="high">
    Notice the swirling patterns in the sky, representing Van Gogh's imaginative mind.
  </prosody>
  <break time="1s"/>
  One interesting fact is that Van Gogh painted this during the day from memory.
</speak>
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
### Instructions:
Generate the entire script in valid SSML. Do not include any additional markdown or JSON format.
`;

  try {
    const result = await model.generateContent(prompt);
    const ssml = result.response?.candidates?.[0]?.content?.parts[0]?.text;

    if (!ssml) {
      throw new Error('No SSML script generated.');
    }

    if (!ssml) {
      throw new Error('No SSML script generated.');
    }
    return ssml.trim();
  } catch (error) {
    console.error('Error generating SSML script:', error);
    throw new Error('Failed to generate storytelling SSML. Please try again.');
  }
}

/**
 * Converts the podcast script into an audio stream (base64) and returns it to the client.
 *
 * @param {string} ssml - The SSML script to be converted to audio.
 * @param {string} [languageCode='en-US'] - The language code for the audio.
 * @param {VoiceGender} [gender=VoiceGender.NEUTRAL] - The gender of the voice.
 * @returns {Promise<string | Uint8Array<ArrayBufferLike>>} - The generated audio content.
 */
export async function generateAudioStream(
  ssml: string,
  languageCode: string = 'en-US',
  gender: VoiceGender = VoiceGender.NEUTRAL,
): Promise<string | Uint8Array> {
  const request = {
    input: { ssml },
    voice: { languageCode, ssmlGender: gender },
    audioConfig: { audioEncoding: ttsProtos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);
    if (!response.audioContent) {
      throw new Error('No audio content found in the response');
    }
    return response.audioContent;
  } catch (error) {
    console.error('Error generating audio stream:', error);
    throw new Error('Failed to generate audio stream. Please try again.');
  }
}

/**
 * Generates a podcast script and converts it to audio.
 */
export async function generatePodcast(
  context: Output,
  language: string = 'en-US',
  gender: VoiceGender = VoiceGender.NEUTRAL,
) {
  try {
    const script = await generateAudioSSML(context);
    const audio = await generateAudioStream(script, language, gender);
    return { script, audio };
  } catch (error) {
    console.error('Error generating podcast:', error);
    throw new Error('Failed to generate podcast. Please try again.');
  }
}

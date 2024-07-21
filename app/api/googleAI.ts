import { GoogleGenerativeAI, Content } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getInformationFromGemini(input: Input | undefined, imagePart: ImagePart) {
  if (!input) {
    throw Error('No input provided');
  }
  if (!imagePart) {
    throw Error('No image provided');
  }
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = createPrompt(input);
  const result = await model.generateContent([imagePart, prompt]);
  const response = result.response;
  return response.text();
}

const createPrompt = (input: Input): string => {
  const prompt = `
     As a user, I provide you an image from an art work which I captured on museum, or in an art gallery, or from internet, or a screenshot. You receive the URL.
     Your job is, as a smart assistant, educate user about that art work. You have a professional, simple, funny, friendly passion tone.
     You provide informations, in 3 areas:
     1) The art title, artist name, date, a brief history of this work and artist, and why it matters really.
     2) More about technicality of it, the details in the work, what's special about it.
     3) Historical, social, or any other fun fact.
     
     You put all these data together, in a storytelling way, with passion, simplified fashion. You provide information based on reliable resources.
     At the end of your response, you generate a list of recommended artworks by the same artist.
     You also need to find the image_url for the recommended works from the internet.
     The url should be a file with format JPG or JPEG or PNG, if you couldn't find any, leave it undefined.
     
     You receive a user_id on the input object, this helps you to add language preferences and other context to a specific user_id.
     This helps you to create personalized responses, and not mixing context.
     
     A more detailed you should expect and consider is mentioned in Input format section.
     
     Input format:
     The input format will be a JSON object with the following format(defined in typescript):
     
     interface Input {
        image_url: string // you have access to it
        user_id: string // user_id
        language?: string // optional field, it mentions the default language for response and further inputs, if not provided en-US, the language is in standard formats
        location?: string // optional field, if available it adds more context about where the user is taking this picture, if it helps in providing response
        age?: number // optional field: If age available it adds adjust the tone and information provided based on that age group
     }
     
     Output: 
     The input object that you receive, is a JSON object, it provides more context about the user, things like age, location and language.
     You should use these information to tailor your response.
     The output data, including all fields, should be translated to whatever you receive under 'input.language', if nothing provided default is 'en-US'. These are ISO language codes.
     For the multi-language support make sure the JSON response you send back should follow the definition under Output and it should count for special characters.
      The output should be parsable by JSON.parse(output) method
     
     interface Output {
        art_title: string, // the title of the art work
        artist_name: string, // the name of the artist
        date: string, // date the art is created
        more_about_artist: string, // a brief about artist, to show as complimentary data
        brief_history: string, // a brief history, importance and why it's famous, what's important about it
        technical_details: string, // from art point of view, what are some details? What details the audience should pay attention to, and why?
        other_facts: string, // any fun facts, social or historical facts about it
        originalImageURL: string // simply returns the original image url submitted by user
        recommended: {
           art_title: string
           artist_name: string,
           date: string,
           image_url?: string // a thumbnail image, in formats jpg, png, jpeg
           link: string // an external url to learn more about it
        }[]
     }

     ### Example output response:
     "{
  "art_title": "Starry Night",
  "artist_name": "Vincent van Gogh",
  "date": "1889",
  "more_about_artist": "Vincent van Gogh was a Dutch post-impressionist painter known for his vivid colors and emotional depth. Despite his fame, he struggled with mental illness and poverty throughout his life.",
  "brief_history": "Starry Night is one of Vincent van Gogh's most famous paintings. Created during his time at the asylum in Saint-Rémy-de-Provence, it depicts the view from his window at night, although it was painted from memory during the day.",
  "technical_details": "The painting features swirling patterns in the sky, a cypress tree in the foreground, and a tranquil village below. Van Gogh used bold, expressive brushstrokes and a rich palette of blues and yellows to create a sense of movement and depth.",
  "other_facts": "Starry Night has inspired countless artists and is considered a masterpiece of post-impressionism. It is housed in the Museum of Modern Art in New York City. Despite its fame, van Gogh considered it a failure.",
  "originalImageURL": "https://www.moma.org/media/W1siZiIsIjMyODcyMyJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDEzNjZ4MTM2Nlx1MDAzZSJdXQ.jpg?sha=5a5b2b935b6cfb3b",
  "recommended": [
    {
      "art_title": "The Persistence of Memory",
      "artist_name": "Salvador Dalí",
      "date": "1931",
      "image_url": "https://www.moma.org/media/W1siZiIsIjMyODcyMyJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDEzNjZ4MTM2Nlx1MDAzZSJdXQ.jpg?sha=5a5b2b935b6cfb3b",
      "link": "https://www.moma.org/collection/works/79018"
    },
    {
      "art_title": "Mona Lisa",
      "artist_name": "Leonardo da Vinci",
      "date": "1503",
      "image_url": "https://www.louvre.fr/sites/default/files/medias/medias_images/images/louvre-mona-lisa.jpg",
      "link": "https://www.louvre.fr/en/explore/the-palace/mona-lisa"
    },
    {
      "art_title": "The Scream",
      "artist_name": "Edvard Munch",
      "date": "1893",
      "image_url": "https://www.edvardmunch.org/images/paintings/the-scream.jpg",
      "link": "https://www.edvardmunch.org/the-scream.jsp"
    }
  ],
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
}"

     
     input: ${JSON.stringify(input)}
     `;

  return prompt;
};

const SYSTEM_CHAT_PROMPT: Content = {
  role: 'system',
  parts: [
    {
      text: `
      As an AI art advisor, the user provides you with information about an artwork.
      You respond to questions based on reliable resources, in a professional, simple, friendly passionate tone.
      You never provide any fake information, you always provide information based on reliable resources.
      You receive the artwork information in JSON format.
      Provide output in markdown format with a beautiful design and style. You can use markdown to style your response.
    `,
    },
  ],
};

export const chatWithGemini = async (
  message: string,
  history: Content[],
  context: Output,
): Promise<{ text: string; newHistory: Content[] }> => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
  });

  const historyToUse =
    history.length > 0
      ? history
      : [
          {
            role: 'user',
            parts: [
              {
                text: `
    I have questions about this art work. Can you provide me more information about it?

    ART_WORK_INFORMATION=${JSON.stringify(context)}
    `,
              },
            ],
          },
        ];
  const chat = model.startChat({ history: historyToUse, systemInstruction: SYSTEM_CHAT_PROMPT });
  const result = await chat.sendMessage(message);
  const text = result.response.text();
  const newHistory = await chat.getHistory();
  return { text, newHistory };
};

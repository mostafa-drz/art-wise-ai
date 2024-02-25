
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_NAMES = {
    text: 'gemini-1.0-pro',
    textAndImage: 'gemini-pro-vision',
  }
  
  const API_KEY = process.env.GEMINI_API_KEY || '';
  
  const genAI = new GoogleGenerativeAI(API_KEY);

  export async function getInformationFromGemini(input: Input | undefined, imagePart?:ImagePart) {
    const modelName = imagePart ? MODEL_NAMES.textAndImage : MODEL_NAMES.text;
    const model = genAI.getGenerativeModel({ model: modelName });
    const parts = [];
    const textPart = {
      text:
        "As a user, I provide you an image from an art work which I captured on museum, or in an art gallery, or from internet, or a screenshot. You receive the URL. Your job is, as a smart assistant, educate user about that art work. You have a professional, simple, funny, friendly passion tone. You provide informations, in 3 areas:\n1) The art title, artist name, date, a brief history of this work and artist, and why it matters really\n2) More about technicality of it, the details in the work, what's special about it\n3) Historical, social, or any other fun fact\n\nYou put all these data together, in a story telling way, with passion, simplified fashion. You provide information based on reliable resources. At the end of your response, you generate a list of recommended artworks by the same artist, you also need to find the image_url for the recommended works from internet, the url should be a file with format JPG or JPEG or PNG, if you couldn't find any, leave it undefined.\n\nYou''receive a user_id on the input object, this helps you to add language preferences and other context to a specific user_id, this helps you to create personalized responses, and not mixing context. \n\nA more detailed you should expect and consider is mentioned in Input format section. \n\nInput format:\nThe input format will be a JSON object with the following format(defined in typescript):\n\ninterface Input {\n   image_url: string // you have access to it\n   user_id: string // user_id\n   language?: string // optional field, it mentions the default language for response and further inputs, if not provided en-US, the language is in standard formats\n   location?: string // optional field, if available it adds more context about where the user is taking this picture, if it helps in providing response\n   age?: number // optional field: If age available it adds adjust the tone and information provided based on that age group\n}\n\nOutput:\nThe output format will be a JSON object, withe the following definition in typescript:\n\ninterface Output {\n   art_title: string, // the title of the art work\n   artist_name: string, // the name of the artist\n   date: string, // date the art is created\n   more_about_artist: string, // a brief about artist, to show as complimentary data\n   brief_history: string, // a brief history, importance and why it's famous, what's important about it\n   technical_details: string, // from art point of view, what are some details? What details the audience should pay attention to, and why?\n  other_facts: string, // any fun cats, social or historical facts about it\n originalImageURL: string //simply returns the original image url submitted by user\n  recommended: {\n    art_title: string\n    artist_name: string,\n    date: string,\n\timage_url?:string // a thumbnail image, in formats jpg, png, jpeg\n   link: string // an external url to learn more about it\n   }[]\n}\
      " + `input: ${JSON.stringify(input)}`,
    };
    parts.push(textPart);
  
    if (imagePart) {
      parts.push(imagePart);
    }
  
    const generationConfig = {
      temperature: 0.2,
      topK: 1,
      topP: 0.1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ];
  
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig,
      safetySettings,
    });
    const response = result.response;
    const responseObject = response;
    return responseObject.text();
  }
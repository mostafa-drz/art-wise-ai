
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

  
  const API_KEY = process.env.GEMINI_API_KEY || '';
  
  const genAI = new GoogleGenerativeAI(API_KEY);

  export async function getInformationFromGemini(input: Input | undefined, imagePart?:ImagePart) {
    if(!input){
      throw Error('No input provided');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const parts = [];
    const textPart = {
      text: createPrompt(input)
    }
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
     The output format must be a pure JSON object, with the following definition in typescript which you use to respond to the prompts in this format only.
     You need to make sure it is a VALID JSON object and it supports special characters from other languages like French in response.
     No extra chars should be added to the response. 
     
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

     ### Accepted Output:
     {
        "artist_name": "Vincent van Gogh",
        "art_title": "The Starry Night",
        "date": "1889",
        ....
     }

     ### Rejected Output:
     JSON{
        "artist_name": "Vincent van Gogh",
        "art_title": "The Starry Night",
        "date": "1889",
        ....
        "random_field": "random_value"
     }
     
     input: ${JSON.stringify(input)}
     `;
 
     return prompt;
  }
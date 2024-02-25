import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIDFromRequest } from '../../utils';
import { uploadImageToFirebaseStorage } from '../firebase';
const uuid = require('uuid');

const MODEL_NAMES = {
  text: 'gemini-1.0-pro',
  textAndImage: 'gemini-pro-vision',
}

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

async function getInformationFromGemini(input: Input | undefined, imagePart?:ImagePart) {
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

  console.log('parts', parts);

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

// a get handler, which recives the input and returns the output
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File;
  const image_url = formData.get('image_url') as string;

  if (!image && !image_url) {
    return new NextResponse('No image provided', { status: 400 });
  }
  if (image && image_url) {
    return new NextResponse('Please provide either an image or an image URL, not both', {
      status: 400,
    });
  }
  if (image_url) {
    const output = await getInformationFromGemini({ ...input, image_url });
    return new NextResponse(output, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // check for file size to make sure not larger than 5MB
  if (image.size > MAX_FILE_SIZE_BYTES) {
    return new NextResponse('Image size must be less than 5MB', { status: 400 });
  }

  //upload image to firebase storage and then get the download URL and then call the getInformationFromGemini function
  //const fileExtension = image.name.split('.').pop();
  const imageBytes = await image.arrayBuffer();
  const imageBuffer = Buffer.from(imageBytes);
  const imageBase64String = imageBuffer.toString('base64');
 // const fileName = `${getUserIDFromRequest(req)}-${new Date().toISOString()}-.${fileExtension}`;
  //const downloadURL = await uploadImageToFirebaseStorage(imageBuffer, fileName);
  const inlineData = {
    data: imageBase64String,
    mimeType: image.type,
  };

  const outputResponse = await getInformationFromGemini(undefined, {inlineData});
  const outputObject = JSON.parse(outputResponse);
  // get user id from cookies, if not avaiable, set one under the key user_id, value is a uuid, use uuidv4 for generating.
  const userIdFromCookies = getUserIDFromRequest(req);
  const responseObject = {...outputObject,imageBase64:imageBase64String}
  const response = new NextResponse(JSON.stringify(responseObject), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  if (!userIdFromCookies) {
    const user_id = uuid.v4();
    response.cookies.set('user_id', user_id);
  }
  // set the user_id cookie
  return response;
}

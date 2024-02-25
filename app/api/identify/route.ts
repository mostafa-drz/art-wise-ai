import { NextRequest, NextResponse } from 'next/server';
import { getUserIDFromRequest } from '../../utils';
const uuid = require('uuid');
import { getInformationFromGemini } from '../googleAI';


const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;



// a get handler, which recives the input and returns the output
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const formDataObject:RequestFormData = Object.fromEntries(formData.entries());
  const {image,image_url,...otherFields} = formDataObject;

  if (!image && !image_url) {
    return new NextResponse('No image provided', { status: 400 });
  }
  if (image && image?.size>0 && image_url) {
    return new NextResponse('Please provide either an image or an image URL, not both', {
      status: 400,
    });
  }
  if (image_url) {
    const output = await getInformationFromGemini({...otherFields , image_url });
    return new NextResponse(output, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if(!image){
    return new NextResponse('No image provided', { status: 400 });
  }

  // check for file size to make sure not larger than 5MB
  if (image?.size > MAX_FILE_SIZE_BYTES) {
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

  const outputResponse = await getInformationFromGemini({...otherFields}, {inlineData});
  console.log({outputResponse})
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

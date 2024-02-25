import { initializeApp, getApp } from 'firebase-admin/app';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

const app = getApp();

if (!app) {
  initializeApp();
}

const storage = getStorage();
const BUCKET_NAME = 'gen-lang-client-0924787673.appspot.com';
const storageBucket = storage.bucket(BUCKET_NAME);

export async function uploadImageToFirebaseStorage(
  imageBuffer: Buffer,
  fileName: string,
): Promise<string> {
  const file = storageBucket.file(fileName);
  await file.save(imageBuffer);
  const downloadURL = await getDownloadURL(file);
  return downloadURL;
}

import { updateUser } from './db';
import { User } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getServices } from './firebase';

export async function uploadImageToFirebase(userId: string, sessionId: string, image: File) {
  const services = getServices();
  const storage = services?.storage;
  if (!storage) {
    throw new Error('Firebase storage not initialized');
  }
  const timestamp = Date.now();
  const fileName = `${image.name}-${timestamp}.jpg`;
  const filePath = `users/${userId}/sessions/${sessionId}/${fileName}`;

  const storageRef = ref(storage, filePath);

  // Upload image
  await uploadBytes(storageRef, image);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

export enum GenAiType {
  newSearch = 'newSearch',
  generateAudioVersion = 'generateAudioVersion',
  textConversation = 'textConversation',
  liveAudioConversation = 'liveAudioConversation',
}

export const FREE_INCLUDED_CREDITS_FOR_USER = 1000;
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const GEN_AI_COST = {
  [GenAiType.newSearch]: 1,
  [GenAiType.generateAudioVersion]: 2,
  // Per text message
  [GenAiType.textConversation]: 1,
  // Per Audio message
  [GenAiType.liveAudioConversation]: 1,
};

export function handleChargeUser(user: User, transactionType: GenAiType) {
  const cost = GEN_AI_COST[transactionType];
  user.availableCredits = (user.availableCredits as number) - cost;
  user.usedCredits = (user.usedCredits as number) + cost;
  updateUser(user.uid, { availableCredits: user.availableCredits, usedCredits: user.usedCredits });
}

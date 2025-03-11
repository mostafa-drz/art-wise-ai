import { updateUser } from './db';
import { User } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getServices } from './firebase';
import { Timestamp } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

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

// Constants for credit system
export const FREE_INCLUDED_CREDITS = 1000;
export const MAX_CREDITS_PER_DAY = 500;
export const MIN_CREDITS_ALERT = 100;
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Cost per operation
export const GEN_AI_COST = {
  [GenAiType.newSearch]: 1,
  [GenAiType.generateAudioVersion]: 2,
  [GenAiType.textConversation]: 1,
  [GenAiType.liveAudioConversation]: 1,
};

// Track daily usage per user
const dailyUsage = new Map<string, { count: number; date: string }>();

function checkDailyLimit(userId: string, cost: number): boolean {
  const today = new Date().toISOString().split('T')[0];
  const usage = dailyUsage.get(userId);

  if (!usage || usage.date !== today) {
    dailyUsage.set(userId, { count: cost, date: today });
    return true;
  }

  if (usage.count + cost > MAX_CREDITS_PER_DAY) {
    return false;
  }

  usage.count += cost;
  dailyUsage.set(userId, usage);
  return true;
}

export async function handleChargeUser(user: User, transactionType: GenAiType): Promise<boolean> {
  try {
    const cost = GEN_AI_COST[transactionType];
    const availableCredits = user.availableCredits as number;

    // Check if user has enough credits
    if (availableCredits < cost) {
      throw new Error('Insufficient credits');
    }

    // Check daily usage limit
    if (!checkDailyLimit(user.uid, cost)) {
      throw new Error('Daily usage limit reached');
    }

    // Update credits
    const newAvailableCredits = availableCredits - cost;
    const newUsedCredits = (user.usedCredits as number) + cost;

    // Update user document
    await updateUser(user.uid, {
      availableCredits: newAvailableCredits,
      usedCredits: newUsedCredits,
      lastTransactionAt: serverTimestamp() as Timestamp,
    });

    // Alert if credits are running low
    if (newAvailableCredits <= MIN_CREDITS_ALERT) {
      console.warn(`User ${user.uid} is running low on credits: ${newAvailableCredits} remaining`);
    }

    return true;
  } catch (error) {
    console.error('Error charging user:', error);
    return false;
  }
}

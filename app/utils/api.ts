import { GenAiType, handleChargeUser } from './index';
import { Output, User } from '../types';
import { Content } from '@google-cloud/vertexai';

// Identify Artwork
export async function identifyArtwork({
  user,
  imageURL,
  language,
}: {
  user: User;
  imageURL: string;
  language: string;
}) {
  try {
    const formData = new FormData();
    formData.append('imageURL', imageURL);
    formData.append('language', language);

    const res = await fetch('/api/identify', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    handleChargeUser(user, GenAiType.newSearch);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Something went wrong' };
  }
}

// Send Chat Message
export async function sendMessage({
  user,
  message,
  history,
  context,
}: {
  user: User;
  message: string;
  history: Content[];
  context: Output | null;
}) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    handleChargeUser(user, GenAiType.textConversation);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Something went wrong' };
  }
}

// Generate Audio
export async function generateAudio({
  user,
  context,
  language,
}: {
  user: User;
  context: any;
  language: string;
}) {
  try {
    const res = await fetch('/api/generateAudio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, language }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    handleChargeUser(user, GenAiType.generateAudioVersion);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Something went wrong' };
  }
}

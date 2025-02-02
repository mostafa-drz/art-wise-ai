import { SessionConfig } from './types';

export async function createNewVoiceChatSession(updatedConfig: SessionConfig) {
  try {
    const response = await fetch('/api/chat/live-session/new', {
      method: 'POST',
      body: JSON.stringify(updatedConfig),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Failed to create new voice chat session:', error);
    throw error;
  }
}

'use client';

import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import TextChat from './components/TextChat';
import { Content } from '@google-cloud/vertexai';
import { GenerateAudioButton } from './components/Audio';
import { ChatMode, Output, User } from './types';
import FloatingActionButton from './components/FloatingActionButton';
import VoiceChatPanel from './components/VoiceChatPanel';
import {
  TurnDetectionType,
  SessionConfig as VoiceSessionConfig,
  Modality as VoiceSessionModality,
} from './context/OpenAIRealtimeWebRTC/types';
import { createNewVoiceChatSession } from './context/OpenAIRealtimeWebRTC/utils';
import { useSession as useLiveVoiceSession } from './context/OpenAIRealtimeWebRTC';
import ProtectedRoute from './components/ProtectedRoute';
import { handleChargeUser, GenAiType, MAX_IMAGE_FILE_SIZE, uploadImageToFirebase } from './utils';
import { useAuth } from './context/Auth';
import { redirect } from 'next/navigation';
import { useGlobalState } from './context/GlobalState';

export default function Home() {
  const [data, setData] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Content[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode | null>(null);
  const liveVoiceSession = useLiveVoiceSession();
  const auth = useAuth();
  const user = auth.user as User;
  const [error, setError] = useState<string | null>(null);
  const { sessionId } = useGlobalState();
  const [chatInputText, setChatInputText] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const image = formData.get('image') as File;
      const language = formData.get('language') as string;

      if (!image) throw new Error('No image provided');

      // Validate file type
      if (!image.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image.');
      }

      // Validate file size (max 5MB)
      if (image.size > MAX_IMAGE_FILE_SIZE) {
        throw new Error('Image size exceeds the 5MB limit.');
      }

      // Directly send the image to the backend without conversion
      const uploadFormData = new FormData();
      const imageURL = await uploadImageToFirebase(user.uid, sessionId, image);
      uploadFormData.append('imageURL', imageURL);
      uploadFormData.append('language', language);

      const res = await fetch('/api/identify', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) throw new Error(await res.text());

      const responseData = await res.json();
      handleChargeUser(user, GenAiType.newSearch);
      setData(responseData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    setChatLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: chatInputText, history: messages, context: data }),
    });

    if (!res.ok) {
      setChatLoading(false);
      throw new Error(await res.text());
    }

    const { newHistory } = await res.json();
    handleChargeUser(user, GenAiType.textConversation);
    setMessages(newHistory);
    setChatLoading(false);
    setChatInputText('');
  }

  async function handleOpenVoiceChat() {
    if (!data) return;

    setChatMode(ChatMode.VOICE);

    if (!liveVoiceSession.session?.isConnected) {
      const voiceSessionConfig: VoiceSessionConfig = {
        modalities: [VoiceSessionModality.AUDIO, VoiceSessionModality.TEXT],
        input_audio_transcription: {
          model: 'whisper-1',
        },
        instructions: `
        You are an art historian. Provide detailed insights about the artwork with following JSON data ${JSON.stringify(data)}.
      `,
        turn_detection: {
          type: TurnDetectionType.SERVER_VAD,
          threshold: 0.8,
          silence_duration_ms: 1000,
        },
      };
      const newVoiceSession = await createNewVoiceChatSession(voiceSessionConfig);
      liveVoiceSession.startSession(newVoiceSession);
    }
  }

  if (user && user.availableCredits && user.availableCredits < 0) {
    return redirect('/not-enough-credits');
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center">
        <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">Art Wise AI</span> – Your Personal Art
            Companion
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Upload an image to unlock the story behind any artwork. Discover the artist, uncover its
            history, explore technical details, and enjoy fascinating facts – all presented
            beautifully and informatively just for you.
          </p>
        </div>
        <InputForm onSubmit={handleSubmit} isLoading={loading} error={error} />
        <br />
        {loading ? (
          <div className="animate-pulse text-3xl text-gray-600">🤖 Working on it...</div>
        ) : (
          data && (
            <div className="flex flex-col gap-2">
              <GenerateAudioButton context={data} user={user} />
              <Results {...data} />
            </div>
          )
        )}
        {data && chatMode === ChatMode.TEXT && (
          <TextChat
            messages={messages.slice(1)}
            isLoading={chatLoading}
            onSendMessage={handleSendMessage}
            inputText={chatInputText}
            onInputTextChange={setChatInputText}
          />
        )}
        {data && chatMode === ChatMode.VOICE && (
          <VoiceChatPanel
            onClose={() => {
              liveVoiceSession.closeSession();
              setChatMode(null);
            }}
            session={liveVoiceSession.session}
            user={user}
          />
        )}
        {data && (
          <FloatingActionButton
            onStartVoiceChat={handleOpenVoiceChat}
            onStartTextChat={() => {
              setChatMode(ChatMode.TEXT);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

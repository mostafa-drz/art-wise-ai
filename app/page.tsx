'use client';

import { useState, useRef, useEffect } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import TextChatContainer from './components/TextChat';
import { Content } from '@google-cloud/vertexai';
import imageCompression, { Options } from 'browser-image-compression';
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
import { handleChargeUser, GenAiType } from './utils';
import { useAuth } from './context/Auth';
import { redirect } from 'next/navigation';

const imageCompressingOptions: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
};

export default function Home() {
  const [data, setData] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [messages, setMessages] = useState<Content[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const worker = useRef<Worker>();
  const formData = useRef(new FormData());
  const [chatMode, setChatMode] = useState<ChatMode | null>(null);
  const liveVoiceSession = useLiveVoiceSession();
  const auth = useAuth();
  const user = auth.user;

  useEffect(() => {
    worker.current = new Worker('/generateBinaryForImageWorker.js');

    worker.current.onmessage = async (e) => {
      if (typeof e.data !== 'string') throw new Error('Invalid data type');
      const base64String = e.data;
      const language = formData.current.get('language') as string;
      const fileType = (formData.current.get('image') as File).type;
      setImageBase64(base64String);
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64String, language, type: fileType }),
      });
      if (!res.ok) throw new Error(await res.text());
      const responseData = await res.json();
      handleChargeUser(auth.user as User, GenAiType.newSearch);
      setData(responseData); // Set the response data to state
      setLoading(false); // Stop loading
    };
  }, []);
  // Handle messages from the worker

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!worker.current) return;

    e.preventDefault();
    setLoading(true); // Start loading

    try {
      formData.current = new FormData(e.target as HTMLFormElement);
      const image = formData.current.get('image') as File;

      if (!image) throw new Error('No image provided');

      const fileType = image.type; // Get MIME type of the image
      if (!fileType.startsWith('image/'))
        throw new Error('Invalid file type. Please upload an image.');

      // There is no technical benefit to do this on the client side, I just wanted to experiment with it
      // compress image on webworker first before sending to server
      const compressedImage = await imageCompression(image, imageCompressingOptions);

      // Send the file to the worker for processing
      worker.current.postMessage(compressedImage);
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      setLoading(false);
    }
  }

  async function handleSendMessage(content: string) {
    setChatLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: content, history: messages, context: data }),
    });

    if (!res.ok) {
      setChatLoading(false);
      throw new Error(await res.text());
    }

    const { newHistory } = await res.json();
    const user = auth.user as User;
    handleChargeUser(user, GenAiType.textConversation);
    setMessages(newHistory);
    setChatLoading(false);
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
        <InputForm onSubmit={handleSubmit} isLoading={loading} />
        <br />
        {loading ? (
          <div className="animate-pulse text-3xl text-gray-600">🤖 Working on it...</div>
        ) : (
          data && (
            <div className="flex flex-col gap-2">
              <GenerateAudioButton context={data} user={auth.user} />
              <Results {...data} imageBase64={imageBase64} />
            </div>
          )
        )}
        {data && chatMode === ChatMode.TEXT && (
          <TextChatContainer
            messages={messages.slice(1)}
            isLoading={chatLoading}
            onSendMessage={handleSendMessage}
          />
        )}
        {data && chatMode === ChatMode.VOICE && (
          <VoiceChatPanel
            onClose={() => {
              liveVoiceSession.closeSession();
              setChatMode(null);
            }}
            session={liveVoiceSession.session}
            user={auth.user}
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

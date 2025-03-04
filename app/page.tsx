'use client';

// React & Next.js Core
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

// Third-Party Libraries
import { Content } from '@google-cloud/vertexai';

// Context & Hooks
import { useAuth } from '@/context/Auth';
import { useGlobalState } from '@/context/GlobalState';
import { useSession as useLiveVoiceSession } from '@/context/OpenAIRealtimeWebRTC';

// Types
import { ChatMode, Output, User } from '@/types';
import {
  TurnDetectionType,
  SessionConfig as VoiceSessionConfig,
  Modality as VoiceSessionModality,
  ConnectionStatus,
  RealtimeEventType,
} from '@/context/OpenAIRealtimeWebRTC/types';

// Utils & API
import * as api from '@/utils/api';
import { handleChargeUser, GenAiType } from '@/utils';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingIndicator from '@/components/LoadingIndicator';
import HeaderSection from '@/components/ArtCompanionBot/HeaderSection';
import UploadSection from '@/components/ArtCompanionBot/UploadSection';
import ResultsSection from '@/components/ArtCompanionBot/ResultsSection';
import ChatSection from '@/components/ArtCompanionBot/ChatSection';

// Realtime Utilities
import { createNewVoiceChatSession } from '@/context/OpenAIRealtimeWebRTC/utils';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode | null>(null);
  const [data, setData] = useState<Output | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generateAudioError, setGenerateAudioError] = useState<string | null>(null);
  const [generateAudioLoading, setGenerateAudioLoading] = useState(false);
  const [isFloatingButtonExpanded, setIsFloatingButtonExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Content[]>([]);

  const auth = useAuth();
  const user = auth.user as User;
  const liveVoiceSession = useLiveVoiceSession();
  const audioSession = liveVoiceSession.session;
  const { language } = useGlobalState();

  async function handleSendMessage() {
    setChatLoading(true);
    setError(null);

    const res = await api.sendMessage({
      user,
      message: chatInputText,
      history: messages,
      context: data,
    });

    if (res.error) {
      setError(res.error);
      setChatLoading(false);
      return;
    }

    const { newHistory } = res.data;
    handleChargeUser(user, GenAiType.textConversation);
    setMessages(newHistory);
    setChatLoading(false);
    setChatInputText('');
  }

  async function handleOpenVoiceChat() {
    if (!data) return;

    setChatMode(ChatMode.VOICE);

    if (!audioSession || audioSession.connectionStatus !== ConnectionStatus.CONNECTED) {
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
      liveVoiceSession.connect(newVoiceSession);
    }
  }

  // Handle audio chunk for push-to-talk mode
  const handleAudioChunk = (base64Audio: string) => {
    liveVoiceSession.sendAudioChunk(base64Audio);
  };

  // Handle audio commit for push-to-talk mode
  const handleCommitAudio = async () => {
    try {
      liveVoiceSession.commitAudioBuffer();
      // Charge for push-to-talk message
      handleChargeUser(user, GenAiType.textConversation);
    } catch (error) {
      console.error('Error processing push-to-talk:', error);
      setError('Failed to process voice message');
    }
  };

  // Handle live stream session end
  const handleCloseVoiceChat = async () => {
    try {
      liveVoiceSession.disconnect();
      setChatMode(null);
    } catch (error) {
      console.error('Error closing voice chat:', error);
      setError('Failed to close voice chat');
    }
  };

  async function generateAudio() {
    setGenerateAudioLoading(true);
    setGenerateAudioError(null);

    try {
      const response = await api.generateAudio({ user, context: data, language });
      if (response.error) {
        setGenerateAudioError(response.error);
        setGenerateAudioLoading(false);
        return;
      }

      const responseData = response?.data;
      handleChargeUser(user, GenAiType.generateAudioVersion);
      setAudioUrl(responseData.audioUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setGenerateAudioLoading(false);
    }
  }

  useEffect(() => {
    function chargeRealtimeInteractions() {
      handleChargeUser(user, GenAiType.liveAudioConversation);
    }

    liveVoiceSession.on(RealtimeEventType.RESPONSE_DONE, chargeRealtimeInteractions);

    return () => {
      liveVoiceSession.off(RealtimeEventType.RESPONSE_DONE, chargeRealtimeInteractions);
    };
  }, [user, liveVoiceSession]);

  if (user && user.availableCredits && user.availableCredits < 0) {
    return redirect('/not-enough-credits');
  }

  if (loading) {
    return (
      <LoadingIndicator isLoading={loading}>
        <div className="flex flex-col items-center">
          <HeaderSection />
          <UploadSection
            user={user}
            onSuccess={setData}
            onError={setError}
            onLoading={setLoading}
            loading={loading}
          />
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </LoadingIndicator>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center">
        <HeaderSection />
        <UploadSection
          user={user}
          onSuccess={setData}
          onError={setError}
          onLoading={setLoading}
          loading={loading}
        />
        {error && <div className="text-red-500">{error}</div>}
        <LoadingIndicator isLoading={loading}>
          {data && (
            <>
              <ResultsSection
                data={data}
                user={user}
                audioUrl={audioUrl}
                isLoading={generateAudioLoading}
                error={generateAudioError}
                onGenerateAudio={generateAudio}
              />
              <ChatSection
                messages={messages}
                chatMode={chatMode}
                isLoading={chatLoading}
                chatInputText={chatInputText}
                isFloatingButtonExpanded={isFloatingButtonExpanded}
                audioSession={audioSession}
                onSendMessage={handleSendMessage}
                onInputTextChange={setChatInputText}
                onOpenVoiceChat={handleOpenVoiceChat}
                onStartTextChat={() => setChatMode(ChatMode.TEXT)}
                onCloseVoiceChat={handleCloseVoiceChat}
                onToggleFloatingButton={() => setIsFloatingButtonExpanded((prev) => !prev)}
                setChatMode={setChatMode}
                onCommitAudio={handleCommitAudio}
                onAudioChunk={handleAudioChunk}
              />
            </>
          )}
        </LoadingIndicator>
      </div>
    </ProtectedRoute>
  );
}

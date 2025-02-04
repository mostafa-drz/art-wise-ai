'use client';

// React & Next.js Core
import { useState } from 'react';
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

    if (!audioSession?.isConnected) {
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

      handleChargeUser(user as User, GenAiType.generateAudioVersion);
      setAudioUrl(responseData.audioUrl); // Set the audio URL returned by the server
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setGenerateAudioLoading(false);
    }
  }

  if (user && user.availableCredits && user.availableCredits < 0) {
    return redirect('/not-enough-credits');
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center">
        <HeaderSection />
        <UploadSection user={user} onSuccess={setData} onError={setError} />

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
                data={data}
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
                onCloseVoiceChat={() => {
                  liveVoiceSession.closeSession();
                  setChatMode(null);
                }}
                onToggleMute={() => {
                  audioSession?.isMuted
                    ? liveVoiceSession.unmuteSessionAudio()
                    : liveVoiceSession.muteSessionAudio();
                }}
                onToggleFloatingButton={() => setIsFloatingButtonExpanded((prev) => !prev)}
              />
            </>
          )}
        </LoadingIndicator>
      </div>
    </ProtectedRoute>
  );
}

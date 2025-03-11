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
import * as Sentry from '@sentry/nextjs';
import ErrorBoundary from '@/components/ErrorBoundary';

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

    let voiceSessionConfig: VoiceSessionConfig | null = null;

    try {
      setChatMode(ChatMode.VOICE);

      if (!audioSession || audioSession.connectionStatus !== ConnectionStatus.CONNECTED) {
        voiceSessionConfig = {
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
        await liveVoiceSession.connect(newVoiceSession);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start voice chat';
      Sentry.captureException(error, {
        tags: { component: 'VoiceChat' },
        extra: {
          userId: user.uid,
          sessionConfig: voiceSessionConfig || 'Not configured',
        },
      });
      setError(errorMessage);
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

  // Critical error handling for authentication
  useEffect(() => {
    if (!auth.user && !auth.loading) {
      Sentry.captureMessage('Unauthenticated access attempt', {
        level: 'warning',
      });
    }
  }, [auth.user, auth.loading]);

  if (user && user.availableCredits && user.availableCredits < 0) {
    return redirect('/not-enough-credits');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingIndicator isLoading={loading}>
            <div className="space-y-8">
              <HeaderSection />
              <UploadSection
                user={user}
                onSuccess={setData}
                onError={setError}
                onLoading={setLoading}
                loading={loading}
              />
              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </LoadingIndicator>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Welcome to Your Art Companion
                </h1>
                <p className="mt-3 text-xl text-gray-500">
                  Upload an artwork to start your interactive experience
                </p>
              </div>

              {/* Upload Section */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <UploadSection
                  user={user}
                  onSuccess={setData}
                  onError={setError}
                  onLoading={setLoading}
                  loading={loading}
                />
                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {/* Results and Chat Sections */}
              <LoadingIndicator isLoading={loading}>
                {data && (
                  <div className="space-y-8">
                    {/* Results Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <ResultsSection
                        data={data}
                        user={user}
                        audioUrl={audioUrl}
                        isLoading={generateAudioLoading}
                        error={generateAudioError}
                        onGenerateAudio={generateAudio}
                      />
                    </div>

                    {/* Chat Section */}
                    <div className="bg-white rounded-2xl shadow-sm">
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
                    </div>
                  </div>
                )}
              </LoadingIndicator>

              {/* Credits Status */}
              {user && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Available Credits:{' '}
                    <span className="font-medium text-blue-600">{user.availableCredits}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

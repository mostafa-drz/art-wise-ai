'use client';

import React from 'react';
import TextChat from '../TextChat';
import VoiceChatPanel from '../VoiceChatPanel';
import FloatingActionButton from '../FloatingActionButton';
import { ChatMode } from '../../types';
import { Content } from '@google-cloud/vertexai';
import { RealtimeSession, ConnectionStatus } from '@/context/OpenAIRealtimeWebRTC/types';

interface ChatSectionProps {
  messages: Content[];
  chatMode: ChatMode | null;
  isLoading: boolean;
  chatInputText: string;
  isFloatingButtonExpanded: boolean;
  audioSession: RealtimeSession | null;
  onSendMessage: () => void;
  onInputTextChange: (text: string) => void;
  onOpenVoiceChat: () => void;
  onStartTextChat: () => void;
  onCloseVoiceChat: () => void;
  onToggleFloatingButton: () => void;
  setChatMode: (mode: ChatMode | null) => void;
  onCommitAudio: () => void;
  onAudioChunk: (base64Audio: string) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  chatMode,
  isLoading,
  chatInputText,
  isFloatingButtonExpanded,
  audioSession,
  onSendMessage,
  onInputTextChange,
  onOpenVoiceChat,
  onStartTextChat,
  onCloseVoiceChat,
  onToggleFloatingButton,
  setChatMode,
  onCommitAudio,
  onAudioChunk,
}) => {
  return (
    <>
      {chatMode === ChatMode.TEXT && (
        <TextChat
          messages={messages.slice(1)}
          isLoading={isLoading}
          onSendMessage={onSendMessage}
          inputText={chatInputText}
          onInputTextChange={onInputTextChange}
          onClose={() => setChatMode(null)}
        />
      )}

      {chatMode === ChatMode.VOICE && audioSession && (
        <VoiceChatPanel
          onClose={onCloseVoiceChat}
          mediaStream={audioSession.mediaStream || null}
          connectionStatus={audioSession.connectionStatus || ConnectionStatus.DISCONNECTED}
          onAudioChunk={onAudioChunk}
          onCommitAudio={onCommitAudio}
        />
      )}

      {!chatMode && (
        <FloatingActionButton
          onStartVoiceChat={onOpenVoiceChat}
          onStartTextChat={onStartTextChat}
          isExpanded={isFloatingButtonExpanded}
          onToggleExpand={onToggleFloatingButton}
        />
      )}
    </>
  );
};

export default ChatSection;

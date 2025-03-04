'use client';

import React from 'react';
import TextChat from '../TextChat';
import VoiceChatPanel from '../VoiceChatPanel';
import FloatingActionButton from '../FloatingActionButton';
import { ChatMode, Output } from '../../types';
import { Content } from '@google-cloud/vertexai';
import { RealtimeSession, ConnectionStatus } from '@/context/OpenAIRealtimeWebRTC/types';
interface ChatSectionProps {
  data: Output;
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
        />
      )}

      {chatMode === ChatMode.VOICE && audioSession && (
        <VoiceChatPanel
          onClose={onCloseVoiceChat}
          mediaStream={audioSession.mediaStream || null}
          connectionStatus={audioSession.connectionStatus || ConnectionStatus.DISCONNECTED}
        />
      )}

      <FloatingActionButton
        onStartVoiceChat={onOpenVoiceChat}
        onStartTextChat={onStartTextChat}
        isExpanded={isFloatingButtonExpanded}
        onToggleExpand={onToggleFloatingButton}
      />
    </>
  );
};

export default ChatSection;

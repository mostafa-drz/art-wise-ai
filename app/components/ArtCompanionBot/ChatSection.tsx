'use client';

import React from 'react';
import TextChat from '../TextChat';
import VoiceChatPanel from '../VoiceChatPanel';
import FloatingActionButton from '../FloatingActionButton';
import { ChatMode, Output } from '../../types';
import { Content } from '@google-cloud/vertexai';

interface ChatSectionProps {
  data: Output;
  messages: Content[];
  chatMode: ChatMode | null;
  isLoading: boolean;
  chatInputText: string;
  isFloatingButtonExpanded: boolean;
  audioSession: any;
  onSendMessage: () => void;
  onInputTextChange: (text: string) => void;
  onOpenVoiceChat: () => void;
  onStartTextChat: () => void;
  onCloseVoiceChat: () => void;
  onToggleMute: () => void;
  onToggleFloatingButton: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  data,
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
  onToggleMute,
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
          isMuted={audioSession?.isMuted || false}
          onToggleMute={onToggleMute}
          mediaStream={audioSession.mediaStream || null}
          isConnected={audioSession.isConnected || false}
          isConnecting={audioSession.isConnecting || false}
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

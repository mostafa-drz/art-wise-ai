'use client';

import React from 'react';
import { Content } from '@google-cloud/vertexai';
import Message from './Message';
import ScrollToBottom from 'react-scroll-to-bottom';
import NewMessage from './NewMessage';

interface TextChatProps {
  messages: Content[];
  isLoading: boolean;
  onSendMessage: () => void;
  inputText: string;
  onInputTextChange: (text: string) => void;
}

const TextChat: React.FC<TextChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  inputText,
  onInputTextChange,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 min-w-[25vw]">
      <div className="flex flex-col h-full max-h-screen overflow-auto mt-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
        <ScrollToBottom className="flex-grow overflow-y-auto p-4 space-y-2">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center my-2">
              <svg
                className="animate-spin h-6 w-6 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4z"
                ></path>
              </svg>
            </div>
          )}
        </ScrollToBottom>

        <NewMessage
          onSend={onSendMessage}
          isLoading={isLoading}
          value={inputText}
          onChange={onInputTextChange}
        />
      </div>
    </div>
  );
};

export default TextChat;

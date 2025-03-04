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
  onClose: () => void;
}

const TextChat: React.FC<TextChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  inputText,
  onInputTextChange,
  onClose,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[35vw] min-w-[400px] max-w-2xl">
      <div className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="h-[60vh] max-h-[600px] min-h-[400px]">
          <ScrollToBottom className="h-full overflow-y-auto p-6 space-y-4">
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
        </div>

        <div className="border-t border-gray-200">
          <NewMessage
            onSend={onSendMessage}
            isLoading={isLoading}
            value={inputText}
            onChange={onInputTextChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TextChat;

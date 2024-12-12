import React, { useState } from 'react';
import { Content } from '@google/generative-ai';
import Message from './Message';
import NewMessage from './NewMessage';
import ScrollToBottom from 'react-scroll-to-bottom';

interface ChatContainerProps {
  messages: Content[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 right-4 z-50 min-w-[25vw]">
      {isOpen ? (
        <div className="flex flex-col h-full max-h-screen overflow-auto mt-10 max-w-3xl bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center p-4 bg-teal-600 text-white rounded-t-lg">
            <h2 className="text-lg">Chat</h2>
            <button onClick={toggleChat} className="text-white">
              X
            </button>
          </div>
          <ScrollToBottom className="flex-grow overflow-y-auto p-4">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center my-2">
                <svg
                  className="animate-spin h-5 w-5 text-teal-600"
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
          <NewMessage onSend={onSendMessage} isLoading={isLoading} />
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="p-3 bg-teal-600 text-white rounded-full shadow-md focus:outline-none"
        >
          Do you have more questions?
        </button>
      )}
    </div>
  );
};

export default ChatContainer;

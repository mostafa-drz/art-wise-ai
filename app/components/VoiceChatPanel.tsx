'use client';

import { ConnectionStatus } from '@/context/OpenAIRealtimeWebRTC/types';
import React, { useEffect, useRef, useState } from 'react';
import PushToTalk from './PushToTalk';

interface VoiceChatPanelProps {
  onClose: () => void;
  mediaStream: MediaStream | null;
  connectionStatus: ConnectionStatus;
  onAudioChunk: (base64Audio: string) => void;
  onCommitAudio: () => void;
}

type ChatMode = 'live' | 'push-to-talk';

const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({
  onClose,
  mediaStream,
  connectionStatus,
  onAudioChunk,
  onCommitAudio,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('live');

  useEffect(() => {
    if (audioRef.current && mediaStream) {
      // Clean up any existing srcObject
      if (audioRef.current.srcObject) {
        audioRef.current.srcObject = null;
      }

      // Set the new stream
      audioRef.current.srcObject = mediaStream;
      audioRef.current.muted = false;
      audioRef.current.volume = 1.0;

      // Try to play
      audioRef.current.play().catch(() => {
        // Silently handle autoplay policy errors
      });
    }
  }, [mediaStream]);

  const handleModeChange = (mode: ChatMode) => {
    setChatMode(mode);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-xl border border-gray-200 p-4 w-80 animate-fade-in transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-800">Voice Chat</h2>
          {connectionStatus === ConnectionStatus.CONNECTED && (
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          title="End Call"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            onClick={() => handleModeChange('live')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                chatMode === 'live'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-primary'
              }`}
          >
            Live Chat
          </button>
          <button
            onClick={() => handleModeChange('push-to-talk')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                chatMode === 'push-to-talk'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-primary'
              }`}
          >
            Push to Talk
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center px-2">
          {chatMode === 'live'
            ? 'Speak naturally in a quiet environment for continuous conversation'
            : 'Perfect for noisy places - hold to speak, release when done'}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Hidden audio element for live chat */}
        <audio ref={audioRef} autoPlay playsInline />

        <div className="w-full">
          {connectionStatus === ConnectionStatus.CONNECTING ? (
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="animate-pulse text-sm text-gray-500">Connecting</div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          ) : connectionStatus === ConnectionStatus.CONNECTED ? (
            <div className="flex flex-col items-center space-y-4">
              {chatMode === 'push-to-talk' ? (
                <PushToTalk onRecording={onAudioChunk} onRecordingStopped={onCommitAudio} />
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Live chat active</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                End Call
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center">Not Connected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChatPanel;

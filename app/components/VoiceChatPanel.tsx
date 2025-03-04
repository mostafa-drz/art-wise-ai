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
  const [chatMode, setChatMode] = useState<ChatMode>('push-to-talk');

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
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-[400px] animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-700">Voice Assistant</h2>
          {connectionStatus === ConnectionStatus.CONNECTED && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close voice chat"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        {/* Welcome Message when not connected */}
        {connectionStatus === ConnectionStatus.DISCONNECTED && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center px-4 py-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Interaction Ready</h3>
              <p className="text-sm text-gray-500 mb-4">
                Choose your preferred mode to start the conversation
              </p>
            </div>
          </div>
        )}

        {/* Mode Selection with improved styling */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full p-1 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleModeChange('live')}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    chatMode === 'live'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
              >
                Live Chat
              </button>
              <button
                onClick={() => handleModeChange('push-to-talk')}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    chatMode === 'push-to-talk'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
              >
                Push to Talk
              </button>
            </div>
          </div>

          {/* Mode description */}
          <div className="text-center px-4">
            <p className="text-sm text-gray-600 font-medium mb-1">
              {chatMode === 'live' ? 'Live Chat Mode' : 'Push to Talk Mode'}
            </p>
            <p className="text-xs text-gray-500">
              {chatMode === 'live'
                ? 'Perfect for quiet environments. Speak naturally for a continuous conversation.'
                : 'Ideal for noisy places. Hold the button while speaking, release when done.'}
            </p>
          </div>
        </div>

        {/* Connection States */}
        <div className="mt-6">
          <audio ref={audioRef} autoPlay playsInline className="hidden" />

          {connectionStatus === ConnectionStatus.CONNECTING ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">Connecting...</span>
              </div>
              <p className="text-xs text-gray-500">Setting up your voice connection</p>
            </div>
          ) : connectionStatus === ConnectionStatus.CONNECTED ? (
            <div className="flex flex-col items-center space-y-4">
              {chatMode === 'push-to-talk' ? (
                <PushToTalk onRecording={onAudioChunk} onRecordingStopped={onCommitAudio} />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-600">Listening...</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                End Conversation
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VoiceChatPanel;

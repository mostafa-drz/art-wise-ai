'use client';

import { ConnectionStatus } from '@/context/OpenAIRealtimeWebRTC/types';
import React, { useEffect, useRef } from 'react';

interface VoiceChatPanelProps {
  onClose: () => void;
  mediaStream: MediaStream | null;
  connectionStatus: ConnectionStatus;
}

const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({
  onClose,
  mediaStream,
  connectionStatus,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && mediaStream) {
      audioRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-md rounded-xl border border-gray-200 p-4 w-80 animate-fade-in transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 font-semibold text-primary">Voice Chat</h2>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
          title="End Call"
        >
          ✖
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {connectionStatus === ConnectionStatus.CONNECTING ? (
          <div className="text-sm text-gray-500 animate-pulse">Connecting...</div>
        ) : connectionStatus === ConnectionStatus.CONNECTED ? (
          <>
            <audio ref={audioRef} autoPlay />
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-transform transform hover:scale-105"
              >
                End Call
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">Not Connected</div>
        )}
      </div>
    </div>
  );
};

export default VoiceChatPanel;

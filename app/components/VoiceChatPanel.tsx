'use client';

import { useState } from 'react';
import { Mic, MicOff, X } from 'lucide-react';

interface VoiceChatPanelProps {
  onClose: () => void;
}

export default function VoiceChatPanel({ onClose }: VoiceChatPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('This is a placeholder for live transcription...');

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="fixed bottom-20 right-6 bg-white shadow-xl rounded-xl p-4 w-80 border border-gray-200 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">🎙️ Voice Chat</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">{isMuted ? '🔇 Muted' : '🎤 Listening...'}</p>

      <div className="h-24 p-2 border rounded-md bg-gray-50 overflow-y-auto text-sm text-gray-700 mb-4">
        {transcript}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleMuteToggle}
          className={`px-4 py-2 rounded-md shadow ${
            isMuted
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isMuted ? <MicOff className="inline" /> : <Mic className="inline" />}
          <span className="ml-2">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600"
        >
          End Chat
        </button>
      </div>
    </div>
  );
}

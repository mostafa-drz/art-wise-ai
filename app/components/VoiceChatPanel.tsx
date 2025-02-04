'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { RealtimeSession } from '../context/OpenAIRealtimeWebRTC/types';
import { User } from '../types';
import { handleChargeUser, GenAiType } from '../utils';

interface VoiceChatPanelProps {
  onClose: () => void;
  session?: RealtimeSession | null;
  user: User | null;
}

export default function VoiceChatPanel({ onClose, session, user }: VoiceChatPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    const remoteStream = session?.mediaStream;

    if (audioRef.current && remoteStream) {
      // Attach the stream to the audio element
      audioRef.current.srcObject = remoteStream;
    }
  }, [session?.mediaStream]);

  useEffect(() => {
    if ((session?.tokenUsage?.totalTokens ?? 0) > 0) {
      handleChargeUser(user as User, GenAiType.liveAudioConversation);
    }
  }, [session?.tokenUsage]);

  return (
    <div className="fixed bottom-20 right-6 bg-white shadow-xl rounded-xl p-4 w-80 border border-gray-200 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">🎙️ Live Voice Chat</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X />
        </button>
      </div>

      <p className="text-sm text-gray-600 text-center mb-4">
        {isMuted ? '🔇 Muted' : session?.isConnected ? '🎤 Streaming...' : 'Connecting...'}
      </p>

      <div className="flex justify-between items-center">
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

      {/* Hidden Audio Element */}
      <audio ref={audioRef} autoPlay controls={false} hidden={false} />
    </div>
  );
}

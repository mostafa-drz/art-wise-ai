'use client';

import { useState } from 'react';
import { Mic, MessageCircle, Plus, X } from 'lucide-react';

export default function FloatingActionButton({ onStartVoiceChat, onStartTextChat }: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-50">
      {isExpanded && (
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={() => {
              onStartVoiceChat();
              setIsExpanded(false);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <Mic />
          </button>
          <button
            onClick={() => {
              onStartTextChat();
              setIsExpanded(false);
            }}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <MessageCircle />
          </button>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-transform transform hover:rotate-90"
      >
        {isExpanded ? <X /> : <Plus />}
      </button>
    </div>
  );
}

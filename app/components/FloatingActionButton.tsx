'use client';

import { Mic, MessageCircle, Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onStartVoiceChat: () => void;
  onStartTextChat: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function FloatingActionButton({
  onStartVoiceChat,
  onStartTextChat,
  isExpanded,
  onToggleExpand,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-50">
      {isExpanded && (
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={() => {
              onStartVoiceChat();
              onToggleExpand();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <Mic />
          </button>
          <button
            onClick={() => {
              onStartTextChat();
              onToggleExpand();
            }}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <MessageCircle />
          </button>
        </div>
      )}

      <button
        onClick={() => onToggleExpand()}
        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-transform transform hover:rotate-90"
      >
        {isExpanded ? <X /> : <Plus />}
      </button>
    </div>
  );
}

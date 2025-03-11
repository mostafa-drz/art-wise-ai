'use client';

import { BrainCircuit, MessageSquareText, X, MessageCircle } from 'lucide-react';

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
          <div className="group relative">
            <button
              onClick={() => {
                onStartVoiceChat();
                onToggleExpand();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              <BrainCircuit size={20} />
            </button>
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Voice Chat - Natural conversations
            </div>
          </div>
          <div className="group relative">
            <button
              onClick={() => {
                onStartTextChat();
                onToggleExpand();
              }}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              <MessageSquareText size={20} />
            </button>
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Text Chat - Precise interactions
            </div>
          </div>
        </div>
      )}

      <div className="group relative">
        <button
          onClick={() => onToggleExpand()}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-transform transform hover:rotate-90"
        >
          {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isExpanded ? 'Close menu' : 'Open chat options'}
        </div>
      </div>
    </div>
  );
}

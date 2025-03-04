import React from 'react';
import { AudioPlayer } from './AudioPlayer';

interface GenerateAudioButtonProps {
  onGenerateAudio: () => void;
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const GenerateAudioButton: React.FC<GenerateAudioButtonProps> = ({
  onGenerateAudio,
  audioUrl,
  error,
  isLoading,
}) => {
  return (
    <div className="flex justify-center w-full max-w-[700px] items-center">
      {!audioUrl ? (
        <button
          onClick={onGenerateAudio}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating Audio Guide...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span>Generate Audio Guide</span>
            </>
          )}
        </button>
      ) : (
        <AudioPlayer audioBase64={audioUrl} fileName="art-guide.mp3" />
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

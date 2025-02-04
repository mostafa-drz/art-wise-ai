import React from 'react';

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
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onGenerateAudio}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        <span className="text-xl mr-2">🎧</span>
        {isLoading ? 'Generating...' : 'Generate Audio'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

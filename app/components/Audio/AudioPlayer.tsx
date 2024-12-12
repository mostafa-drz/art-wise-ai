'use client';

import React from 'react';

interface AudioPlayerProps {
  audioBase64: string;
  fileName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBase64, fileName }) => {
  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioBase64;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4 bg-white shadow rounded-lg">
      <audio controls className="w-full">
        <source src={audioBase64} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={downloadAudio}
        className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
      >
        Save Audio
      </button>
    </div>
  );
};
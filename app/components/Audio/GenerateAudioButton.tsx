'use client';

import React, { useState } from 'react';
import {AudioPlayer} from './AudioPlayer';

interface GeneratePodcastButtonProps {
  context: any; // Artwork context data
}

export const GenerateAudioButton: React.FC<GeneratePodcastButtonProps> = ({ context }) => {
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePodcast = async () => {
    setLoading(true);
    setError(null);
    setAudioBase64(null);

    try {
      const res = await fetch('/api/generatePodcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, language: 'en-US', gender: 'NEUTRAL' }),
      });

      if (!res.ok) throw new Error('Failed to generate podcast. Please try again.');
      const { audioBase64 } = await res.json();

      setAudioBase64(audioBase64);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {!audioBase64 && !loading && (
        <button
          onClick={handleGeneratePodcast}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          🎧 Generate Audio 
        </button>
      )}

      {loading && <p className="text-gray-600 animate-pulse">🔄 Generating audio...</p>}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {audioBase64 && <AudioPlayer audioBase64={audioBase64} fileName="artwork_podcast.mp3" />}
    </div>
  );
};
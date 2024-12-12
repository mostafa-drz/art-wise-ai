import React, { useState } from 'react';
import { Output, VoiceGender } from '@/app/types';

// Define the props expected for the button
interface GenerateAudioButtonProps {
  context: Output; // Artwork context, required
  language?: string; // Optional: language for the audio, default is 'en-US'
  gender?: VoiceGender; // Optional: voice gender, default is 'NEUTRAL'
}

export const GenerateAudioButton: React.FC<GenerateAudioButtonProps> = ({
  context,
  language = 'en-US',
  gender = VoiceGender.NEUTRAL,
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAudio = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make sure to pass context, language, and gender
      const response = await fetch('/api/generateAudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, language, gender }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const data = await response.json();
      setAudioUrl(data.audioUrl); // Set the audio URL returned by the server
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={generateAudio}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Audio'}
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
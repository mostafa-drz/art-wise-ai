'use client';

import React from 'react';
import Results from '../Results';
import { GenerateAudioButton } from '../Audio';
import { Output, User } from '../../types';

interface ResultsSectionProps {
  data: Output;
  user: User;
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onGenerateAudio: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  data,
  audioUrl,
  isLoading,
  error,
  onGenerateAudio,
}) => {
  return (
    <div className="space-y-6">
      <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4">
        <GenerateAudioButton
          onGenerateAudio={onGenerateAudio}
          audioUrl={audioUrl}
          isLoading={isLoading}
          error={error}
        />
      </div>
      <Results {...data} />
    </div>
  );
};

export default ResultsSection;

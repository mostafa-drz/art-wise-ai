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
    <div className="flex flex-col gap-2">
      <GenerateAudioButton
        onGenerateAudio={onGenerateAudio}
        audioUrl={audioUrl}
        isLoading={isLoading}
        error={error}
      />
      <Results {...data} />
    </div>
  );
};

export default ResultsSection;

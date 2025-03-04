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
      <div className="bg-white rounded-lg p-4 flex justify-center items-center">
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

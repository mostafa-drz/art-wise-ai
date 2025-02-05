// hooks/useArtwiseAPI.ts

import { useMutation } from '@tanstack/react-query';
import { identifyArtwork, sendMessage, generateAudio } from '@/utils/api';
import { User, Output } from '@/types';
import { Content } from '@google-cloud/vertexai';

// Identify Artwork Hook
export const useIdentifyArtwork = (user: User) => {
  return useMutation({
    mutationFn: ({ imageURL, language }: { imageURL: string; language: string }) =>
      identifyArtwork({ user, imageURL, language }),
  });
};

// Send Chat Message Hook
export const useSendMessage = (user: User) => {
  return useMutation({
    mutationFn: ({
      message,
      history,
      context,
    }: {
      message: string;
      history: Content[];
      context: Output | null;
    }) => sendMessage({ user, message, history, context }),
  });
};

// Generate Audio Hook
export const useGenerateAudio = (user: User) => {
  return useMutation({
    mutationFn: ({ context, language }: { context: Output; language: string }) =>
      generateAudio({ user, context, language }),
  });
};

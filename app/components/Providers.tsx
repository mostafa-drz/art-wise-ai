'use client';

import React, { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/context/Auth';
import { GlobalStateProvider } from '@/context/GlobalState';
import { OpenAIRealtimeWebRTCProvider } from '@/context/OpenAIRealtimeWebRTC';
import { OpenAIRealtimeContextConfig } from '@/context/OpenAIRealtimeWebRTC/types';

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const realtimeConfig: OpenAIRealtimeContextConfig = {
  realtimeApiUrl: process.env.NEXT_PUBLIC_OPENAI_REALTIME_API_URL as string,
  modelId: process.env.NEXT_PUBLIC_OPEN_AI_MODEL_ID as string,
};

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider>
          <OpenAIRealtimeWebRTCProvider config={realtimeConfig}>
            {children}
          </OpenAIRealtimeWebRTCProvider>
        </GlobalStateProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default Providers;

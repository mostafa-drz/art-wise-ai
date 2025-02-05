'use client';

import React, { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/context/Auth';
import { GlobalStateProvider } from '@/context/GlobalState';
import { OpenAIRealtimeWebRTCProvider } from '@/context/OpenAIRealtimeWebRTC';

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider>
          <OpenAIRealtimeWebRTCProvider>{children}</OpenAIRealtimeWebRTCProvider>
        </GlobalStateProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default Providers;

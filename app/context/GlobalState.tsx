'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GlobalState {
  language: string;
  setLanguage: (language: string) => void;
  sessionId: string;
}

const defaultState: GlobalState = {
  language: 'en-US',
  setLanguage: () => {},
  sessionId: '',
};

const GlobalStateContext = createContext<GlobalState>(defaultState);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('en-US'); // Manage selected language
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    setLanguage(navigator.language);

    let storedSessionId = sessionStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // State object
  const globalState: GlobalState = {
    language,
    setLanguage,
    sessionId,
  };

  return <GlobalStateContext.Provider value={globalState}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

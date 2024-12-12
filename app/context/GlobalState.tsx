'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface GlobalState {
  language: string;
  setLanguage: (language: string) => void;
}

const defaultState: GlobalState = {
  language: 'en-US',
  setLanguage: () => {},
};

const GlobalStateContext = createContext<GlobalState>(defaultState);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('en-US'); // Manage selected language

  useEffect(() => {
    setLanguage(navigator.language);
  }, []);

  // State object
  const globalState: GlobalState = {
    language,
    setLanguage,
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

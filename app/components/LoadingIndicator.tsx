'use client';

import React from 'react';

const LoadingIndicator = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  if (isLoading)
    return <div className="animate-pulse text-3xl text-gray-600">🤖 Working on it...</div>;
  return <>{children}</>;
};

export default LoadingIndicator;

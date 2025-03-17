'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  children,
  variant = 'default',
  size = 'md',
}) => {
  if (!isLoading) return <>{children}</>;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} strokeWidth={2.5} />
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {spinner}
      <p className="text-neutral text-body animate-pulse">Processing...</p>
    </div>
  );
};

export default LoadingIndicator;

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Auth';

interface OnlyUnAuthenticatedProps {
  children: React.ReactNode;
}

const OnlyUnAuthenticated: React.FC<OnlyUnAuthenticatedProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{!user ? children : null}</>;
};

export default OnlyUnAuthenticated;

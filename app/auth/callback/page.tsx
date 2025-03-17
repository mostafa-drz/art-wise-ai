'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/Auth';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const { handleSignInWithEmailLink, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        await handleSignInWithEmailLink();
        router.push('/');
      } catch (error) {
        console.error(error);
        alert('Failed to sign in. Please try again.');
      }
    };
    if (!loading) {
      completeSignIn();
    }
  }, [handleSignInWithEmailLink, router, loading]);

  return (
    <div className="container mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Signing In...</h1>
      <p className="text-center">Please wait while we complete your sign-in process.</p>
    </div>
  );
}

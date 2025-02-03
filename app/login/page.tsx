'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/Auth';

export default function LoginPage() {
  const { sendSignInEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendSignInEmail(email);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">🎨 Art Wise AI</h1>
        <p className="text-center text-gray-600 mb-6">Unlock the world of art insights</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Get Magic Link'}
          </button>
          {status === 'success' && (
            <p className="text-green-500 text-center">Check your inbox for the magic link!</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-center">Failed to send the link. Please try again.</p>
          )}
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Discover, Learn, and Appreciate Art Like Never Before.
        </div>
      </div>
    </div>
  );
}

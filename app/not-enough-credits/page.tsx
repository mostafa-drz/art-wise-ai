'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

export default function InsufficientCreditsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'submitted'>('idle');

  const handleRequestCredits = async () => {
    setStatus('loading');
    try {
      // Simulate API call to request more credits
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('submitted');
    } catch (error) {
      console.error('Failed to request credits:', error);
      setStatus('idle');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🚫 Not Enough Credits</h1>
          <p className="text-gray-600 mb-6">
            You’ve run out of credits. Click the button below to request more and continue exploring
            art insights.
          </p>

          <button
            onClick={handleRequestCredits}
            className={`w-full px-4 py-3 ${
              status === 'submitted' ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-semibold rounded-lg shadow-md transition`}
            disabled={status === 'loading' || status === 'submitted'}
          >
            {status === 'loading'
              ? 'Submitting...'
              : status === 'submitted'
                ? 'Request Submitted ✅'
                : 'Request More Credits'}
          </button>

          <div className="mt-6 text-gray-500 text-sm">
            Thank you for using <b>Art Wise AI</b> to unlock the stories behind artworks.
          </div>
          <div className="mt-4 text-gray-600 text-sm">
            If you need more credits, let us know. Credits get updated monthly. Every user receives
            2000 free credits every month.
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

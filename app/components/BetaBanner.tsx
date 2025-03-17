'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the banner before
    const hasSeenBanner = localStorage.getItem('hasSeenBetaBanner');
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hasSeenBetaBanner', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-purple-600 to-purple-900 px-6 py-2.5 sm:px-3.5 shadow-sm rounded-sm mb-4">
      <div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl">
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-purple-500 to-purple-300 opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-white">
          <strong className="font-semibold">Open Source Project</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          This is a free and open source project. Check out the code on GitHub!
        </p>
        <Link
          href="https://github.com/mostafa-drz/art-wise-ai"
          className="flex items-center gap-x-1 rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 text-white/80 hover:text-white transition-colors focus-visible:outline-offset-[-4px]"
          onClick={handleDismiss}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

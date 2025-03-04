import React from 'react';
import { Output } from '../types';

const Results: React.FC<Output> = ({
  art_title,
  artist_name,
  date,
  more_about_artist,
  brief_history,
  technical_details,
  other_facts,
  recommended,
  imageURL,
}) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden">
      {/* Hero Section with Image */}
      <div className="relative h-[50vh] min-h-[400px] max-h-[600px] w-full bg-gray-100">
        <img
          src={imageURL}
          alt={`${art_title} by ${artist_name}`}
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{art_title}</h1>
          <p className="text-lg text-white/90">
            {artist_name}, {date}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-8">
        {/* About the Artist */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            About the Artist
          </h2>
          <p className="text-gray-700 leading-relaxed">{more_about_artist}</p>
        </section>

        {/* Historical Context */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Historical Context
          </h2>
          <p className="text-gray-700 leading-relaxed">{brief_history}</p>
        </section>

        {/* Technical Analysis */}
        <section className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Technical Details
          </h2>
          <p className="text-gray-700 leading-relaxed">{technical_details}</p>
        </section>

        {/* Additional Facts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Interesting Facts
          </h2>
          <p className="text-gray-700 leading-relaxed">{other_facts}</p>
        </section>

        {/* Recommended Artworks */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group block bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.art_title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.artist_name}, {item.date}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default Results;

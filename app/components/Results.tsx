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
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h3 className="text-xl font-semibold text-gray-800">Artwork Details</h3>
      </div>
      <div className="w-full h-64 sm:h-96 relative overflow-hidden">
        <img
          src={imageURL}
          alt="Original Artwork"
          loading="lazy"
          className="object-contain w-full h-full"
        />
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">Art Title</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{art_title}</dd>
          </div>
          <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">Artist Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{artist_name}</dd>
          </div>
          <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{date}</dd>
          </div>
          <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">More About Artist</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {more_about_artist}
            </dd>
          </div>
          <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">Brief History</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{brief_history}</dd>
          </div>
          <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">Technical Details</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {technical_details}
            </dd>
          </div>
          <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">Other Facts</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{other_facts}</dd>
          </div>
          <div className="bg-white px-6 py-5">
            <h4 className="text-lg font-semibold text-gray-800">Recommended Artworks</h4>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((item, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4">
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-800">{item.art_title}</h5>
                    <p className="text-sm text-gray-600">
                      By {item.artist_name}, {item.date}
                    </p>
                    <a href={item.link} className="text-teal-600 hover:text-teal-900 text-sm">
                      Learn more
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Results;

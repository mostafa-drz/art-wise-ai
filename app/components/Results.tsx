import React from 'react';
import Image from 'next/image';

interface Props extends Output {}

const Results: React.FC<Props> = ({
  art_title,
  artist_name,
  date,
  more_about_artist,
  brief_history,
  technical_details,
  other_facts,
  recommended,
  imageBase64,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Artwork Details</h3>
      </div>
      <div className="w-full h-64 sm:h-96 relative overflow-hidden">
        <img
          src={`data:image/jpeg;base64, ${imageBase64}`}
          alt="Original Artwork"
          loading="lazy"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Art Title</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{art_title}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Artist Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{artist_name}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{date}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">More About Artist</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {more_about_artist}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Brief History</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{brief_history}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Technical Details</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {technical_details}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Other Facts</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{other_facts}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Recommended Artworks</h4>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  {/* <img src={item.image_url} alt={item.art_title} className="rounded-md" /> */}
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-900">{item.art_title}</h5>
                    <p className="text-sm text-gray-500">
                      By {item.artist_name}, {item.date}
                    </p>
                    <a href={item.link} className="text-indigo-600 hover:text-indigo-900 text-sm">
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

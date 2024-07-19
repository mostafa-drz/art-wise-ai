'use client';

import React from 'react';

interface FormProps {
  errorMessage?: string;
  isLoading?: boolean;
  onSubmit: (input: any) => void;
}

const UploadForm: React.FC<FormProps> = ({ errorMessage, isLoading, onSubmit }) => {
  const [defaultLanguage, setDefaultLanguage] = React.useState<string>('en_US');

  React.useEffect(() => {
    setDefaultLanguage(navigator.language);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        action="/api/identify"
        method="post"
        className="flex flex-col space-y-4"
        encType="multipart/form-data"
        onSubmit={onSubmit}
      >
        <fieldset disabled={isLoading}>
          <div className="text-lg font-medium text-gray-900 mb-4">
            Upload an image or paste an image URL to start
          </div>

          {/* Image File Upload */}
          <div className="flex items-center space-x-3">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 shrink-0">
              Upload Image:
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="mt-1 flex-grow border-gray-300 rounded-md shadow-sm text-sm leading-tight focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Language*/}
          <div className="flex items-center space-x-3">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 shrink-0">
              Language:
            </label>
            <select
              name="language"
              id="language"
              defaultValue={defaultLanguage}
              className="flex-1 border-gray-300 rounded-md shadow-sm text-sm leading-tight focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-CA">English (Canada)</option>
              <option value="fr-CA">French (Canada)</option>
              <option value="fr-FR">French (France)</option>
              {/* Add more language options as needed */}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="disabled:opacity-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              Submit
            </button>
          </div>
        </fieldset>
      </form>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default UploadForm;

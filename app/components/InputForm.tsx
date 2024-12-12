'use client';

import React from 'react';

interface FormProps {
  errorMessage?: string;
  isLoading?: boolean;
  onSubmit: (input: any) => void;
}

const SUPPORTED_LANGUES: {value:string; label: string}[]= [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-CA', label: 'English (Canada)' },
  { value: 'fr-CA', label: 'French (Canada)' },
  { value: 'fr-FR', label: 'French (France)' },
  {value: 'de-DE', label: 'German (Germany)'},
  {value: 'es-ES', label: 'Spanish (Spain)'},
]

const UploadForm: React.FC<FormProps> = ({ errorMessage, isLoading, onSubmit }) => {
  const [defaultLanguage, setDefaultLanguage] = React.useState<string>('en_US');

  React.useEffect(() => {
    setDefaultLanguage(navigator.language);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-md">
      <form
        action="/api/identify"
        method="post"
        className="flex flex-col space-y-6"
        encType="multipart/form-data"
        onSubmit={onSubmit}
      >
        <fieldset disabled={isLoading}>
          <div className="text-2xl font-semibold text-gray-800 mb-6">Upload an image</div>

          {/* Image File Upload */}
          <div className="flex items-center space-x-3">
            <label htmlFor="image" className="block text-sm font-medium text-gray-600 shrink-0">
              Upload Image:
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              capture="environment"
              className="mt-1 flex-grow border-gray-300 rounded-md shadow-sm text-sm leading-tight focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Language */}
          <div className="flex items-center space-x-3">
            <label htmlFor="language" className="block text-sm font-medium text-gray-600 shrink-0">
              Language:
            </label>
            <select
              name="language"
              id="language"
              defaultValue={defaultLanguage}
              className="flex-1 border-gray-300 rounded-md shadow-sm text-sm leading-tight focus:ring-teal-500 focus:border-teal-500"
            >
              {SUPPORTED_LANGUES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="disabled:opacity-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              disabled={isLoading}
            >
              Submit
            </button>
          </div>
        </fieldset>
      </form>
      {errorMessage && <p className="text-sm text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default UploadForm;

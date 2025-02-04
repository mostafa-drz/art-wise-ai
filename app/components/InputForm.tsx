import React from 'react';

interface InputFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  error?: string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, error }) => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center space-y-4 w-full max-w-md p-4 bg-white shadow-md rounded-lg"
    >
      <label className="w-full">
        <span className="block text-sm font-medium text-gray-700 mb-1">Upload Artwork Image</span>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          required
        />
      </label>

      <label className="w-full">
        <span className="block text-sm font-medium text-gray-700 mb-1">Language</span>
        <select
          name="language"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Artwork'}
      </button>
    </form>
  );
};

export default InputForm;

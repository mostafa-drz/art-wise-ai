"use client";

import React, { useState } from 'react';

function InputForm({onSubmit}: {onSubmit: (input: Input) => void}) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle form submission
    onSubmit({image_url: inputValue});
  }

  return (
    <div className="mb-8">
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
    <label htmlFor="imageUrl" className="text-md font-medium text-gray-700 flex whitespace-nowrap items-center">Image URL
        <input type="text" id="imageUrl" name="imageUrl" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 max-w-80" placeholder="Enter image URL here..." onChange={handleInputChange}/>
    </label>
      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Analyze Image
      </button>
    </form>
  </div>
  );
}

export default InputForm;
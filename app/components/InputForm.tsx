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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default InputForm;
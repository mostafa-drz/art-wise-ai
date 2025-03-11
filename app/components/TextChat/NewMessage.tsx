'use client';

import React from 'react';

interface NewMessageProps {
  onSend: () => void;
  isLoading: boolean;
  value: string;
  onChange: (text: string) => void;
}

const NewMessage: React.FC<NewMessageProps> = ({ onSend, isLoading, value, onChange }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend();
  };
  return (
    <form className="flex items-center p-3 border-t border-gray-300" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        disabled={isLoading}
        name="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      <button
        type="submit"
        className={`ml-2 px-4 py-2 rounded-md ${
          isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white transition'
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default NewMessage;

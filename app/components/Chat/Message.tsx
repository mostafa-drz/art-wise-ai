import React from 'react';
import { Content } from '@google/generative-ai';

interface MessageProps {
  message: Content;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`message ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'} p-3 rounded-lg my-2`}
    >
      {message.parts.map((part, index) => (
        <div key={index}>{part.text && <p>{part.text}</p>}</div>
      ))}
    </div>
  );
};

export default Message;

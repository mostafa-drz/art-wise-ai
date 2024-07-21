import React from 'react';
import { Content } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: Content;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`message ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'} p-3 rounded-lg my-2`}
    >
      {message.parts.map((part, index) => (
        <div key={index}>
          {part.text && <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>}
        </div>
      ))}
    </div>
  );
};

export default Message;

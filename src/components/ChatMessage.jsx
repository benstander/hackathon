import React from 'react';

export function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-gray-200 text-gray-800'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
} 
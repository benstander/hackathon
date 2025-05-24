import React from 'react';

export function ChatMessage({ message, isUser }) {
  console.log("ChatMessage received:", message, isUser);

  const safeMessage = typeof message === 'string' ? message : '';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-200 text-gray-800">
          <div className="text-sm">{safeMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-grey-200 text-gray-800">
        <div className="text-sm">{safeMessage}</div>
      </div>
    </div>
  );
}
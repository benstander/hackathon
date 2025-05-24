import React from 'react';
import { Link } from 'react-router-dom';

export function ChatHistorySidebar({ chatHistory }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-3 px-4 py-4 border-t border-gray-200">
        <img src="/icons/previous-chats-icon.svg" alt="Previous chats" className="w-5 h-5" />
        <span className="text-black font-regular">Previous Chats</span>
      </div>
      <ul className="flex flex-col gap-2 px-4">
        {chatHistory.map((chat, index) => (
          <li key={index}>
            <Link 
              to="/chat" 
              state={{ initialMessage: chat.firstMessage }}
              className="block p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <div className="text-sm font-medium truncate">{chat.firstMessage}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(chat.timestamp).toLocaleDateString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 
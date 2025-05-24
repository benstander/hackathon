import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatHistorySidebar } from './ChatHistorySidebar';

export default function Sidebar({ chatHistory = [] }) {
  const location = useLocation();
  return (
    <aside className="w-[260px] flex flex-col h-screen border-r border-gray-200 bg-gray-50 py-6 pl-8 pr-4">
      {/* Top: App Icon and New Chat Icon */}
      <div className="flex items-center justify-between mb-10 px-4 py-2">
        <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
        <Link to="/home" className="p-1 rounded-full hover:bg-gray-100 transition" aria-label="New Chat">
          <img src="/icons/newChat.svg" alt="New Chat" className="w-6 h-6" />
        </Link>
      </div>
      <nav className="flex flex-col gap-4">
        <Link
          to="/home"
          className={`flex items-center gap-3 text-black font-regular hover:text-black px-4 py-2 rounded-[10px] ${location.pathname === '/home' ? 'bg-gray-200' : ''}`}
        >
          <img src="/icons/home-icon.svg" alt="Home" className="w-6 h-6" /> Home
        </Link>
        <Link
          to="/overview"
          className={`flex items-center gap-3 text-black font-regular hover:text-black px-4 py-2 rounded-[10px] ${location.pathname === '/overview' ? 'bg-gray-200' : ''}`}
        >
          <img src="/icons/spending-icon.svg" alt="Overview" className="w-6 h-6" /> Overview
        </Link>
        <Link
          to="/budget"
          className={`flex items-center gap-3 text-black font-regular hover:text-black px-4 py-2 rounded-[10px] ${location.pathname === '/budget' ? 'bg-gray-200' : ''}`}
        >
          <img src="/icons/budget-icon.svg" alt="Budget" className="w-6 h-6" /> Budget
        </Link>
      </nav>

      {/* Chat History Section */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="flex items-center gap-3 px-4 mb-4">
          <img src="/icons/previous-chats-icon.svg" alt="Previous chats" className="w-5 h-5" />
          <span className="text-black font-medium">Recent Conversations</span>
        </div>
        <ul className="flex flex-col gap-2 px-4">
          {chatHistory.length === 0 ? (
            <li className="text-gray-400 text-sm italic">No conversations yet.</li>
          ) : (
            chatHistory.map((chat, index) => (
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
            ))
          )}
        </ul>
      </div>
    </aside>
  );
} 
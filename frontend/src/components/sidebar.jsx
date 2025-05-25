import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function groupChatsByDate(chatHistory) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const groups = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  chatHistory.forEach(chat => {
    const chatDate = new Date(chat.timestamp);
    if (
      chatDate.getDate() === today.getDate() &&
      chatDate.getMonth() === today.getMonth() &&
      chatDate.getFullYear() === today.getFullYear()
    ) {
      groups.Today.push(chat);
    } else if (
      chatDate.getDate() === yesterday.getDate() &&
      chatDate.getMonth() === yesterday.getMonth() &&
      chatDate.getFullYear() === yesterday.getFullYear()
    ) {
      groups.Yesterday.push(chat);
    } else if (chatDate > sevenDaysAgo) {
      groups['Previous 7 Days'].push(chat);
    } else {
      groups.Older.push(chat);
    }
  });
  return groups;
}

export default function Sidebar({ chatHistory = [], collapsed, setCollapsed }) {
  const location = useLocation();
  const grouped = groupChatsByDate(chatHistory);
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];
  const activeInitialMessage = location.pathname === '/chat' && location.state?.initialMessage;

  if (collapsed) {
    return (
      <div className="fixed top-0 left-0 z-50 flex items-center h-20 px-8 bg-gray-50 gap-4">
        <button onClick={() => setCollapsed(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
          <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
        </button>
        <Link to="/home" className="p-1 rounded-full hover:bg-gray-100 transition" aria-label="New Chat">
          <img src="/icons/newChat.svg" alt="New Chat" className="w-7 h-7" />
        </Link>
        <Link to="/home" className="text-[24px] font-medium ml-4">onTrack</Link>
      </div>
    );
  }

  return (
    <aside className="fixed top-0 left-0 w-[260px] flex flex-col h-screen border-r border-gray-200 bg-gray-50 py-0 pr-4 gap-10">
      {/* Top: App Icon and New Chat Icon */}
      <div className="flex items-center justify-between h-20 px-8">
        <button onClick={() => setCollapsed(true)} className="p-1 rounded-full hover:bg-gray-100 transition">
          <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
        </button>
        <Link to="/home" className="p-1 rounded-full hover:bg-gray-100 transition" aria-label="New Chat">
          <img src="/icons/newChat.svg" alt="New Chat" className="w-7 h-7" />
        </Link>
      </div>
      {/* Previous Chats Only */}
      <div className="flex-1 overflow-y-auto pl-6">
        {groupOrder.map(
          group =>
            grouped[group] && grouped[group].length > 0 && (
              <div key={group} className="mb-6">
                <div className="uppercase text-xs text-gray-400 font-semibold px-4 mb-2 tracking-wider">{group}</div>
                <ul className="flex flex-col gap-2 px-2">
                  {grouped[group].map((chat, index) => {
                    const isActive = chat.firstMessage === activeInitialMessage;
                    return (
                      <li key={index}>
                        <Link
                          to="/chat"
                          state={{ initialMessage: chat.firstMessage }}
                          className={`block p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 ${isActive ? 'bg-gray-200' : ''}`}
                        >
                          <div className="text-sm font-medium truncate">{chat.firstMessage}</div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
        )}
        {chatHistory.length === 0 && (
          <div className="text-gray-400 text-sm italic px-4 mt-8">No previous chats</div>
        )}
      </div>
    </aside>
  );
} 
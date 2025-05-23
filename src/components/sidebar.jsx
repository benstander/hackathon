import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-[260px] flex flex-col h-screen border-r border-gray-200 bg-gray-50 py-6 pl-8 pr-4">
      {/* Top: App Icon and Nav */}
      <div>
        <div className="flex items-center mb-10 px-4 py-2">
          <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
        </div>
        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            className={`flex items-center gap-3 text-black font-regular hover:text-black px-4 py-2 rounded-[10px] ${location.pathname === '/' ? 'bg-gray-200' : ''}`}
          >
            <img src="/icons/home-icon.svg" alt="Home" className="w-6 h-6" /> Home
          </Link>
          <Link
            to="/spending"
            className={`flex items-center gap-3 text-black font-regular hover:text-black px-4 py-2 rounded-[10px] ${location.pathname === '/spending' ? 'bg-gray-200' : ''}`}
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
      </div>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Bottom: Previous Chats */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-3 px-4 py-4">
          <img src="/icons/previous-chats-icon.svg" alt="Previous chats" className="w-5 h-5" />
          <span className="text-black font-regular">Previous Chats</span>
        </div>
        <ul className="ml-4 text-gray-400 text-sm flex flex-col gap-3">
          <li className="truncate whitespace-nowrap max-w-[180px]">Create a budget for me</li>
          <li className="truncate whitespace-nowrap max-w-[180px]">How can i save more money</li>
          <li className="truncate whitespace-nowrap max-w-[180px]">Where am i spending the most ...</li>
          <li className="truncate whitespace-nowrap max-w-[180px]">Create a budget for me</li>
          <li className="truncate whitespace-nowrap max-w-[180px]">How can i save more money</li>
        </ul>
      </div>
    </aside>
  );
} 
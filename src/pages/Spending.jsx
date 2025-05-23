import React from 'react';
import { Link } from 'react-router-dom';

function Spending() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] flex flex-col justify-between border-r border-gray-200 bg-white py-6 pl-8 pr-4">
        <div>
          {/* App Icon */}
          <div className="flex items-center mb-10">
            <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6 mr-2" />
          </div>
          {/* Nav Links */}
          <nav className="flex flex-col gap-[32px]">
            <Link to="/" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black px-3 py-2 rounded-xl">
              <img src="/icons/home-icon.svg" alt="Home" className="w-6 h-6" /> Home
            </Link>
            <Link to="/spending" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black px-3 py-2 rounded-xl">
              <img src="/icons/spending-icon.svg" alt="Spending" className="w-6 h-6" /> Spending
            </Link>
            <Link to="#" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black px-3 py-2 rounded-xl">
              <img src="/icons/budget-icon.svg" alt="Budget" className="w-6 h-6" /> Budget
            </Link>
            <Link to="#" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black px-3 py-2 rounded-xl">
              <img src="/icons/portfolio-icon.svg" alt="Portfolio" className="w-6 h-6" /> Portfolio
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-6 mb-2">
          <a href="#" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black px-3 py-2 rounded-xl">
            <img src="/icons/previous-chats-icon.svg" alt="Previous chats" className="w-5 h-5" /> Previous chats
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black px-3 py-2 rounded-xl">
            <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" /> Settings
          </a>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-12">
          <div className="text-[22px] font-regular">Spending</div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 border px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">
              + Account
            </button>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-white">
              <img src="/icons/account-icon.svg" alt="Account" className="w-6 h-6" />
            </div>
          </div>
        </div>
        {/* Main Grid */}
        <div className="flex-1 px-12 py-8">
          <div className="grid grid-cols-3 grid-rows-3 gap-8 h-full">
            {/* Spending This Month (large line graph) */}
            <div className="col-span-2 row-span-2 bg-white border border-gray-400 rounded-2xl p-6 flex flex-col">
              <span className="mb-2 text-sm">SPENDING THIS MONTH</span>
              <svg viewBox="0 0 400 200" className="w-full h-48">
                <polyline
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  points="10,180 50,120 90,130 130,100 170,110 210,80 250,90 290,60 330,70 370,40"
                />
                <text x="10" y="195" fontSize="12">07</text>
                <text x="50" y="195" fontSize="12">10</text>
                <text x="90" y="195" fontSize="12">13</text>
                <text x="130" y="195" fontSize="12">16</text>
                <text x="170" y="195" fontSize="12">19</text>
                <text x="210" y="195" fontSize="12">22</text>
                <text x="250" y="195" fontSize="12">25</text>
                <text x="290" y="195" fontSize="12">28</text>
              </svg>
            </div>
            {/* Income This Month (small line graph) */}
            <div className="col-span-1 row-span-1 bg-white border border-gray-400 rounded-2xl p-6 flex flex-col">
              <span className="mb-2 text-sm">INCOME THIS MONTH</span>
              <svg viewBox="0 0 200 120" className="w-full h-24">
                <polyline
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  points="10,100 40,80 70,90 100,60 130,70 160,40 190,50"
                />
              </svg>
            </div>
            {/* Category Breakdown (pie chart) */}
            <div className="col-span-1 row-span-2 bg-white border border-gray-400 rounded-2xl p-6 flex flex-col">
              <span className="mb-2 text-sm">CATEGORY BREAKDOWN</span>
              <svg viewBox="0 0 120 120" className="w-full h-32">
                <circle cx="60" cy="60" r="50" fill="#eee" stroke="#000" strokeWidth="2" />
                <path d="M60,60 L60,10 A50,50 0 0,1 110,60 Z" fill="#bbb" stroke="#000" strokeWidth="2" />
                <path d="M60,60 L110,60 A50,50 0 0,1 60,110 Z" fill="#888" stroke="#000" strokeWidth="2" />
                <path d="M60,60 L60,110 A50,50 0 0,1 10,60 Z" fill="#555" stroke="#000" strokeWidth="2" />
                <path d="M60,60 L10,60 A50,50 0 0,1 60,10 Z" fill="#222" stroke="#000" strokeWidth="2" />
              </svg>
            </div>
            {/* Latest Transactions */}
            <div className="col-span-1 row-span-1 bg-white border border-gray-400 rounded-2xl p-6 flex flex-col">
              <span className="mb-2 text-sm">LATEST TRANSACTIONS</span>
            </div>
            {/* Upcoming Transactions */}
            <div className="col-span-1 row-span-1 bg-white border border-gray-400 rounded-2xl p-6 flex flex-col">
              <span className="mb-2 text-sm">UPCOMING TRANSACTIONS</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Spending; 
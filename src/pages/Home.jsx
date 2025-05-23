import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');

  const handleSend = () => {
    if (query.trim() === '') return;
    // TODO: Replace with your actual send logic
    console.log('Send:', query);
    setQuery('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[260px] flex flex-col justify-between border-r border-gray-200 bg-gray-50 py-6 pl-8 pr-4">
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
          <a href="#" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black">
            <img src="/icons/previous-chats-icon.svg" alt="Previous chats" className="w-5 h-5" /> Previous chats
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-800 font-regular hover:text-black">
            <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" /> Settings
          </a>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-12">
          <div className="text-[22px] font-regular">Hello, Ben</div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 border px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">
              + Account
            </button>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-white">
              <img src="/icons/account-icon.svg" alt="Account" className="w-7 h-7" />
            </div>
          </div>
        </div>
        {/* Centered Content */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="mt-8 mb-8">
            <h2 className="text-[28px] font-regular text-center mb-8">What do you want to know?</h2>
            <div className="w-[720px] max-w-full mx-auto">
              <div className="relative bg-white border border-gray-300 rounded-2xl shadow-sm h-48 flex flex-col justify-between">
                {/* Interactive input */}
                <input
                  className="absolute top-8 left-8 bg-transparent outline-none border-none text-gray-400 text-[18px] w-2/3"
                  placeholder="Ask anything ...."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                />
                {/* Bottom row for icons */}
                <div className="flex items-center justify-between px-8 pb-4 w-full absolute left-0 bottom-0">
                  <button type="button" aria-label="Add" className="focus:outline-none">
                    <img src="/icons/plus-icon.svg" alt="Plus" className="w-5 h-5" />
                  </button>
                  <button type="button" aria-label="Send" onClick={handleSend} className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition focus:outline-none">
                    <img src="/icons/send-icon.svg" alt="Send" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Placeholder Cards */}
          <div className="flex gap-6 mt-4 w-[90%] max-w-6xl justify-center">
            <div className="w-64 h-36 bg-gray-200 rounded-xl" />
            <div className="w-64 h-36 bg-gray-200 rounded-xl" />
            <div className="w-64 h-36 bg-gray-200 rounded-xl" />
            <div className="w-64 h-36 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home; 
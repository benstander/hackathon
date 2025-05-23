import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryPieChart } from '../components/categoryPieChart';
import { SpendingAreaGraph } from '../components/spendingAreaGraph';

function Spending() {
  const spendingData = [
    { month: "Jan", amount: 186 },
    { month: "Feb", amount: 305 },
    { month: "Mar", amount: 237 },
    { month: "Apr", amount: 73 },
    { month: "May", amount: 209 },
    { month: "Jun", amount: 214 },
  ];

  const incomeData = [
    { month: "Jan", amount: 250 },
    { month: "Feb", amount: 280 },
    { month: "Mar", amount: 300 },
    { month: "Apr", amount: 320 },
    { month: "May", amount: 350 },
    { month: "Jun", amount: 380 },
  ];

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
          <div className="grid grid-cols-3 grid-rows-4 gap-4 h-full">
            {/* Spending This Month (large line graph) */}
            <div className="col-span-2 row-span-2">
              <SpendingAreaGraph 
                title="SPENDING THIS MONTH"
                data={spendingData}
                color="#60a5fa"
              />
            </div>
            {/* Income This Month (small line graph) */}
            <div className="col-span-1 row-span-1">
              <SpendingAreaGraph 
                title="INCOME THIS MONTH"
                data={incomeData}
                color="#2563eb"
              />
            </div>
            {/* Category Breakdown (pie chart) */}
            <div className="col-span-1 row-span-2 bg-white border border-gray-400 rounded-2xl p-6 flex flex-col">
              <span className="mb-2 text-sm">CATEGORY BREAKDOWN</span>
              <div className="col-span-1 row-span-2">
                <CategoryPieChart />
              </div>
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
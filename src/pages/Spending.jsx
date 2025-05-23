import React from 'react';
import Sidebar from '../components/sidebar';
import { CategoryPieChart } from '../components/categoryPieChart';
import { SpendingAreaGraph } from '../components/spendingAreaGraph';
import { Link } from 'react-router-dom';
import { IncomeChart } from '../components/incomeChart';

function Overview() {
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



  function IncomeCard({ label, earned, projected }) {
    const percent = Math.min((earned / projected) * 100, 100);
    return (
      <div className="bg-white border rounded-2xl p-6 flex flex-col justify-between h-full shadow h-[220px]">
        <span className="mb-2 text-sm">{label}</span>
        <div className="flex items-end gap-2 mt-4">
          <span className="text-2xl text-gray-400 font-regular">${earned}</span>
          <span className="text-2xl text-gray-400 font-regular">/</span>
          <span className="text-3xl font-medium">${projected}</span>
        </div>
        <div className="mt-4 w-full h-1.5 bg-gray-200 rounded-full shadow">
          <div
            className="h-1.5 bg-black rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-between h-20 px-12">
          <div className="text-[22px] font-regular">Overview</div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 border px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">
              + Account
            </button>
            <Link to="/settings" className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50 mr-2">
              <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" />
            </Link>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50">
              <img src="/icons/account-icon.svg" alt="Account" className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex-1 px-12 py-8">
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* Left section: Spending and Transactions */}
            <div className="col-span-2 flex flex-col gap-4 h-full">
              <div className="bg-white border rounded-[20px] p-6 flex flex-col flex-1 min-h-[300px] shadow">
                <span className="mb-2 text-sm">SPENDING THIS MONTH</span>
                <SpendingAreaGraph title="" data={spendingData} color="#000" />
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1 min-h-[220px]">
                <div className="bg-white border rounded-[20px] p-6 flex flex-col shadow">
                  <span className="mb-2 text-sm">LATEST TRANSACTIONS</span>
                </div>
                <div className="bg-white border rounded-[20px] p-6 flex flex-col shadow">
                  <span className="mb-2 text-sm">UPCOMING TRANSACTIONS</span>
                </div>
              </div>
            </div>
            {/* Right section: Income and Category Breakdown */}
            <div className="col-span-1 flex flex-col gap-4 h-full">
              <IncomeCard label="INCOME THIS MONTH" earned={2000} projected={3000} />
              <div className="bg-white border rounded-[20px] p-6 flex flex-col flex-1 shadow">
                <span className="mb-2 text-sm">CATEGORY BREAKDOWN</span>
                <CategoryPieChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Overview; 
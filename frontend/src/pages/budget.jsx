import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { BudgetChart } from '../components/budgetChart';
import { DonutPieChart } from '../components/donutPieChart';

function BudgetCategoryCard({ label, spent, allocated }) {
  const percent = Math.min((spent / allocated) * 100, 100);
  return (
    <div className="bg-white border rounded-2xl p-6 flex flex-col justify-between h-full shadow">
      <span className="mb-2 text-sm">{label}</span>
      <div className="flex items-end gap-2 mt-4">
        <span className="text-2xl text-gray-400 font-regular">${spent}</span>
        <span className="text-2xl text-gray-400 font-regular">/</span>
        <span className="text-3xl font-medium">${allocated}</span>
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

function Budget() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-between h-20 px-12">
          <div className="text-[22px] font-regular">Financial Budget</div>
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
        <div className="flex-1 px-12 py-8 flex flex-col gap-4">
          {/* Top section - 3 cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="h-[220px]">
              <BudgetCategoryCard label="TOTAL SPENT" spent={236} allocated={358} />
            </div>
            <div className="h-[220px]">
              <BudgetCategoryCard label="ESSENTIALS" spent={120} allocated={300} />
            </div>
            <div className="h-[220px]">
              <BudgetCategoryCard label="DISCRETIONARY" spent={120} allocated={300} />
            </div>
          </div>

          {/* Bottom section - 2 charts */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-white border rounded-2xl p-6 flex flex-col shadow">
              <BudgetChart />
            </div>
            <div className="bg-white border rounded-2xl p-6 flex flex-col h-full shadow">
              <DonutPieChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Budget; 
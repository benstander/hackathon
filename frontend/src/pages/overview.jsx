import React from 'react';
import Sidebar from '../components/sidebar';
import { CategoryPieChart } from '../components/categoryPieChart';
import { SpendingAreaGraph } from '../components/spendingAreaGraph';
import { Link } from 'react-router-dom';
import { IncomeChart } from '../components/incomeChart';
import { BudgetChart } from '../components/budgetChart';
import { DonutPieChart } from '../components/donutPieChart';
import { useFinancial } from '../context/FinancialContext';

function Overview() {
  const { accounts, transactions, loading, error } = useFinancial();

  // Process transactions for spending data
  const processSpendingData = () => {
    if (!transactions) return [];
    
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const amount = Math.abs(transaction.amount);
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += amount;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Math.round(amount)
    }));
  };

  // Process transactions for income data
  const processIncomeData = () => {
    if (!transactions) return [];
    
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const amount = transaction.amount > 0 ? transaction.amount : 0;
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += amount;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Math.round(amount)
    }));
  };

  const spendingData = processSpendingData();
  const incomeData = processIncomeData();

  function IncomeCard({ label, earned }) {
    return (
      <div className="bg-white border rounded-[20px] p-6 flex flex-col shadow">
        <span className="mb-4 text-sm">{label}</span>
        <span className="text-2xl font-regular text-black">${earned}</span>
      </div>
    );
  }

  function SpendingCard() {
    return (
      <div className="bg-white border rounded-[20px] p-6 flex flex-col shadow h-[400px]">
        <span className="mb-4 text-sm">TOTAL SPENDING</span>
        <div className="flex-1 flex flex-col justify-end">
          <BudgetChart />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading financial data...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-red-500">Error loading financial data: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-between h-20 px-12">
          <div className="text-[22px] font-regular">Financial Overview</div>
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
                <span className="mb-2 text-sm">CURRENT BALANCE</span>
                <SpendingAreaGraph title="" data={spendingData} color="#008000" />
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1 min-h-[220px]">
                <div className="bg-white border rounded-[20px] p-6 flex flex-col shadow">
                  <span className="mb-2 text-sm">LATEST TRANSACTIONS</span>
                  {transactions?.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span>{transaction.description}</span>
                      <span className={transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-white border rounded-[20px] p-6 flex flex-col shadow">
                  <span className="mb-2 text-sm">UPCOMING TRANSACTIONS</span>
                </div>
              </div>
            </div>
            {/* Right section: Income and Category Breakdown */}
            <div className="col-span-1 flex flex-col gap-4 h-full">
              <SpendingCard />
              <div className="bg-white border rounded-[20px] p-6 flex flex-col flex-1 shadow">
                <span className="mb-4 text-sm">SPENDING BREAKDOWN</span>
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
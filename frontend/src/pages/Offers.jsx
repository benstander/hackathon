import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { useFinancial } from '../context/FinancialContext';

const offersByCategory = {
  Insurance: [
    { type: 'NRMA', details: 'Get 20% off your first year of car insurance' },
    { type: 'Home Insurance', details: 'Comprehensive coverage with 24/7 support' },
    { type: 'Life Insurance', details: 'Protect your loved ones with flexible plans' },
    { type: 'Pet Insurance', details: 'Cover your furry friends with our pet care plans' },
  ],
  Investing: [
    { type: 'Stake', details: 'Start investing with as little as $100' },
    { type: 'Stake', details: 'Start investing with as little as £100' },
  ],
  Energy: [
    { type: 'Alinta Energy', details: 'Switch & save up to $300 annually' },
  ],
  Banking: [
    { type: 'Commbank', details: '0% interest on balance transfers for 24 months' },
    { type: 'CommBank', details: '5% interest rate on our premium savings account' },
  ],
};

export default function Offers() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-16">
          <Link to="/home" className="text-[24px] font-medium">onTrack</Link>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">
              Your Offers
            </button>
            <Link to="/settings" className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50 mr-2">
              <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" />
            </Link>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50">
              <img src="/icons/account-icon.svg" alt="Account" className="w-6 h-6" />
            </div>
          </div>
        </div>
        {/* Offers Content */}
        <div className="flex-1 bg-gray-50 py-12 px-4 ml-12">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-[24px] font-bold mb-10">All Offers</h1>
            {Object.entries(offersByCategory).map(([category, offers]) => (
              <div key={category} className="mb-12">
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {offers.map((offer, idx) => (
                    <div
                      key={offer.type + idx}
                      className="w-[220px] h-[140px] rounded-[10px] flex flex-col items-start justify-between px-8 pt-6 pb-6 bg-white border border-gray-200 hover:shadow-lg transition cursor-pointer"
                    >
                      <div className="font-bold text-base">{offer.type}</div>
                      <div className="font-normal text-[12px] mt-2">{offer.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 
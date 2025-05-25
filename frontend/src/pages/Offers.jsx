import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { useFinancial } from '../context/FinancialContext';

function getSavedHistory() {
  const saved = localStorage.getItem('chatHistory');
  return saved ? JSON.parse(saved) : [];
}

const offersByCategory = {
  Insurance: [
    { type: 'NRMA', details: '20% off car insurance through multi-policy' },
    { type: 'AAMI', details: '15% off bundling home & contents' },
    { type: 'TAL', details: '30% off first year of life insurance' },
    { type: 'PetSure', details: '2 months free on annual pet insurance' },
    { type: 'Cover-More', details: '25% off when booking 60+ days ahead' },
    { type: 'Medibank', details: '6 weeks free on annual health plans' },
    { type: 'Momentum', details: '20% off with our loyalty program' },
    { type: 'BizCover', details: '3 months free on annual insurance' },
  ],
  Investing: [
    { type: 'CommSec', details: 'Zero fees on your first 10 trades' },
    { type: 'Bell Direct', details: '$100 in brokerage credits on sign up' },
    { type: 'Raiz', details: 'No fees for first 3 months' },
    { type: 'Spaceship', details: 'Zero fees on balances under $5,000' },
    { type: 'Vanguard AU', details: 'Save 0.5% in management fees' },
    { type: 'Pearler', details: '$50 in brokerage credits on sign up' },
    { type: 'Superhero', details: 'Zero fees on ASX ETFs' },
    { type: 'SelfWealth', details: '5 free trades with $1,000 deposit' },
  ],
  Energy: [
    { type: 'Alinta Energy', details: 'Save up to $300 annually online' },
    { type: 'Origin Energy', details: '$100 credit + 10% off first year' },
    { type: 'AGL', details: '15% off with online plan' },
    { type: 'Energy Australia', details: '$50 credit + 8% pay on time' },
    { type: 'Powershop', details: 'Save up to 20% with bundles' },
    { type: 'Red Energy', details: '$75 credit + 12% online billing' },
    { type: 'Dodo', details: '10% off gas & electricity bundles' },
    { type: 'Tango Energy', details: '$50 credit + 5% direct debit' },
  ],
  Banking: [
    { type: 'CommBank', details: '0% interest on balance transfers' },
    { type: 'ANZ', details: '5% interest on premium savings' },
    { type: 'Westpac', details: '$200 cashback on new account' },
    { type: 'NAB', details: 'Save $5 monthly with digital banking' },
    { type: 'ING', details: '$100 cashback + no ATM fees' },
    { type: 'Macquarie', details: '2.5% cashback + no ATM fees' },
    { type: 'UBank', details: '4.5% interest on savings' },
    { type: 'Bendigo Bank', details: '$50 cashback + 5.99% home loan' },
  ],
};

// Helper to extract potential savings from details
function getPotentialSavings(details) {
  const match = details.match(/\$([0-9,]+)/);
  if (match) return `$${match[1]}`;
  const percentMatch = details.match(/([0-9]{1,2})%/);
  if (percentMatch) return `${percentMatch[1]}%`;
  return 'Varies';
}

export default function Offers() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState(getSavedHistory());
  const [expandedOffer, setExpandedOffer] = useState(null);

  useEffect(() => {
    setChatHistory(getSavedHistory());
    const handleStorageChange = () => setChatHistory(getSavedHistory());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (expandedOffer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [expandedOffer]);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar chatHistory={chatHistory} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[260px]'}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-16">
          <Link to="/home" className="text-[24px] font-medium">onTrack</Link>
          <div className="flex items-center gap-2 px-16 max-w-[1200px]">
            <Link to="/offers" className="flex items-center gap-2 border px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">
              Your Offers
            </Link>
            <Link to="/settings" className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50 mr-2">
              <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" />
            </Link>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50">
              <img src="/icons/account-icon.svg" alt="Account" className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Offers Content */}
        <div className="flex-1 bg-white py-12 px-4 ml-12">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-[24px] font-bold mb-10 italic">Your Offers</h1>
            {Object.entries(offersByCategory).map(([category, offers]) => (
              <div key={category} className="mb-10">
                <h2 className="text-[18px] font-medium mb-4">{category}</h2>
                <div className="relative w-full">
                  <div className="overflow-x-auto pb-4 scrollbar-hide w-full">
                    <div className="flex gap-4 min-w-fit">
                      {offers.map((offer, idx) => (
                        <div
                          key={offer.type + idx}
                          className="w-[200px] h-[140px] rounded-[10px] flex flex-col items-start justify-between px-8 pt-6 pb-6 bg-white border border-gray-300 shadow-sm transition cursor-pointer flex-shrink-0"
                          onClick={() => setExpandedOffer({ ...offer, category })}
                        >
                          <div className="font-bold text-base">{offer.type}</div>
                          <div className="font-normal text-[12px] mt-2">{offer.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {expandedOffer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-[400px] w-full relative animate-fade-in flex flex-col items-center" style={{ minHeight: '380px' }}>
                  <div className="flex items-center w-full mb-6">
                    <div className="text-[22px] font-bold text-left flex-1">{expandedOffer.type}</div>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-2xl font-bold text-gray-500"
                      onClick={() => setExpandedOffer(null)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-8">
                    <div className="text-[16px] font-medium mb-2 text-center text-gray-500">{expandedOffer.category}</div>
                    <div className="text-[15px] text-gray-700 text-center mt-4 mb-4">{expandedOffer.details}</div>
                  </div>
                  <button className="mt-auto bg-black text-white rounded-[10px] px-8 py-3 text-base font-semibold shadow hover:bg-gray-800 transition">Explore</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
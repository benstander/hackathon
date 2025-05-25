import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { ChatInterface } from '../components/ChatInterface';

function getSavedHistory() {
  const saved = localStorage.getItem('chatHistory');
  return saved ? JSON.parse(saved) : [];
}

function Home() {
  const [showChat, setShowChat] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');
  const [chatHistory, setChatHistory] = useState(getSavedHistory());
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load chat history on mount and set up storage listener
  useEffect(() => {
    // Initial load
    setChatHistory(getSavedHistory());

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      setChatHistory(getSavedHistory());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInitialSend = (e) => {
    e.preventDefault();
    if (initialQuery.trim() === '') return;
    navigate('/chat', { state: { initialMessage: initialQuery } });
  };

  const handlePlusClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const offers = [
    { type: "NRMA", details: "Get 20% off your first year of car insurance" },
    { type: "Alinta Energy", details: "Switch & save up to $300 annually" },
    { type: "Stake", details: "Start investing with as little as $100" },
    { type: "Commbank", details: "0% interest on balance transfers for 24 months" },
    { type: "CommBank", details: "5% interest rate on our premium savings account" },
    { type: "Stake", details: "Start investing with as little as £100" },
    { type: "Home Insurance", details: "Comprehensive coverage with 24/7 support" },
    { type: "Life Insurance", details: "Protect your loved ones with flexible plans" },
    { type: "Travel Insurance", details: "Worldwide coverage with medical protection" },
    { type: "Pet Insurance", details: "Cover your furry friends with our pet care plans" }
  ];

  // Helper to get category by offer type
  const getCategory = (type) => {
    if (["NRMA", "Home Insurance", "Life Insurance", "Travel Insurance", "Pet Insurance", "AAMI"].some(t => type.includes(t))) return "Insurance";
    if (["Commbank", "CommBank", "ANZ", "Westpac", "NAB", "ING", "Macquarie", "UBank", "Bendigo Bank"].some(t => type.includes(t))) return "Banking";
    if (["Stake", "Raiz", "Spaceship", "Vanguard", "Bell Direct"].some(t => type.includes(t))) return "Investing";
    if (["Alinta Energy", "Origin Energy", "AGL", "Energy Australia", "Powershop", "Red Energy", "Dodo", "Tango Energy"].some(t => type.includes(t))) return "Energy";
    return null;
  };

  const getBg = (category) => {
    switch (category) {
      case "Insurance": return "/images/spending-bg.png";
      case "Investing": return "/images/budget-bg.png";
      case "Energy": return "/images/income-bg.png";
      case "Banking": return "/images/savings-bg.png";
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar chatHistory={chatHistory} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[260px]'}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-16">
          <div className="text-[24px] font-medium">onTrack</div>
          <div className="flex items-center gap-2">
            <Link to="/offers" className="flex items-center gap-2 border px-8 py-3 rounded-full text-black text-sm font-medium hover:bg-gray-100 shadow-sm border border-gray-300 border border-gray-300">
              Your Offers
            </Link>
            <Link to="/settings" className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50 shadow-sm border border-gray-300 mr-2 hover:bg-gray-100">
              <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" />
            </Link>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50 border border-gray-300 hover:bg-gray-100 shadow-sm">
              <img src="/icons/account-icon.svg" alt="Account" className="w-6 h-6" />
            </div>
          </div>
        </div>

        {!showChat ? (
          // Initial Search Interface
          <div className="flex flex-col items-center justify-center flex-1 mt-24">
            <div className="mt-8 mb-8">
              <h2 className="text-[32px] italic font-bold text-center mb-8 text-black ">What do you want to know?</h2>
              <div className="w-[720px] max-w-full mx-auto">
                <form onSubmit={handleInitialSend} className="relative bg-white border border-gray-300 rounded-[20px] shadow-md h-48 flex flex-col justify-between">
                  <input
                    className="absolute top-8 left-8 bg-transparent outline-none border-none text-gray-600 text-[22px] w-2/3"
                    placeholder="Ask anything ...."
                    value={initialQuery}
                    onChange={e => setInitialQuery(e.target.value)}
                  />
                  <div className="flex items-center justify-between px-8 pb-4 w-full absolute left-0 bottom-0">
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label="Add" className="focus:outline-none rounded-[10px] p-4 hover:bg-gray-100 transition" onClick={handlePlusClick}>
                        <img src="/icons/plus-icon.svg" alt="Plus" className="w-5 h-5" />
                      </button>
                      {selectedFile && (
                        <span className="text-gray-600 text-sm truncate max-w-[160px]">{selectedFile.name}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button 
                      type="submit"
                      aria-label="Send" 
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-black hover:bg-gray-800 transition focus:outline-none shadow-sm"
                    >
                      <img src="/icons/send-icon.svg" alt="Send" className="w-5 h-5 text-black invert" />
                    </button>
                  </div>
                </form>
              </div>
              {/* Pre-prepared prompt blocks - now in a max-width container */}
              <div className="w-full max-w-[1200px] mx-auto flex flex-row flex-wrap gap-4 mt-12 justify-center">
                {[
                  { type: "Spending", prompt: "What did i spend on food this week?" },
                  { type: "Budgeting", prompt: "How can I improve my monthly budget?" },
                  { type: "Tax", prompt: "How can i save money on tax?" },
                  { type: "Savings", prompt: "How much should I save each month?" },
                ].map(p => (
                  <button
                    key={p.type + p.prompt}
                    type="button"
                    className="w-[200px] h-[140px] rounded-[10px] flex flex-col items-start justify-between px-8 pt-6 pb-6 bg-white border border-gray-300 shadow-md transition text-left relative text-black"
                    onClick={() => navigate('/chat', { state: { initialMessage: p.prompt } })}
                  >
                    <div className="font-bold text-base">{p.type}</div>
                    <div className="font-normal text-sm mt-2">{p.prompt}</div>
                  </button>
                ))}
              </div>

              {/* Offers section */}
              <div className="w-full max-w-[1200px] mx-auto mt-20 mb-16">
                <div className="w-[870px] mx-auto flex justify-between items-center mb-6">
                  <h2 className="text-[22px] font-medium ml-4">Popular Offers</h2>
                  <Link to="/offers" className="text-black font-medium hover:bg-gray-200 px-4 py-2 rounded-[10px] transition mr-2">Show All</Link>
                </div>
                <div className="relative">
                  <div className={`overflow-hidden pb-4 transition-all duration-300 ${showAllOffers ? '' : 'w-[872px]'}`}> {/* 4*200px + 3*16px gap */}
                    <div className="flex gap-4 min-w-max ml-4">
                      {(showAllOffers ? offers : offers.slice(0, 4)).map(offer => (
                        <div
                          key={offer.type}
                          className="w-[200px] h-[140px] rounded-[10px] flex flex-col items-start justify-between px-8 pt-6 pb-6 bg-white border border-gray-300 shadow-md transition cursor-pointer"
                        >
                          <div className="font-bold text-base">{offer.type}</div>
                          <div className="font-normal text-[12px] mt-2">{offer.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="flex-1 bg-white border-t border-gray-200">
            <ChatInterface initialMessage={initialQuery} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Home; 
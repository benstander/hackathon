import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar chatHistory={chatHistory} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-16">
          <div className="text-[24px] font-medium">onTrack</div>
          <div className="flex items-center gap-2">
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

        {!showChat ? (
          // Initial Search Interface
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="mt-8 mb-8">
              <h2 className="text-[32px] italic font-regular text-center mb-8">What do you want to know?</h2>
              <div className="w-[720px] max-w-full mx-auto">
                <form onSubmit={handleInitialSend} className="relative bg-white border border-gray-300 rounded-[10px] shadow-sm h-48 flex flex-col justify-between">
                  <input
                    className="absolute top-8 left-8 bg-transparent outline-none border-none text-gray-600 text-[16px] w-2/3"
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
                      className="w-12 h-12 flex items-center justify-center rounded-xl border-gray-300 border bg-gray-100 hover:bg-gray-200 transition focus:outline-none"
                    >
                      <img src="/icons/send-icon.svg" alt="Send" className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </form>
              </div>
              {/* Pre-prepared prompt blocks - now in a max-width container */}
              <div className="w-full max-w-[1200px] mx-auto flex flex-row flex-wrap gap-4 mt-12 justify-center">
                {[
                  { type: "Spending", prompt: "What did i spend on food this week?", bg: "/images/spending-bg.png" },
                  { type: "Budgeting", prompt: "How can I improve my monthly budget?", bg: "/images/budget-bg.png" },
                  { type: "Tax", prompt: "How can i save money on tax?", bg: "/images/spending-bg.png" },
                  { type: "Savings", prompt: "How much should I save each month?", bg: "/images/budget-bg.png" },
                ].map(p => (
                  <button
                    key={p.type + p.prompt}
                    type="button"
                    className={`w-[200px] h-[140px] rounded-[10px] flex flex-col items-start justify-between px-8 pt-6 pb-6 hover:bg-gray-300 transition text-left relative ${p.bg ? "text-white" : "bg-gray-200"}`}
                    style={p.bg ? {
                      backgroundImage: `url(${p.bg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : {}}
                    onClick={() => navigate('/chat', { state: { initialMessage: p.prompt } })}
                  >
                    {p.bg && (
                      <div className="absolute inset-0 bg-gray-500/20 rounded-[10px] pointer-events-none" />
                    )}
                    <div className={`font-bold text-base z-10 relative${p.bg ? ' drop-shadow-md' : ''}`}>{p.type}</div>
                    <div className="font-normal text-sm mt-2 z-10 relative">{p.prompt}</div>
                  </button>
                ))}
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
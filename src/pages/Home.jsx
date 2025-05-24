import React, { useState, useEffect } from 'react';
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar chatHistory={chatHistory} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-12">
          <div className="text-[22px] font-regular">Hello, Ben</div>
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

        {!showChat ? (
          // Initial Search Interface
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="mt-8 mb-8">
              <h2 className="text-[28px] font-regular text-center mb-8">What do you want to know?</h2>
              <div className="w-[720px] max-w-full mx-auto">
                <form onSubmit={handleInitialSend} className="relative bg-white border border-gray-300 rounded-2xl shadow-sm h-48 flex flex-col justify-between">
                  <input
                    className="absolute top-8 left-8 bg-transparent outline-none border-none text-gray-400 text-[18px] w-2/3"
                    placeholder="Ask anything ...."
                    value={initialQuery}
                    onChange={e => setInitialQuery(e.target.value)}
                  />
                  <div className="flex items-center justify-between px-8 pb-4 w-full absolute left-0 bottom-0">
                    <button type="button" aria-label="Add" className="focus:outline-none">
                      <img src="/icons/plus-icon.svg" alt="Plus" className="w-5 h-5" />
                    </button>
                    <button 
                      type="submit"
                      aria-label="Send" 
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition focus:outline-none"
                    >
                      <img src="/icons/send-icon.svg" alt="Send" className="w-5 h-5" />
                    </button>
                  </div>
                </form>
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
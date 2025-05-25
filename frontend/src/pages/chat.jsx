import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { ChatInterface } from '../components/ChatInterface';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useFinancial } from '../context/FinancialContext';

function useInitialMessage() {
  const location = useLocation();
  return location.state?.initialMessage || '';
}

function getSavedHistory() {
  const saved = localStorage.getItem('chatHistory');
  return saved ? JSON.parse(saved) : [];
}

export default function ChatPage() {
  const initialMessage = useInitialMessage();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState(getSavedHistory());
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useFinancial();

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

  // Handle initial message and chat history
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      const newMessage = { text: initialMessage, isUser: true };
      setMessages([newMessage]);
      setChatInput('');
      setIsLoading(true);

      console.log("HELLO")
      // Call the AI API for the initial message
      const fetchAIResponse = async () => {
        try {
          console.log("USER DATA", userData)
          console.log("INITIAL MESSAGE", initialMessage)

          
          const response = await api.askAI(userData?.id, initialMessage);
          setMessages(prev => [
            ...prev,
            { text: response.response, isUser: false }
          ]);
        } catch (error) {
          setMessages(prev => [
            ...prev,
            { text: "Sorry, I encountered an error.", isUser: false }
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAIResponse();
    }
  }, [initialMessage, userData, messages.length]);

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;

    // Prevent duplicate initial message
    if (
      initialMessage &&
      chatInput.trim() === initialMessage &&
      messages.some(m => m.text === initialMessage && m.isUser)
    ) {
      setChatInput('');
      return;
    }

    const userMessage = { text: chatInput.trim(), isUser: true };

    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      console.log(chatInput)
      console.log(userData)
      const response = await api.askAI(userData?.id, chatInput.trim());
      setMessages(prev => [...prev, { text: response.response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Rendering ChatPage with messages:", messages);

  if (!Array.isArray(messages)) {
    console.error("Messages is not an array:", messages);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar chatHistory={chatHistory} />
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-16">
          <Link to="/home" className="text-[24px] font-medium">onTrack</Link>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">
              + Account
            </button>
            <a href="/settings" className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50 mr-2">
              <img src="/icons/settings-icon.svg" alt="Settings" className="w-6 h-6" />
            </a>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-grey-50">
              <img src="/icons/account-icon.svg" alt="Account" className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 flex flex-col justify-between">
          <div className="flex-1">
            <ChatInterface messages={messages} isLoading={isLoading} />
          </div>
          {/* Search Bar at Bottom */}
          <div className="w-full flex justify-center items-end pb-8 bg-grey-50">
            <form onSubmit={handleChatSend} className="relative bg-white border border-gray-300 rounded-2xl shadow-sm h-36 flex flex-col justify-between w-[720px] max-w-full mx-auto">
              <input
                className="absolute top-6 left-8 bg-transparent outline-none border-none text-gray-600 text-[16px] w-2/3"
                placeholder="Ask anything ...."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <div className="flex items-center justify-between px-8 pb-4 w-full absolute left-0 bottom-0">
                <button type="button" aria-label="Add" className="focus:outline-none">
                  <img src="/icons/plus-icon.svg" alt="Plus" className="w-5 h-5" />
                </button>
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
        </div>
      </main>
    </div>
  );
} 
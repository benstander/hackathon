import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ChatInterface } from '../components/ChatInterface';

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
    if (initialMessage) {
      const newMessage = { text: initialMessage, isUser: true };
      setMessages([newMessage]);
      setChatInput('');
      
      // Update chat history
      setChatHistory(prev => {
        const filtered = prev.filter(chat => chat.firstMessage !== initialMessage);
        const updated = [
          { firstMessage: initialMessage, timestamp: new Date().toISOString() },
          ...filtered
        ].slice(0, 5);
        localStorage.setItem('chatHistory', JSON.stringify(updated));
        return updated;
      });

      // Add AI response after a short delay
      const timeout = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            text: "This is a simulated response from the AI. Replace this with actual ChatGPT integration.",
            isUser: false
          }
        ]);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [initialMessage]);

  const handleChatSend = (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;

    const userMessage = { text: chatInput.trim(), isUser: true };
    
    // If this is the first message in a new chat, treat as new chat thread
    if (messages.length === 0) {
      setChatHistory(prev => {
        const filtered = prev.filter(chat => chat.firstMessage !== chatInput.trim());
        const updated = [
          { firstMessage: chatInput.trim(), timestamp: new Date().toISOString() },
          ...filtered
        ].slice(0, 5);
        localStorage.setItem('chatHistory', JSON.stringify(updated));
        return updated;
      });
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "This is a simulated response from the AI. Replace this with actual ChatGPT integration.",
        isUser: false
      }]);
    }, 1000);
  };

  console.log("Rendering ChatPage with messages:", messages);

  if (!Array.isArray(messages)) {
    console.error("Messages is not an array:", messages);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar chatHistory={chatHistory} />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 bg-white border-t border-gray-200 flex flex-col justify-between">
          <div className="flex-1">
            <ChatInterface messages={messages} />
          </div>
          {/* Search Bar at Bottom */}
          <div className="w-full flex justify-center items-end pb-8 bg-white">
            <form onSubmit={handleChatSend} className="relative bg-white border border-gray-300 rounded-2xl shadow-sm h-48 flex flex-col justify-between w-[720px] max-w-full mx-auto">
              <input
                className="absolute top-8 left-8 bg-transparent outline-none border-none text-gray-400 text-[18px] w-2/3"
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
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition focus:outline-none"
                >
                  <img src="/icons/send-icon.svg" alt="Send" className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 
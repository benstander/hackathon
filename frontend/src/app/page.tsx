'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChatInterface } from '../components/ChatInterface'
import { api } from '../services/api'
import { useFinancial } from '../context/FinancialContext'
import { useAuth } from '../context/AuthContext'

interface Message {
  text: string
  isUser: boolean
}

function getSavedHistory() {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('chatHistory')
  return saved ? JSON.parse(saved) : []
}

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')
  const [chatHistory, setChatHistory] = useState(getSavedHistory())
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { userData } = useFinancial()
  const { user, loading } = useAuth()

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Load chat history on mount and set up storage listener
  useEffect(() => {
    // Initial load
    setChatHistory(getSavedHistory())

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      setChatHistory(getSavedHistory())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Show loading while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Helper function to get user ID (use authenticated user's ID or fallback)
  const getUserId = () => {
    return user?.id || userData?.id || 'fb919047-167b-4b33-9cfc-ab963c780166'
  }

  const handleInitialSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (initialQuery.trim() === '') return
    setShowChat(true)
    setMessages([{ text: initialQuery, isUser: true }])
    setIsLoading(true)
    
    try {
      const response = await api.askAI(getUserId(), initialQuery.trim())
      setMessages(prev => [...prev, { text: response.response, isUser: false }])
    } catch (error) {
      console.error('AI Response Error:', error)
      setMessages(prev => [...prev, { text: `Error: ${error instanceof Error ? error.message : 'Sorry, I encountered an error.'}`, isUser: false }])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handlePromptClick = async (prompt: string) => {
    setShowChat(true)
    setMessages([{ text: prompt, isUser: true }])
    setIsLoading(true)
    
    try {
      const response = await api.askAI(getUserId(), prompt)
      setMessages(prev => [...prev, { text: response.response, isUser: false }])
    } catch (error) {
      console.error('AI Response Error:', error)
      setMessages(prev => [...prev, { text: `Error: ${error instanceof Error ? error.message : 'Sorry, I encountered an error.'}`, isUser: false }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {!showChat ? (
        // Initial Search Interface
        <div className="flex flex-col items-center justify-center flex-1 pt-24">
          <div className="mt-8 mb-8">
            <h2 className="text-[32px] italic font-medium text-center mb-8 text-black">What do you want to know?</h2>
            <div className="w-[720px] max-w-full mx-auto">
              <form onSubmit={handleInitialSend} className="relative bg-white border border-gray-300 rounded-[20px] shadow-md h-48 flex flex-col justify-between">
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
                  onClick={() => handlePromptClick(p.prompt)}
                >
                  <div className="font-bold text-base">{p.type}</div>
                  <div className="font-normal text-sm mt-2">{p.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Chat Interface
        <div className="flex-1 bg-white">
          <ChatInterface messages={messages} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
} 
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Sidebar from '../../components/sidebar'
import { ChatInterface } from '../../components/ChatInterface'
import { api } from '../../services/api'
import { useFinancial } from '../../context/FinancialContext'

interface Message {
  text: string
  isUser: boolean
}

function getSavedHistory() {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('chatHistory')
  return saved ? JSON.parse(saved) : []
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialMessage = searchParams.get('message') || ''
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chatHistory, setChatHistory] = useState(getSavedHistory())
  const [isLoading, setIsLoading] = useState(false)
  const { userData } = useFinancial()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false)

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

  // Handle initial message and chat history
  useEffect(() => {
    if (initialMessage && messages.length === 0 && !hasProcessedInitialMessage) {
      setHasProcessedInitialMessage(true)
      const newMessage = { text: initialMessage, isUser: true }
      setMessages([newMessage])
      setChatInput('')
      setIsLoading(true)

      // Call the AI API for the initial message
      const fetchAIResponse = async () => {
        try {
          const response = await api.askAI('fb919047-167b-4b33-9cfc-ab963c780166', initialMessage)
          setMessages(prev => [
            ...prev,
            { text: response.response, isUser: false }
          ])
        } catch (error) {
          console.error('AI Response Error:', error)
          setMessages(prev => [
            ...prev,
            { text: `Error: ${error instanceof Error ? error.message : 'Sorry, I encountered an error.'}`, isUser: false }
          ])
        } finally {
          setIsLoading(false)
        }
      }

      fetchAIResponse()
    }
  }, [initialMessage, messages.length, hasProcessedInitialMessage])

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim() === '') return

    // Prevent duplicate initial message
    if (
      initialMessage &&
      chatInput.trim() === initialMessage &&
      messages.some(m => m.text === initialMessage && m.isUser)
    ) {
      setChatInput('')
      return
    }

    const userMessage = { text: chatInput.trim(), isUser: true }

    setMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      const response = await api.askAI(userData?.id || 'fb919047-167b-4b33-9cfc-ab963c780166', chatInput.trim())
      setMessages(prev => [...prev, { text: response.response, isUser: false }])
    } catch (error) {
      console.error('AI Response Error:', error)
      setMessages(prev => [...prev, { text: `Error: ${error instanceof Error ? error.message : 'Sorry, I encountered an error.'}`, isUser: false }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSend(e as any)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar chatHistory={chatHistory} />
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[260px]'}`}>
        <div className="flex-1 bg-white flex flex-col justify-between">
          <div className="flex-1 w-full overflow-y-auto">
            <ChatInterface messages={messages} isLoading={isLoading} />
          </div>

          {/* Chat Input at Bottom */}
          <div className="border-t border-gray-100 bg-white p-6">
            <form onSubmit={handleChatSend} className="max-w-4xl mx-auto">
              <div className="relative bg-gray-50 border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                <textarea
                  className="w-full bg-transparent outline-none border-none text-gray-800 text-[16px] p-4 pr-16 resize-none min-h-[60px] max-h-32"
                  placeholder="Ask me anything about your finances..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  style={{ minHeight: '60px' }}
                />
                <div className="absolute right-3 bottom-3">
                  <button 
                    type="submit"
                    disabled={isLoading || chatInput.trim() === ''}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Enter to send, Shift+Enter for new line
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 
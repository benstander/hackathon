'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

interface Chat {
  timestamp: string
  firstMessage: string
}

interface SidebarProps {
  chatHistory?: Chat[]
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

function groupChatsByDate(chatHistory: Chat[]) {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)

  const groups: { [key: string]: Chat[] } = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  }

  chatHistory.forEach(chat => {
    const chatDate = new Date(chat.timestamp)
    if (
      chatDate.getDate() === today.getDate() &&
      chatDate.getMonth() === today.getMonth() &&
      chatDate.getFullYear() === today.getFullYear()
    ) {
      groups.Today.push(chat)
    } else if (
      chatDate.getDate() === yesterday.getDate() &&
      chatDate.getMonth() === yesterday.getMonth() &&
      chatDate.getFullYear() === yesterday.getFullYear()
    ) {
      groups.Yesterday.push(chat)
    } else if (chatDate > sevenDaysAgo) {
      groups['Previous 7 Days'].push(chat)
    } else {
      groups.Older.push(chat)
    }
  })
  return groups
}

export default function Sidebar({ chatHistory = [], collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, signOut } = useAuth()
  const grouped = groupChatsByDate(chatHistory)
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older']
  const activeInitialMessage = pathname === '/chat' && searchParams.get('message')

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (collapsed) {
    return (
      <div className="fixed top-0 left-0 z-50 flex items-center h-20 px-8 bg-white gap-4">
        <button onClick={() => setCollapsed(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
          <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
        </button>
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100 transition" aria-label="New Chat">
          <img src="/icons/newChat.svg" alt="New Chat" className="w-7 h-7" />
        </Link>
        <Link href="/" className="text-[24px] font-medium ml-4">onTrack</Link>
      </div>
    )
  }

  return (
    <aside className="fixed top-0 left-0 w-[260px] flex flex-col h-screen border-r border-gray-200 bg-white py-0 pr-4">
      {/* Top: App Icon and New Chat Icon */}
      <div className="flex items-center justify-between h-20 px-8 bg-white">
        <button onClick={() => setCollapsed(true)} className="p-1 rounded-full hover:bg-gray-100 transition">
          <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
        </button>
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100 transition" aria-label="New Chat">
          <img src="/icons/newChat.svg" alt="New Chat" className="w-7 h-7" />
        </Link>
      </div>
      
      {/* Previous Chats */}
      <div className="flex-1 overflow-y-auto pl-6 bg-white">
        {groupOrder.map(
          group =>
            grouped[group] && grouped[group].length > 0 && (
              <div key={group} className="mb-6">
                <div className="uppercase text-xs text-gray-400 font-semibold px-4 mb-2 tracking-wider">{group}</div>
                <ul className="flex flex-col gap-2 px-2">
                  {grouped[group].map((chat, index) => {
                    const isActive = chat.firstMessage === activeInitialMessage
                    return (
                      <li key={index}>
                        <Link
                          href={`/chat?message=${encodeURIComponent(chat.firstMessage)}`}
                          className={`block p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 ${isActive ? 'bg-gray-200' : ''}`}
                        >
                          <div className="text-sm font-medium truncate">{chat.firstMessage}</div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
        )}
        {chatHistory.length === 0 && (
          <div className="text-gray-400 text-sm italic px-4 mt-8">No previous chats</div>
        )}
      </div>

      {/* Bottom: User Info and Logout */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || 'User'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
} 
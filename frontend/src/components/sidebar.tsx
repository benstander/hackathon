'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import ProfileDropdown from './ProfileDropdown'

interface Chat {
  timestamp: string
  firstMessage: string
}

interface SidebarProps {
  chatHistory?: Chat[]
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

const ICON_SIZE = 28

export default function Sidebar({ chatHistory = [] }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const router = useRouter()
  const grouped = groupChatsByDate(chatHistory)
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older']
  const activeInitialMessage = pathname === '/chat' && searchParams.get('message')

  return (
    <aside
      className={`fixed top-0 left-0 h-screen border-r border-gray-200 bg-white py-0 z-30 flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-[260px]'}`}
    >
      {/* Top: Kapital and Collapse Icon (always render button, only conditionally render text) */}
      <div className={`flex items-center pt-6 pb-4 border-b border-gray-100 ${collapsed ? 'justify-center' : 'justify-between px-4'}`}>
        {!collapsed && (
          <button
            className="text-lg font-bold text-primary hover:underline focus:underline bg-transparent border-none outline-none cursor-pointer"
            onClick={() => router.replace('/')}
            type="button"
          >
            Kapital
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Image src="/icons/sidebar-icon.svg" alt="Toggle sidebar" width={ICON_SIZE} height={ICON_SIZE} />
        </button>
      </div>

      {/* Home button below logo, icon left, text right */}
      <button
        onClick={() => router.replace('/')}
        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition w-11/12 mx-auto mt-2 ${collapsed ? 'justify-center' : ''}`}
        title="Home"
        type="button"
      >
        <span className="min-w-[28px] min-h-[28px] flex items-center justify-center">
          <Image src="/icons/home-icon.svg" alt="Home" width={ICON_SIZE} height={ICON_SIZE} />
        </span>
        {!collapsed && <span className="text-sm font-medium text-gray-700">Home</span>}
      </button>

      {/* Middle: Previous Chats */}
      <div className={`flex-1 overflow-y-auto bg-white ${collapsed ? 'pl-0' : 'pl-6'}`}>
        {!collapsed && groupOrder.map(
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
      </div>

      {/* Bottom: Offers, Settings, Profile (vertically stacked) */}
      <div className={`border-t border-gray-200 p-4 bg-white flex flex-col gap-2 ${collapsed ? 'items-center' : ''}`}>
        <Link
          href="/offers"
          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition w-full ${collapsed ? 'justify-center' : ''}`}
          title="Offers"
        >
          <span className="min-w-[28px] min-h-[28px] flex items-center justify-center">
            <Image src="/icons/portfolio-icon.svg" alt="Offers" width={ICON_SIZE} height={ICON_SIZE} />
          </span>
          {!collapsed && <span className="text-sm font-medium text-gray-700">Offers</span>}
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition w-full ${collapsed ? 'justify-center' : ''}`}
          title="Settings"
        >
          <span className="min-w-[28px] min-h-[28px] flex items-center justify-center">
            <Image src="/icons/settings-icon.svg" alt="Settings" width={ICON_SIZE} height={ICON_SIZE} />
          </span>
          {!collapsed && <span className="text-sm font-medium text-gray-700">Settings</span>}
        </Link>
        {/* Profile button with icon and text, triggers dropdown */}
        <div>
          <ProfileDropdown>
            <button
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition w-full ${collapsed ? 'justify-center' : ''}`}
              type="button"
            >
              <span className="min-w-[28px] min-h-[28px] flex items-center justify-center">
                <Image src="/icons/account-icon.svg" alt="Profile" width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              {!collapsed && <span className="text-sm font-medium text-gray-700">Profile</span>}
            </button>
          </ProfileDropdown>
        </div>
      </div>
    </aside>
  )
} 
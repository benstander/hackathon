'use client'

import React, { useEffect, useRef } from 'react'

interface Message {
  text: string
  isUser: boolean
}

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-16 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[65%] rounded-full px-8 py-4 ${
                message.isUser
                  ? 'bg-black text-gray-50'
                  : ''
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-full px-8 py-4">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 
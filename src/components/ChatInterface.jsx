import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

export function ChatInterface({ messages = [] }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-16 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text || ''}
            isUser={message.isUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 
// src/app/messages/_components/MessagesContainer.tsx
"use client";

import React from "react";
import MessageBubble from "./MessageBubble";

interface MessagesContainerProps {
  messages: any[];
  user: any;
  isAdminMessage: (msg: any) => boolean;
  getMessageStatus: (msg: any) => React.ReactElement | null;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
}

export default function MessagesContainer({
  messages,
  user,
  isAdminMessage,
  getMessageStatus,
  messagesContainerRef,
  messagesEndRef,
  onScroll,
}: MessagesContainerProps) {
  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-sm">No messages yet</p>
          <p className="text-xs text-gray-400 mt-1">Send a message to start the conversation</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isOwnMessage = msg.senderId === user.id;
          const isAdmin = isAdminMessage(msg);

          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOwnMessage={isOwnMessage}
              isAdmin={isAdmin}
              getMessageStatus={getMessageStatus}
            />
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
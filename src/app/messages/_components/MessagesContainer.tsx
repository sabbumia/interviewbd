// src/app/messages/_components/MessagesContainer.tsx
"use client";

import React from "react";
import { MessageCircleDashed } from "lucide-react";
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
      className="flex-1 overflow-y-auto scrollbar-slim px-4 sm:px-6 py-5 space-y-3"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200 shadow-soft flex items-center justify-center mb-4">
            <MessageCircleDashed className="w-7 h-7 text-brand-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-semibold text-zinc-500">No messages yet</p>
          <p className="text-xs text-zinc-400 mt-1">Send a message to start the conversation</p>
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

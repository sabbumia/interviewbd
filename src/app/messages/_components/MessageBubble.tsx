// src/app/messages/_components/MessageBubble.tsx
"use client";

import React from "react";
import { timeAgo } from "@/lib/timeAgo";

interface MessageBubbleProps {
  msg: any;
  isOwnMessage: boolean;
  isAdmin: boolean;
  getMessageStatus: (msg: any) => React.ReactElement | null;
}

export default function MessageBubble({
  msg,
  isOwnMessage,
  isAdmin,
  getMessageStatus,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? "text-right" : "text-left"}`}>
        {isAdmin && !isOwnMessage && (
          <div className="flex items-center gap-1 mb-1 ml-1">
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium">
              Admin Message
            </span>
          </div>
        )}
        <div
          className={`inline-block px-4 py-2.5 rounded-2xl ${
            isOwnMessage
              ? "bg-blue-600 text-white rounded-br-md"
              : isAdmin
              ? "bg-red-50 text-gray-900 border border-red-100 rounded-bl-md"
              : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {msg.content}
          </p>
          <div className="flex items-center gap-1.5 justify-end mt-1.5">
            <p
              className={`text-xs ${
                isOwnMessage
                  ? "text-blue-100"
                  : isAdmin
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {timeAgo(msg.createdAt)}
            </p>
            {isOwnMessage && getMessageStatus(msg)}
          </div>
        </div>
      </div>
    </div>
  );
}
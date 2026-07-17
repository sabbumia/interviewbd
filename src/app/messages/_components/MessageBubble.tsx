// src/app/messages/_components/MessageBubble.tsx
"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
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
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[80%] sm:max-w-[70%] ${isOwnMessage ? "text-right" : "text-left"}`}>
        {isAdmin && !isOwnMessage && (
          <span className="chip-rose mb-1 ml-1">
            <ShieldCheck className="w-3 h-3" />
            Admin Message
          </span>
        )}
        <div
          className={`inline-block px-4 py-2.5 text-left shadow-soft ${
            isOwnMessage
              ? "bg-linear-to-br from-brand-600 to-purple-600 text-white rounded-2xl rounded-br-md"
              : isAdmin
              ? "bg-rose-50 text-ink border border-rose-100 rounded-2xl rounded-bl-md"
              : "bg-white text-ink border border-zinc-200/80 rounded-2xl rounded-bl-md"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <time
              className={`text-[10px] font-medium ${
                isOwnMessage ? "text-white/70" : isAdmin ? "text-rose-400" : "text-zinc-400"
              }`}
            >
              {timeAgo(msg.createdAt)}
            </time>
            {isOwnMessage && getMessageStatus(msg)}
          </div>
        </div>
      </div>
    </div>
  );
}

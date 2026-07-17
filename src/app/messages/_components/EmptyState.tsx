// src/app/messages/_components/EmptyState.tsx
"use client";

import { MessagesSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="relative mb-5">
        <div aria-hidden className="absolute inset-0 rounded-3xl bg-brand-200/50 blur-xl" />
        <div className="relative w-18 h-18 rounded-3xl bg-white border border-brand-100 shadow-soft flex items-center justify-center">
          <MessagesSquare className="w-8 h-8 text-brand-400" strokeWidth={1.75} />
        </div>
      </div>
      <p className="font-display font-bold text-ink mb-1">Select a conversation</p>
      <p className="text-sm text-zinc-400">Choose a connection to start messaging</p>
    </div>
  );
}

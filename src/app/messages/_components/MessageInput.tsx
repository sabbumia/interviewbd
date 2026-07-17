// src/app/messages/_components/MessageInput.tsx
"use client";

import { Loader2, Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MessageInput({
  newMessage,
  setNewMessage,
  sending,
  onSubmit,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit} className="px-4 sm:px-6 py-4 border-t border-zinc-200/80 bg-white">
      <div className="flex items-end gap-2.5">
        <div
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl transition-all duration-200
            focus-within:bg-white focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10"
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            aria-label="Message"
            rows={1}
            className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-sm max-h-32 min-h-11"
          />
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          aria-label="Send message"
          className="w-11 h-11 rounded-2xl bg-linear-to-br from-brand-600 to-purple-600 text-white flex items-center justify-center shrink-0
            shadow-glow transition-all duration-300
            hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5 -ml-0.5" />
          )}
        </button>
      </div>
      <p className="text-[11px] text-zinc-400 mt-2 ml-1 hidden sm:block">
        Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-sans text-[10px]">Enter</kbd> to send,{" "}
        <kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-sans text-[10px]">Shift + Enter</kbd> for new line
      </p>
    </form>
  );
}

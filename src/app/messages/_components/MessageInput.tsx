// src/app/messages/_components/MessageInput.tsx
"use client";

import { Send } from "lucide-react";

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
    <form onSubmit={onSubmit} className="px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-3">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-sm max-h-32"
            style={{ minHeight: "44px" }}
          />
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm hover:shadow disabled:shadow-none"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 ml-1">Press Enter to send, Shift + Enter for new line</p>
    </form>
  );
}
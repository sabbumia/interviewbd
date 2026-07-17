// src/app/messages/_components/ChatHeader.tsx
"use client";

import { ArrowLeft, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/Avatar";

interface ChatHeaderProps {
  selectedUser: any;
  isUserOnline: (userId: string) => boolean;
  getLastSeenText: (userId: string) => string;
  onBack?: () => void;
}

export default function ChatHeader({
  selectedUser,
  isUserOnline,
  getLastSeenText,
  onBack,
}: ChatHeaderProps) {
  const online = isUserOnline(selectedUser.id);

  return (
    <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to conversations"
            className="md:hidden p-2 -ml-1 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <Link href={`/users/${selectedUser.id}`} className="relative shrink-0 hover:opacity-90 transition-opacity">
          <Avatar src={selectedUser.profilePicture} name={selectedUser.name} size={42} />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              online ? "bg-emerald-500" : "bg-zinc-300"
            }`}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/users/${selectedUser.id}`}
              className="font-display font-bold text-ink truncate hover:text-brand-700 transition-colors"
            >
              {selectedUser.name}
            </Link>
            {selectedUser.isVerified && (
              <BadgeCheck className="w-4 h-4 text-brand-600 fill-brand-100 shrink-0" aria-label="Verified" />
            )}
            {selectedUser.role === "admin" && (
              <span className="chip-rose px-2 py-0 text-[10px]">Admin</span>
            )}
          </div>
          <p className={`text-xs ${online ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
            {online && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse-soft align-middle" />
            )}
            {getLastSeenText(selectedUser.id)}
          </p>
        </div>
      </div>
    </div>
  );
}

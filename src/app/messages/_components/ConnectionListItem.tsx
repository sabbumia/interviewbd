// src/app/messages/_components/ConnectionListItem.tsx
"use client";

import { BadgeCheck } from "lucide-react";
import Avatar from "@/components/Avatar";

interface ConnectionListItemProps {
  otherUser: any;
  unreadCount: number;
  online: boolean;
  isSelected: boolean;
  onSelect: () => void;
  getLastSeenText: (userId: string) => string;
}

export default function ConnectionListItem({
  otherUser,
  unreadCount,
  online,
  isSelected,
  onSelect,
  getLastSeenText,
}: ConnectionListItemProps) {
  return (
    <button
      onClick={onSelect}
      aria-current={isSelected ? "true" : undefined}
      className={`w-full p-3 rounded-2xl flex items-start gap-3 text-left transition-all duration-200 ${
        isSelected
          ? "bg-brand-50 border border-brand-100"
          : "border border-transparent hover:bg-zinc-50"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar src={otherUser.profilePicture} name={otherUser.name} size={46} />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? "bg-emerald-500" : "bg-zinc-300"
          }`}
          title={online ? "Online" : "Offline"}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-sm font-bold truncate ${
                isSelected ? "text-brand-700" : "text-ink"
              }`}
            >
              {otherUser.name}
            </span>
            {otherUser.isVerified && (
              <BadgeCheck className="w-4 h-4 text-brand-600 fill-brand-100 shrink-0" aria-label="Verified" />
            )}
            {otherUser.role === "admin" && (
              <span className="chip-rose shrink-0 px-1.5 py-0 text-[10px]">Admin</span>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="bg-linear-to-br from-brand-500 to-purple-600 text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shrink-0 shadow-soft">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <p
          className={`text-xs truncate ${
            online ? "text-emerald-600 font-semibold" : isSelected ? "text-brand-500" : "text-zinc-400"
          }`}
        >
          {getLastSeenText(otherUser.id)}
        </p>
      </div>
    </button>
  );
}

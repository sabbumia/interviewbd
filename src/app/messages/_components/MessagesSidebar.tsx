// src/app/messages/_components/MessagesSidebar.tsx
"use client";

import { Search, MessagesSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import ConnectionListItem from "./ConnectionListItem";

interface MessagesSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredConnections: any[];
  selectedUserId: string | null;
  setSelectedUserId: (userId: string) => void;
  user: any;
  unreadCounts: Record<string, number>;
  isUserOnline: (userId: string) => boolean;
  getLastSeenText: (userId: string) => string;
}

export default function MessagesSidebar({
  searchQuery,
  setSearchQuery,
  filteredConnections,
  selectedUserId,
  setSelectedUserId,
  user,
  unreadCounts,
  isUserOnline,
  getLastSeenText,
}: MessagesSidebarProps) {
  return (
    <div className="w-full md:border-r border-zinc-200/80 flex flex-col bg-white">
      {/* Header */}
      <div className="p-5 border-b border-zinc-100">
        <h1 className="font-display text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <MessagesSquare className="w-5 h-5 text-brand-600" />
          Messages
        </h1>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm
              transition-all duration-200
              focus:outline-none focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto scrollbar-slim">
        {filteredConnections.length === 0 ? (
          <div className="p-8 text-center">
            {searchQuery ? (
              <p className="text-zinc-400 text-sm">No results found</p>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center mx-auto mb-3">
                  <MessagesSquare className="w-6 h-6 text-brand-400" />
                </div>
                <p className="text-zinc-500 text-sm font-medium mb-3">No connections yet</p>
                <Link
                  href="/users"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Find connections
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="py-2 px-2 space-y-0.5">
            {filteredConnections.map((conn) => {
              const otherUser = conn.userId === user.id ? conn.connectedUser : conn.user;
              const unreadCount = unreadCounts[otherUser.id] || 0;
              const online = isUserOnline(otherUser.id);
              const isSelected = selectedUserId === otherUser.id;

              return (
                <ConnectionListItem
                  key={conn.id}
                  otherUser={otherUser}
                  unreadCount={unreadCount}
                  online={online}
                  isSelected={isSelected}
                  onSelect={() => setSelectedUserId(otherUser.id)}
                  getLastSeenText={getLastSeenText}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

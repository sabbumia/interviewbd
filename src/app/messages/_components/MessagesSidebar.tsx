// src/app/messages/_components/MessagesSidebar.tsx
"use client";

import { Search } from "lucide-react";
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
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConnections.length === 0 ? (
          <div className="p-6 text-center">
            {searchQuery ? (
              <p className="text-gray-500 text-sm">No results found</p>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-2">No connections yet</p>
                <Link
                  href="/users"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Find connections
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
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

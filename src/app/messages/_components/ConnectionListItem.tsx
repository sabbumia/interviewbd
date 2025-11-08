// src/app/messages/_components/ConnectionListItem.tsx
"use client";

import { Check } from "lucide-react";

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
      className={`w-full p-4 hover:bg-gray-50 transition-colors duration-150 flex items-start gap-3 ${
        isSelected ? "bg-blue-50 hover:bg-blue-50" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {otherUser.profilePicture ? (
          <img
            src={otherUser.profilePicture}
            alt={otherUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? "bg-green-500" : "bg-gray-300"
          }`}
        />
         {/* Verified Badge - Top Right */}
            {otherUser.isVerified && (
              <div
                className="absolute top-0 left-9 bg-blue-600 rounded-full border-2 border-white shadow-md"
                title="Verified User"
              >
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`font-medium truncate ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
              {otherUser.name}
            </span>
            {otherUser.role === "admin" && (
              <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                Admin
              </span>
            )}
            {otherUser.role === "moderator" && (
              <span className="text-xs bg-red-50 text-orange-500 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                Moderator
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center flex-shrink-0">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <p className={`text-xs truncate ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
          {getLastSeenText(otherUser.id)}
        </p>
      </div>
    </button>
  );
}

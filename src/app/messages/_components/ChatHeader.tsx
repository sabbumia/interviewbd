// src/app/messages/_components/ChatHeader.tsx
"use client";

import { MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  selectedUser: any;
  isUserOnline: (userId: string) => boolean;
  getLastSeenText: (userId: string) => string;
}

export default function ChatHeader({
  selectedUser,
  isUserOnline,
  getLastSeenText,
}: ChatHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.name}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isUserOnline(selectedUser.id) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900">{selectedUser.name}</span>
              {selectedUser.isVerified && (
                <img
                  src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
                  alt="Verified"
                  className="w-4 h-4"
                />
              )}
              {selectedUser.role === "admin" && (
                <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{getLastSeenText(selectedUser.id)}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

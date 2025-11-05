// src/app/profile/_components/ConnectionsList.tsx
import Link from 'next/link';
import { MessageCircle, Check } from 'lucide-react';
import { Badge } from '@/lib/badges';

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  user: any;
  connectedUser: any;
}

interface ConnectionsListProps {
  connections: Connection[];
  currentUserId: string;
  getBadge: (count: number) => Badge | null;
}

export default function ConnectionsList({ connections, currentUserId, getBadge }: ConnectionsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        My Connections ({connections.length})
      </h2>

      {connections.length > 0 ? (
        <div className="space-y-3">
          {connections.map((conn) => {
            const otherUser = conn.userId === currentUserId ? conn.connectedUser : conn.user;
            const otherUserBadge = otherUser.questionCount > 0 ? getBadge(otherUser.questionCount) : null;
            
            return (
              <div key={conn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Link href={`/users/${otherUser.id}`} className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <img
                      src={otherUser.profilePicture}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    {otherUser.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 hover:text-blue-600">{otherUser.name}</h3>
                      {otherUserBadge && otherUser.isVerified && (
                        <span className="text-base" title={`${otherUserBadge.name}: ${otherUserBadge.description}`}>
                          {otherUserBadge.emoji}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{otherUser.email}</p>
                    {otherUser.questionCount > 0 && (
                      <p className="text-xs text-blue-600 mt-0.5">
                        {otherUser.questionCount} questions posted
                      </p>
                    )}
                  </div>
                </Link>
                <Link
                  href={`/messages?userId=${otherUser.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-4"
                >
                  Message
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No connections yet</p>
          <p className="text-sm text-gray-500 mb-4">Start networking with other members</p>
          <Link href="/users" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse Users →
          </Link>
        </div>
      )}
    </div>
  );
}
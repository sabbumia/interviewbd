// src/app/profile/_components/ConnectionsList.tsx
import Link from 'next/link';
import { MessageCircle, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/lib/badges';
import Avatar from '@/components/Avatar';

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

export default function ConnectionsList({
  connections,
  currentUserId,
  getBadge,
}: ConnectionsListProps) {
  return (
    <div className="card p-6 sm:p-7 animate-fade-up" style={{ animationDelay: '160ms' }}>
      <div className="flex items-center gap-2.5 mb-5">
        <Users className="w-5 h-5 text-brand-600" />
        <h2 className="font-display text-lg font-bold text-ink">My Connections</h2>
        <span className="chip-brand">{connections.length}</span>
      </div>

      {connections.length > 0 ? (
        <div className="space-y-3">
          {connections.map((conn) => {
            const otherUser = conn.userId === currentUserId ? conn.connectedUser : conn.user;
            const otherUserBadge =
              otherUser.questionCount > 0 ? getBadge(otherUser.questionCount) : null;

            return (
              <div
                key={conn.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200/80 bg-white
                  transition-all duration-300 hover:border-brand-200 hover:shadow-card"
              >
                <Link href={`/users/${otherUser.id}`} className="flex items-center gap-3.5 flex-1 min-w-0 group">
                  <Avatar
                    src={otherUser.profilePicture}
                    name={otherUser.name}
                    size={48}
                    verified={otherUser.isVerified}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink truncate group-hover:text-brand-700 transition-colors">
                        {otherUser.name}
                      </h3>
                      {otherUserBadge && otherUser.isVerified && (
                        <span
                          className="text-base"
                          title={`${otherUserBadge.name}: ${otherUserBadge.description}`}
                        >
                          {otherUserBadge.emoji}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{otherUser.email}</p>
                    {otherUser.questionCount > 0 && (
                      <p className="text-xs font-semibold text-brand-600 mt-0.5">
                        {otherUser.questionCount} questions posted
                      </p>
                    )}
                  </div>
                </Link>
                <Link
                  href={`/messages?userId=${otherUser.id}`}
                  className="btn-secondary px-4 py-2 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-brand-600" />
                  <span className="hidden sm:inline">Message</span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-brand-400" />
          </div>
          <p className="font-display font-bold text-ink mb-1">No connections yet</p>
          <p className="text-sm text-zinc-500 mb-5">Start networking with other members.</p>
          <Link href="/users" className="btn-brand inline-flex">
            Browse Users
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

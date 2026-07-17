// src/app/profile/_components/PendingRequests.tsx
import Link from 'next/link';
import { Bell, Check, X } from 'lucide-react';
import { Badge } from '@/lib/badges';
import Avatar from '@/components/Avatar';

interface PendingRequest {
  id: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  isVerified: boolean;
  questionCount: number;
}

interface PendingRequestsProps {
  requests: PendingRequest[];
  users: User[];
  getBadge: (count: number) => Badge | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendingRequests({
  requests,
  users,
  getBadge,
  onAccept,
  onReject,
}: PendingRequestsProps) {
  if (requests.length === 0) return null;

  return (
    <div className="card p-6 sm:p-7 animate-fade-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="relative">
          <Bell className="w-5 h-5 text-orange-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
        </div>
        <h2 className="font-display text-lg font-bold text-ink">Pending Connection Requests</h2>
        <span className="chip bg-orange-500 text-white">{requests.length}</span>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const requester = users.find((u) => u.id === request.userId);
          if (!requester) return null;

          const requesterBadge =
            requester.questionCount > 0 ? getBadge(requester.questionCount) : null;

          return (
            <div
              key={request.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-orange-50/80 to-amber-50/60 border border-orange-200/70
                transition-all duration-300 hover:border-orange-300 hover:shadow-soft"
            >
              <Link href={`/users/${requester.id}`} className="flex items-center gap-3.5 flex-1 min-w-0 group">
                <Avatar
                  src={requester.profilePicture}
                  name={requester.name}
                  size={48}
                  verified={requester.isVerified}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink truncate group-hover:text-brand-700 transition-colors">
                      {requester.name}
                    </h3>
                    {requesterBadge && requester.isVerified && (
                      <span
                        className="text-base"
                        title={`${requesterBadge.name}: ${requesterBadge.description}`}
                      >
                        {requesterBadge.emoji}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{requester.email}</p>
                  <p className="text-xs font-semibold text-orange-600 mt-0.5">
                    Wants to connect with you
                  </p>
                </div>
              </Link>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onAccept(request.id)}
                  className="btn bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700 hover:-translate-y-0.5 shadow-card flex-1 sm:flex-none"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="btn-secondary px-4 py-2 flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

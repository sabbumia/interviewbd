// src/app/profile/_components/PendingRequests.tsx
import Link from 'next/link';
import { Bell, Check } from 'lucide-react';
import { Badge } from '@/lib/badges';

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

export default function PendingRequests({ requests, users, getBadge, onAccept, onReject }: PendingRequestsProps) {
  if (requests.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Connection Requests
          </h2>
          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
            {requests.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const requester = users.find(u => u.id === request.userId);
          if (!requester) return null;

          const requesterBadge = requester.questionCount > 0 ? getBadge(requester.questionCount) : null;

          return (
            <div key={request.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
              <Link href={`/users/${requester.id}`} className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <img
                    src={requester.profilePicture}
                    alt={requester.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  {requester.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600">{requester.name}</h3>
                    {requesterBadge && requester.isVerified && (
                      <span className="text-base" title={`${requesterBadge.name}: ${requesterBadge.description}`}>
                        {requesterBadge.emoji}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{requester.email}</p>
                  <p className="text-xs text-orange-600 font-medium mt-0.5">
                    Wants to connect with you
                  </p>
                </div>
              </Link>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onAccept(request.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                >
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
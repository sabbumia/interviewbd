// src/app/users/_components/UserCard.tsx
import Link from 'next/link';
import { Check, Clock, MessageCircle, UserPlus, X, GraduationCap, MapPin, Briefcase, TrendingUp, Shield, Crown, ShieldCheck } from 'lucide-react';
import { Badge } from '@/lib/badges';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture: string;
  questionCount: number;
  verificationDetails?: {
    university: string;
    workStatus: string;
    location: string;
  };
}

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: string;
}

interface UserCardProps {
  user: User;
  badge: Badge | null;
  connection: Connection | null | undefined;
  currentUserId: string;
  onConnect: (userId: string) => void;
  onAccept: (connectionId: string) => void;
  onReject: (connectionId: string) => void;
}

export default function UserCard({
  user,
  badge,
  connection,
  currentUserId,
  onConnect,
  onAccept,
  onReject,
}: UserCardProps) {
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700 border-purple-300',
      moderator: 'bg-blue-100 text-blue-700 border-blue-300',
      user: 'bg-gray-100 text-gray-700 border-gray-300',
      premium: 'bg-amber-100 text-amber-700 border-amber-300',
      member: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
      admin: '👑',
      moderator: '🛡️',
      premium: '⭐',
      member: '👤',
      user: '👥',
    };
    return icons[role.toLowerCase()] || '👥';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* User Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white shadow-md">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            {user.role === "admin" && (
                    <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-red-500 to-orange-600 rounded-full border-2 border-white">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {user.role === "moderator" && (
                    <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-red-400 to-yellow-800 rounded-full border-2 border-white">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/users/${user.id}`}>
                <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 cursor-pointer transition-colors">
                  {user.name}
                </h3>
              </Link>
              {badge && (
                <span className="text-lg" title={`${badge.name}: ${badge.description}`}>
                  {badge.emoji}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 truncate mb-2">{user.email}</p>
            
            {/* Role Badge */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${getRoleColor(user.role)}`}>
              <span>{getRoleIcon(user.role)}</span>
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Contribution Stats */}
        {user.questionCount > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700 font-medium">
              {user.questionCount} contribution{user.questionCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* User Details */}
      {user.verificationDetails && (
        <div className="p-5 border-b border-gray-100 space-y-3 bg-gray-50/50">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <span className="truncate font-medium">{user.verificationDetails.university}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <span className="truncate">{user.verificationDetails.location}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <span className="capitalize">
              {user.verificationDetails.workStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-5 bg-white">
        {!connection && (
          <button
            onClick={() => onConnect(user.id)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-sm hover:shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            Connect
          </button>
        )}

        {connection && connection.status === 'pending' && (
          <div>
            {connection.userId === currentUserId ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 py-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Request Pending</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-center text-gray-700 font-semibold bg-gray-50 py-2 rounded-lg">
                  Wants to connect with you
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAccept(connection.id)}
                    className="flex items-center justify-center gap-1 bg-green-600 text-white py-2.5 px-3 rounded-lg hover:bg-green-700 text-sm font-semibold transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(connection.id)}
                    className="flex items-center justify-center gap-1 bg-gray-200 text-gray-700 py-2.5 px-3 rounded-lg hover:bg-gray-300 text-sm font-semibold transition-all"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {connection && connection.status === 'accepted' && (
          <Link
            href={`/messages?userId=${user.id}`}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Send Message
          </Link>
        )}
      </div>
    </div>
  );
}
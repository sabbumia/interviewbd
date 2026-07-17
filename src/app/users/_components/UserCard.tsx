// src/app/users/_components/UserCard.tsx
import Link from 'next/link';
import {
  Check,
  Clock,
  MessageCircle,
  UserPlus,
  X,
  GraduationCap,
  MapPin,
  Briefcase,
  TrendingUp,
  Crown,
  ShieldCheck,
  Star,
  User as UserIcon,
  Users as UsersIcon,
} from 'lucide-react';
import { Badge } from '@/lib/badges';
import Avatar from '@/components/Avatar';

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

const ROLE_STYLES: Record<string, { chip: string; icon: typeof Crown }> = {
  admin: { chip: 'chip-rose', icon: Crown },
  moderator: { chip: 'chip-amber', icon: ShieldCheck },
  premium: { chip: 'chip-brand', icon: Star },
  member: { chip: 'chip-emerald', icon: UserIcon },
  user: { chip: 'chip-zinc', icon: UsersIcon },
};

export default function UserCard({
  user,
  badge,
  connection,
  currentUserId,
  onConnect,
  onAccept,
  onReject,
}: UserCardProps) {
  const roleStyle = ROLE_STYLES[user.role.toLowerCase()] ?? ROLE_STYLES.user;
  const RoleIcon = roleStyle.icon;

  return (
    <div className="card-hover group flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-5 bg-linear-to-br from-zinc-50/80 to-white border-b border-zinc-100">
        <div className="flex items-start gap-4">
          <Link href={`/users/${user.id}`} className="shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Avatar src={user.profilePicture} name={user.name} size={60} verified={user.isVerified} />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Link
                href={`/users/${user.id}`}
                className="font-display font-bold text-ink truncate hover:text-brand-700 transition-colors"
              >
                {user.name}
              </Link>
              {badge && (
                <span className="text-base cursor-help" title={`${badge.name}: ${badge.description}`}>
                  {badge.emoji}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate mb-2.5">{user.email}</p>
            <span className={`${roleStyle.chip} capitalize`}>
              <RoleIcon className="w-3.5 h-3.5" />
              {user.role}
            </span>
          </div>
        </div>

        {user.questionCount > 0 && (
          <div className="mt-4 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-50/70 border border-brand-100">
            <TrendingUp className="w-4 h-4 text-brand-600 shrink-0" />
            <p className="text-sm font-semibold text-brand-700">
              {user.questionCount} contribution{user.questionCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Verification details */}
      {user.verificationDetails && (
        <div className="px-6 py-4 space-y-2.5 border-b border-zinc-100">
          <div className="flex items-center gap-3 text-sm text-zinc-600">
            <span className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-violet-600" />
            </span>
            <span className="truncate font-medium">{user.verificationDetails.university}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </span>
            <span className="truncate">{user.verificationDetails.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600">
            <span className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-sky-600" />
            </span>
            <span className="capitalize">{user.verificationDetails.workStatus.replace('_', ' ')}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-5 mt-auto">
        {!connection && (
          <button onClick={() => onConnect(user.id)} className="btn-brand w-full">
            <UserPlus className="w-4 h-4" />
            Connect
          </button>
        )}

        {connection && connection.status === 'pending' && (
          <>
            {connection.userId === currentUserId ? (
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-700">
                <Clock className="w-4 h-4" />
                Request Pending
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-center font-semibold text-zinc-500 uppercase tracking-wider">
                  Wants to connect with you
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAccept(connection.id)}
                    className="btn bg-emerald-600 text-white px-4 py-2.5 text-sm hover:bg-emerald-700 hover:-translate-y-0.5 shadow-card"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button onClick={() => onReject(connection.id)} className="btn-secondary">
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {connection && connection.status === 'accepted' && (
          <Link
            href={`/messages?userId=${user.id}`}
            className="btn w-full bg-emerald-600 text-white px-4 py-2.5 text-sm hover:bg-emerald-700 hover:-translate-y-0.5 shadow-card"
          >
            <MessageCircle className="w-4 h-4" />
            Send Message
          </Link>
        )}
      </div>
    </div>
  );
}

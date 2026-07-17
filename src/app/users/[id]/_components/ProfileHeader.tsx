// src/app/users/[id]/_components/ProfileHeader.tsx
import Link from 'next/link';
import {
  Check,
  Calendar,
  Award,
  Clock,
  MessageCircle,
  UserPlus,
  X,
  Mail,
  ShieldCheck,
  Crown,
  Star,
  User as UserIcon,
  Users as UsersIcon,
  Pencil,
} from 'lucide-react';
import { Badge } from '@/lib/badges';
import Avatar from '@/components/Avatar';

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePicture: string;
    isVerified: boolean;
    createdAt: string;
  };
  badge: Badge | null;
  isOwnProfile: boolean;
  connection: any;
  currentUserId: string;
  onConnect: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const ROLE_STYLES: Record<string, { chip: string; icon: typeof Crown }> = {
  admin: { chip: 'chip-rose', icon: Crown },
  moderator: { chip: 'chip-amber', icon: ShieldCheck },
  premium: { chip: 'chip-brand', icon: Star },
  member: { chip: 'chip-emerald', icon: UserIcon },
  user: { chip: 'chip-zinc', icon: UsersIcon },
};

export default function ProfileHeader({
  user,
  badge,
  isOwnProfile,
  connection,
  currentUserId,
  onConnect,
  onAccept,
  onReject,
}: ProfileHeaderProps) {
  const roleStyle = ROLE_STYLES[user.role.toLowerCase()] ?? ROLE_STYLES.user;
  const RoleIcon = roleStyle.icon;

  const actions = isOwnProfile ? (
    <Link href="/profile" className="btn-primary">
      <Pencil className="w-4 h-4" />
      Edit Profile
    </Link>
  ) : (
    <>
      {!connection && (
        <button onClick={onConnect} className="btn-brand">
          <UserPlus className="w-4.5 h-4.5" />
          Connect
        </button>
      )}

      {connection && connection.status === 'pending' && (
        <>
          {connection.userId === currentUserId ? (
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-700">
              <Clock className="w-4.5 h-4.5" />
              Request Pending
            </span>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onAccept}
                className="btn bg-emerald-600 text-white px-5 py-2.5 text-sm hover:bg-emerald-700 hover:-translate-y-0.5 shadow-card"
              >
                <Check className="w-4.5 h-4.5" />
                Accept
              </button>
              <button onClick={onReject} className="btn-secondary">
                <X className="w-4.5 h-4.5" />
                Reject
              </button>
            </div>
          )}
        </>
      )}

      {connection && connection.status === 'accepted' && (
        <Link
          href={`/messages?userId=${user.id}`}
          className="btn bg-emerald-600 text-white px-5 py-2.5 text-sm hover:bg-emerald-700 hover:-translate-y-0.5 shadow-card"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          Send Message
        </Link>
      )}
    </>
  );

  return (
    <div className="card overflow-hidden mb-6 animate-fade-up">
      {/* Cover banner */}
      <div className="relative h-36 sm:h-44 bg-[#12111a] overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid-dark" />
        <div
          aria-hidden
          className="absolute -top-20 -right-10 w-96 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-10 w-80 h-60 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #22d3ee, #4f46e5)' }}
        />
      </div>

      <div className="px-6 sm:px-8 pb-7">
        <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-14 sm:-mt-16 mb-6">
          {/* Avatar */}
          <div className="relative shrink-0 w-fit">
            <Avatar src={user.profilePicture} name={user.name} size={128} ring />
            {user.isVerified && (
              <span
                className="absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-brand-600 border-[3px] border-white shadow-card flex items-center justify-center"
                title="Verified User"
              >
                <Check className="w-4 h-4 text-white" />
              </span>
            )}
          </div>

          {/* Name + actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:pb-1">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Member since{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <span className={`${roleStyle.chip} capitalize w-fit py-1.5`}>
            <RoleIcon className="w-4 h-4" />
            {user.role}
          </span>

          {/* Achievement badge */}
          {badge && (
            <div className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200/80 lg:max-w-md">
              <span className="text-4xl shrink-0" aria-hidden>
                {badge.emoji}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  Achievement
                </div>
                <p className="font-display font-bold text-ink">{badge.name}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{badge.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

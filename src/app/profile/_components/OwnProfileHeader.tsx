// src/app/profile/_components/OwnProfileHeader.tsx
import {
  Camera,
  Edit2,
  Check,
  X,
  Award,
  Loader2,
  Mail,
  Crown,
  ShieldCheck,
  Star,
  User as UserIcon,
  Users as UsersIcon,
  BadgeCheck,
} from 'lucide-react';
import { Badge } from '@/lib/badges';
import Avatar from '@/components/Avatar';

interface OwnProfileHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
    profilePicture: string;
    isVerified: boolean;
  };
  badge: Badge | null;
  editingName: boolean;
  newName: string;
  uploadingImage: boolean;
  onNameChange: (name: string) => void;
  onNameSave: () => void;
  onNameCancel: () => void;
  onEditName: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  canRequestVerification?: boolean;
  onRequestVerification?: () => void;
}

const ROLE_STYLES: Record<string, { chip: string; icon: typeof Crown }> = {
  admin: { chip: 'chip-rose', icon: Crown },
  moderator: { chip: 'chip-amber', icon: ShieldCheck },
  premium: { chip: 'chip-brand', icon: Star },
  member: { chip: 'chip-emerald', icon: UserIcon },
  user: { chip: 'chip-zinc', icon: UsersIcon },
};

export default function OwnProfileHeader({
  user,
  badge,
  editingName,
  newName,
  uploadingImage,
  onNameChange,
  onNameSave,
  onNameCancel,
  onEditName,
  onImageUpload,
  fileInputRef,
  canRequestVerification = false,
  onRequestVerification,
}: OwnProfileHeaderProps) {
  const roleStyle = ROLE_STYLES[user.role.toLowerCase()] ?? ROLE_STYLES.user;
  const RoleIcon = roleStyle.icon;

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
          {/* Avatar + upload */}
          <div className="relative shrink-0 w-fit">
            <Avatar src={user.profilePicture} name={user.name} size={128} ring />
            {user.isVerified && (
              <span
                className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-brand-600 border-[3px] border-white shadow-card flex items-center justify-center"
                title="Verified User"
              >
                <Check className="w-4 h-4 text-white" />
              </span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute bottom-1.5 right-1.5 w-9 h-9 rounded-full bg-ink text-white border-[3px] border-white shadow-card
                flex items-center justify-center transition-all duration-300
                hover:bg-brand-600 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Change profile picture"
            >
              {uploadingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </div>

          {/* Name + actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:pb-1">
            <div className="min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => onNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onNameSave();
                      if (e.key === 'Escape') onNameCancel();
                    }}
                    className="field-input font-display text-xl font-bold max-w-xs"
                    autoFocus
                  />
                  <button
                    onClick={onNameSave}
                    className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-card"
                    title="Save"
                  >
                    <Check className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={onNameCancel}
                    className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 hover:text-ink transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight truncate">
                    {user.name}
                  </h1>
                  <button
                    onClick={onEditName}
                    className="p-2 rounded-lg text-zinc-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Edit name"
                  >
                    <Edit2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
              </div>
            </div>

            {canRequestVerification && onRequestVerification && (
              <button onClick={onRequestVerification} className="btn-brand shrink-0">
                <BadgeCheck className="w-4.5 h-4.5" />
                Request Verification
              </button>
            )}
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

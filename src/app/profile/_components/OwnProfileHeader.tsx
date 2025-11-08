// src/app/profile/_components/OwnProfileHeader.tsx
import { useRef } from 'react';
import { Camera, Edit2, Check, X, Award, Clock, Mail, Shield } from 'lucide-react';
import { Badge } from '@/lib/badges';

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
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      moderator: 'bg-blue-100 text-blue-700 border-blue-200',
      user: 'bg-gray-100 text-gray-700 border-gray-200',
      premium: 'bg-amber-100 text-amber-700 border-amber-200',
      member: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Cover Banner with Name */}
      <div className="h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative px-6 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        
        <div className="relative h-full flex items-end justify-between pb-6 z-10">
          {/* Name Section - Left */}
          <div className="flex items-center gap-3 flex-wrap ml-44">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => onNameChange(e.target.value)}
                  className="text-2xl md:text-3xl font-bold border-2 border-white bg-white/10 backdrop-blur-sm text-white rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-white focus:border-white outline-none"
                  autoFocus
                />
                <button
                  onClick={onNameSave}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                  title="Save"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={onNameCancel}
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{user.name}</h1>
                <button
                  onClick={onEditName}
                  className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
                  title="Edit name"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Request Verification Button - Right */}
          {canRequestVerification && onRequestVerification && (
            <div className="hidden md:block">
              <button
                onClick={onRequestVerification}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Request Verification
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 md:px-8 pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Profile Picture */}
          <div className="flex-shrink-0 -mt-20">
            <div className="relative inline-block">
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                  onError={(e) => {
                    e.currentTarget.src = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg';
                  }}
                />
                
                {/* Camera Button - Bottom Right Corner */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
                  title="Change profile picture"
                >
                  {uploadingImage ? (
                    <Clock className="w-4 h-4 animate-spin" />
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
                
                {/* Verified Badge - Top Right */}
                {user.isVerified && (
                  <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1.5 border-2 border-white shadow-md" title="Verified User">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section - User Info */}
          <div className="flex-1 pt-2">
            <div className="flex flex-col gap-2">
              {/* Email */}
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
              {/* Role */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${getRoleColor(user.role)} font-medium text-sm w-fit`}>
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user.role}</span>
              </div>

              {/* Mobile Request Verification Button */}
              {canRequestVerification && onRequestVerification && (
                <div className="md:hidden mt-2">
                  <button
                    onClick={onRequestVerification}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all w-full flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Request Verification
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Badge */}
          {badge && (
            <div className="lg:w-72 pt-2">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-sm h-full">
                <div className="flex items-start gap-3">
                  <div className="text-4xl flex-shrink-0" aria-label="Badge">
                    {badge.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <h3 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">Achievement</h3>
                    </div>
                    <p className="font-bold text-gray-900 text-lg mb-1">{badge.name}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
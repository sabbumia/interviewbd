// src/app/users/[id]/_components/ProfileHeader.tsx
import Link from 'next/link';
import { Check, Calendar, Award, Clock, MessageCircle, UserPlus, X, Mail, Shield } from 'lucide-react';
import { Badge } from '@/lib/badges';

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
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{user.name}</h1>
          </div>

          {/* Action Buttons - Right */}
          {!isOwnProfile && (
            <div className="hidden md:flex gap-3">
              {!connection && (
                <button 
                  onClick={onConnect}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="w-5 h-5" />
                  Connect
                </button>
              )}

              {connection && connection.status === 'pending' && (
                <>
                  {connection.userId === currentUserId ? (
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-yellow-100/90 backdrop-blur-sm border-2 border-yellow-300 rounded-lg text-yellow-800 font-semibold shadow-lg">
                      <Clock className="w-5 h-5" />
                      Request Pending
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={onAccept}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                      >
                        <Check className="w-5 h-5" />
                        Accept
                      </button>
                      <button
                        onClick={onReject}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-5 py-2.5 rounded-lg hover:bg-white/30 transition-all font-semibold"
                      >
                        <X className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}

              {connection && connection.status === 'accepted' && (
                <Link
                  href={`/messages?userId=${user.id}`}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </Link>
              )}
            </div>
          )}

          {isOwnProfile && (
            <div className="hidden md:block">
              <Link
                href="/profile"
                className="bg-white text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 md:px-8 pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Profile Picture */}
          <div className="flex-shrink-0 -mt-20">
            <div className="relative inline-block">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                onError={(e) => {
                  e.currentTarget.src = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg';
                }}
              />
              
              {/* Verified Badge - Top Right */}
              {user.isVerified && (
                <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1.5 border-2 border-white shadow-md" title="Verified User">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
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

              {/* Member Since */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}</span>
              </div>

              {/* Mobile Action Buttons */}
              {!isOwnProfile && (
                <div className="md:hidden mt-3 flex flex-col gap-2">
                  {!connection && (
                    <button 
                      onClick={onConnect}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full"
                    >
                      <UserPlus className="w-5 h-5" />
                      Connect
                    </button>
                  )}

                  {connection && connection.status === 'pending' && (
                    <>
                      {connection.userId === currentUserId ? (
                        <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 font-semibold w-full">
                          <Clock className="w-5 h-5" />
                          Request Pending
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={onAccept}
                            className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold flex-1"
                          >
                            <Check className="w-5 h-5" />
                            Accept
                          </button>
                          <button
                            onClick={onReject}
                            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex-1"
                          >
                            <X className="w-5 h-5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {connection && connection.status === 'accepted' && (
                    <Link
                      href={`/messages?userId=${user.id}`}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Send Message
                    </Link>
                  )}
                </div>
              )}

              {isOwnProfile && (
                <div className="md:hidden mt-3">
                  <Link
                    href="/profile"
                    className="block text-center bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-semibold w-full"
                  >
                    Edit Profile
                  </Link>
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
// app/_components/TopLikedUsersSection.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Heart, Star, Award, ThumbsUp } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  role: string;
  questionCount: number;
  likeCount?: number;
}

interface TopLikedUsersSectionProps {
  users: User[];
}

export default function TopLikedUsersSection({ users }: TopLikedUsersSectionProps) {
  const router = useRouter();

  const getBadgeInfo = (questionCount: number) => {
    if (questionCount >= 200) return { icon: '🌟', name: 'Legendary Asker' };
    if (questionCount >= 100) return { icon: '🧠', name: 'Expert Inquirer' };
    if (questionCount >= 50) return { icon: '🔥', name: 'Pro Questioner' };
    if (questionCount >= 20) return { icon: '💡', name: 'Inquirer' };
    if (questionCount >= 10) return { icon: '🔍', name: 'Seeker' };
    if (questionCount >= 5) return { icon: '🌱', name: 'Curious' };
    return { icon: '🐣', name: 'Newbie' };
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm font-medium text-pink-700 mb-4">
            <Heart className="w-4 h-4" />
            Most Appreciated
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Top Liked Contributors
          </h2>
          <p className="text-lg text-gray-600">
            Users whose questions received the most likes from the community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {users.map((user, i) => {
            const badge = getBadgeInfo(user.questionCount);
            return (
              <div
                key={user.id}
                onClick={() => router.push(`/users/${user.id}`)}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden cursor-pointer"
              >
                {i === 0 && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-bl-full flex items-start justify-end p-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                )}
                
                <div className="relative inline-block mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur opacity-40"></div>
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/80'}
                    alt={user.name}
                    className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate">{user.email}</p>
                
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{badge.name}</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-rose-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-2xl font-bold">{user.likeCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Total Likes</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{user.questionCount}</span> Questions
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
// src/app/users/[id]/_components/StatisticsCard.tsx
import { TrendingUp, Heart, Award } from 'lucide-react';

interface StatisticsCardProps {
  questionCount: number;
  totalLikes: number;
  avgLikes: string;
}

export default function StatisticsCard({ questionCount, totalLikes, avgLikes }: StatisticsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{questionCount}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Likes</p>
              <p className="text-2xl font-bold text-gray-900">{avgLikes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
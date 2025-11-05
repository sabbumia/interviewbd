// src/app/admin/_components/OverviewTab.tsx

import { Users, CheckCircle, Activity, Award, TrendingUp, AlertCircle, Flag, FolderTree, Tag, BarChart3, Trophy } from "lucide-react";
import { Analytics } from "./types";
import { getBadge } from "./types";

interface OverviewTabProps {
  analytics: Analytics;
  pendingReportsCount: number;
  pendingVerificationsCount: number;
}

export default function OverviewTab({ analytics, pendingReportsCount, pendingVerificationsCount }: OverviewTabProps) {
  // Calculate engagement rate
  const engagementRate = analytics.totalQuestions > 0 
    ? Math.round((analytics.totalLikes / analytics.totalQuestions) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600 mt-1">Monitor your platform statistics and activity</p>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-700">Active</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalUsers}</p>
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-green-600">{analytics.verifiedUsers}</span> verified
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg font-bold border border-green-200">
              {Math.round((analytics.verifiedUsers / analytics.totalUsers) * 100)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.verifiedUsers}</p>
          <p className="text-sm font-medium text-gray-600">Verified Users</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              of {analytics.totalUsers} total users
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-lg font-bold border border-purple-200">
              {Math.round(analytics.totalQuestions / analytics.totalUsers)} avg
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalQuestions}</p>
          <p className="text-sm font-medium text-gray-600">Total Questions</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              across all categories
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-50 rounded-lg">
              <Award className="w-6 h-6 text-pink-600" />
            </div>
            <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-lg font-bold border border-pink-200">
              {engagementRate}% rate
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalLikes}</p>
          <p className="text-sm font-medium text-gray-600">Total Likes</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              engagement activity
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Stats & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FolderTree className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalFields}</p>
              <p className="text-sm font-medium text-gray-600">Fields</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCategories}</p>
              <p className="text-sm font-medium text-gray-600">Categories</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl shadow-sm border-2 border-orange-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{pendingVerificationsCount}</p>
              <p className="text-sm font-bold text-orange-600">Pending Verifications</p>
            </div>
          </div>
          {pendingVerificationsCount > 0 && (
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-xs text-orange-600 font-medium">Requires attention</p>
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-xl shadow-sm border-2 border-red-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{pendingReportsCount}</p>
              <p className="text-sm font-bold text-red-600">Pending Reports</p>
            </div>
          </div>
          {pendingReportsCount > 0 && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-600 font-medium">Requires review</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Contributors Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top Contributors</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Most active users on the platform
                </p>
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-yellow-200">
              Top {analytics.topContributors.length}
            </span>
          </div>
        </div>

        <div className="p-6">
          {analytics.topContributors.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No contributors yet</p>
              <p className="text-sm text-gray-400 mt-1">User activity will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.topContributors.map((contributor, index) => {
                const badge = getBadge(contributor.questionCount);
                const isTopThree = index < 3;
                
                return (
                  <div 
                    key={contributor.userId} 
                    className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      isTopThree 
                        ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg shadow-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      }`}>
                        #{index + 1}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 font-bold">
                            {contributor.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{contributor.user.name}</span>
                            {contributor.user.isVerified && (
                              <img
                                src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
                                alt="Verified"
                                className="w-4 h-4"
                                title="Verified user"
                              />
                            )}
                            {badge && (
                              <span className="text-xl" title={badge.name}>
                                {badge.emoji}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{contributor.user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                          <p className="font-bold text-blue-600 text-lg">{contributor.questionCount}</p>
                          <p className="text-xs text-gray-600 font-medium">Questions</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                          <p className="font-bold text-pink-600 text-lg">{contributor.totalLikes}</p>
                          <p className="text-xs text-gray-600 font-medium">Likes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingVerificationsCount > 0 && (
          <div className="bg-orange-50 rounded-xl border-2 border-orange-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Pending Verifications</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  You have <span className="font-bold text-orange-700">{pendingVerificationsCount}</span> verification {pendingVerificationsCount === 1 ? 'request' : 'requests'} waiting for review.
                </p>
                <p className="text-xs text-orange-600 font-medium">
                  Navigate to Verifications tab to review
                </p>
              </div>
            </div>
          </div>
        )}

        {pendingReportsCount > 0 && (
          <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-xl flex-shrink-0">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Pending Reports</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  You have <span className="font-bold text-red-700">{pendingReportsCount}</span> content {pendingReportsCount === 1 ? 'report' : 'reports'} that need attention.
                </p>
                <p className="text-xs text-red-600 font-medium">
                  Navigate to Reports tab to take action
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
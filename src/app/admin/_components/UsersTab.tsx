// src/app/admin/_components/UsersTab.tsx

import { useState } from "react";
import { Trash2, Users, Search, Shield, CheckCircle, XCircle, Award, Filter, ShieldCheck, Crown, Check } from "lucide-react";
import { User } from "./types";
import { getBadge } from "./types";

interface UsersTabProps {
  users: User[];
  currentUserId: string;
  onRoleChange: (userId: string, newRole: string) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UsersTab({ users, currentUserId, onRoleChange, onDeleteUser }: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: users.length,
    verified: users.filter(u => u.isVerified).length,
    admins: users.filter(u => u.role === "admin").length,
    moderators: users.filter(u => u.role === "moderator").length,
    totalQuestions: users.reduce((sum, u) => sum + (u.questionCount || 0), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Total Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Verified</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Admins</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.moderators}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Moderators</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-pink-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Total Questions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="w-full md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{users.length}</span> users
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Badge
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => {
                  const badge = getBadge(u.questionCount || 0);
                  const isCurrentUser = u.id === currentUserId;
                  
                  return (
                    <tr 
                      key={u.id} 
                      className={`hover:bg-blue-50 transition-colors ${isCurrentUser ? 'bg-blue-50/50' : ''}`}
                    >
                      {/* User Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            
                            <div className="relative flex-shrink-0">
                          <img
                            src={
                              u.profilePicture ||
                              "/default-avatar.png"
                            }
                            alt={u.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                          {u.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white shadow-md">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {u.role === "admin" && (
                            <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-red-500 to-orange-600 rounded-full border-2 border-white">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {u.role === "moderator" && (
                            <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-red-400 to-yellow-800 rounded-full border-2 border-white">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 ml-2">{u.name}</span>
                              {isCurrentUser && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{u.email}</span>
                      </td>

                      {/* Badge Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {badge ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl" title={badge.name}>{badge.emoji}</span>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">{badge.name}</span>
                              <span className="text-xs text-gray-500">
                                {badge.minQuestions === badge.maxQuestions 
                                  ? `${badge.minQuestions}+` 
                                  : badge.maxQuestions === Infinity
                                  ? `${badge.minQuestions}+`
                                  : `${badge.minQuestions}-${badge.maxQuestions}`
                                } questions
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Award className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-400 font-medium">No badge</span>
                          </div>
                        )}
                      </td>

                      {/* Questions Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 px-3 py-1 rounded-lg">
                            <span className="text-sm font-bold text-blue-700">{u.questionCount || 0}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={u.role}
                          onChange={(e) => onRoleChange(u.id, e.target.value)}
                          className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          disabled={isCurrentUser}
                        >
                          <option value="user">👤 User</option>
                          <option value="moderator">🛡️ Moderator</option>
                          <option value="admin">⚡ Admin</option>
                        </select>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!isCurrentUser ? (
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-all border border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Cannot delete self</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
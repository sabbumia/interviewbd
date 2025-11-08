// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/timeAgo';
import { getBadge } from '@/lib/badges';
import { Check, Clock, Eye, EyeOff, ThumbsUp } from 'lucide-react';

interface QuestionCardProps {
  question: {
    id: string;
    questionText: string;
    answer: string;
    userId: string;
    categoryId: string;
    createdAt: string;
    likeCount: number;
    isLikedByUser: boolean;
    user: {
      id: string;
      name: string;
      isVerified: boolean;
      profilePicture?: string;
      questionCount?: number;
    };
  };
  currentUser: any;
  onDelete?: (questionId: string) => void;
  onLikeToggle?: () => void;
}

export default function QuestionCard({ question, currentUser, onDelete, onLikeToggle }: QuestionCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isLiked, setIsLiked] = useState(question.isLikedByUser);
  const [likeCount, setLikeCount] = useState(question.likeCount);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const authorBadge = question.user?.questionCount ? getBadge(question.user.questionCount) : null;
  const defaultAvatar = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80';

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please login to like questions');
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        const res = await fetch(`/api/likes?questionId=${question.id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
          onLikeToggle?.();
        }
      } else {
        const res = await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: question.id }),
        });

        if (res.ok) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          onLikeToggle?.();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to like question');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!currentUser) {
      alert('Please login to report questions');
      return;
    }

    if (!reportReason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId: question.id, 
          reason: reportReason 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Report submitted successfully. An admin will review it.');
        setShowReportModal(false);
        setReportReason('');
      } else {
        alert(data.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = currentUser && (
    question.userId === currentUser.id || 
    currentUser.role === 'admin' || 
    currentUser.role === 'moderator'
  );
  const canDelete = currentUser && (
    question.userId === currentUser.id || 
    currentUser.role === 'admin'
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Header with Question */}
        <div className="p-6 pb-4">
          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo(question.createdAt)}</span>
          </div>

          {/* Question Text - Prominent */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
            {question.questionText}
          </h3>

          {/* Author Info - Compact but Clear */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <Link href={`/users/${question.user?.id}`} className="relative group">
              <img
                src={question.user?.profilePicture || defaultAvatar}
                alt={question.user?.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-all"
              />
              {question.user?.isVerified && (
                <div className="absolute -top-0.5 -right-0.5 bg-blue-600 rounded-full p-0.5 border-2 border-white shadow-sm">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </Link>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link 
                  href={`/users/${question.user?.id}`}
                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {question.user?.name}
                </Link>
                {authorBadge && question.user?.isVerified && (
                  <span 
                    className="text-sm cursor-help"
                    title={`${authorBadge.name}: ${authorBadge.description}`}
                  >
                    {authorBadge.emoji}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Answer Section - Enhanced */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full group"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">View Answer</p>
                    <p className="text-xs text-gray-600">Click to reveal the answer</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:translate-x-1 transition-transform">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border-2 border-gray-200 overflow-hidden">
              {/* Answer Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">Model Answer</span>
                </div>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide Answer
                </button>
              </div>

              {/* Answer Content */}
              <div className="p-5">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {question.answer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar - Enhanced */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Left Actions */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={loading || !currentUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isLiked 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>Helpful</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-bold">
                  {likeCount}
                </span>
              </button>

              {/* Report Button */}
              {currentUser && currentUser.id !== question.userId && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm"
                >
                  <span>🚩</span>
                  <span>Report</span>
                </button>
              )}
            </div>

            {/* Right Actions - Admin/Edit */}
            {(canEdit || canDelete) && (
              <div className="flex items-center gap-3">
                {canEdit && (
                  <Link
                    href={`/questions/${question.id}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    Edit
                  </Link>
                )}
                {canDelete && (
                  <>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={() => onDelete?.(question.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Login Prompt */}
          {!currentUser && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Sign in
                </Link>
                {' '}to save questions, mark as helpful, and track your progress
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal - Enhanced */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🚩</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Report Question</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Help us maintain quality content. Please describe the issue with this question.
            </p>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g., Incorrect information, inappropriate content, spam..."
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 mb-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              required
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleReport}
                disabled={loading || !reportReason.trim()}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 disabled:bg-gray-400 font-semibold text-sm transition-all shadow-sm"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
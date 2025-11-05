// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/timeAgo';
import { getBadge } from '@/lib/badges';

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

  const defaultAvatar = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80';

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
        {/* Question Section */}
        <div className="p-5 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
            {question.questionText}
          </h3>

          {/* User Info - Compact */}
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/users/${question.user?.id}`}>
              <img
                src={question.user?.profilePicture || defaultAvatar}
                alt={question.user?.name}
                className="w-7 h-7 rounded-full object-cover border border-gray-200"
              />
            </Link>
            
            <Link 
              href={`/users/${question.user?.id}`}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {question.user?.name}
            </Link>
            
            {question.user?.isVerified && (
              <img
                src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
                alt="Verified"
                className="w-4 h-4"
              />
            )}
            
            {authorBadge && question.user?.isVerified && (
              <span 
                className="text-base cursor-help"
                title={`${authorBadge.name}: ${authorBadge.description}`}
              >
                {authorBadge.emoji}
              </span>
            )}

            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-500">{timeAgo(question.createdAt)}</span>
          </div>

          {/* Answer Section */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium text-sm">View Answer</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Answer</span>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Hide
                </button>
              </div>
              <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                {question.answer}
              </p>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={loading || !currentUser}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isLiked 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likeCount}</span>
            </button>

            {/* Report Button */}
            {currentUser && currentUser.id !== question.userId && (
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
              >
                <span>🚩</span>
                <span>Report</span>
              </button>
            )}
          </div>

          {/* Edit/Delete */}
          {canEdit && (
            <div className="flex items-center gap-2">
              <Link
                href={`/questions/${question.id}/edit`}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Edit
              </Link>
              {onDelete && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => onDelete(question.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
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
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <Link href="/login" className="text-gray-900 hover:underline font-medium">
                Login
              </Link>
              {' '}to like or report
            </p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Report Question</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for reporting this question.
            </p>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 h-32 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-sm"
              required
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleReport}
                disabled={loading || !reportReason.trim()}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 font-medium text-sm transition-all"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                className="px-6 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm transition-all"
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
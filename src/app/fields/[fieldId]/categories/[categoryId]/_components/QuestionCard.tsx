// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Flag, Heart, Lightbulb, Pencil, Trash2, X } from 'lucide-react';
import { timeAgo } from '@/lib/timeAgo';
import { getBadge } from '@/lib/badges';
import Avatar from '@/components/Avatar';

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
          setLikeCount((prev) => prev - 1);
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
          setLikeCount((prev) => prev + 1);
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
          reason: reportReason,
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

  const canEdit =
    currentUser &&
    (question.userId === currentUser.id ||
      currentUser.role === 'admin' ||
      currentUser.role === 'moderator');

  return (
    <>
      <article className="card group/card transition-all duration-300 hover:shadow-lift hover:border-brand-200/80 overflow-hidden">
        <div className="p-6 pb-5">
          {/* Author row */}
          <div className="flex items-center gap-2.5 mb-4">
            <Link href={`/users/${question.user?.id}`} className="shrink-0">
              <Avatar
                src={question.user?.profilePicture}
                name={question.user?.name || 'User'}
                size={36}
                verified={question.user?.isVerified}
              />
            </Link>
            <div className="min-w-0 flex items-center gap-2 flex-wrap">
              <Link
                href={`/users/${question.user?.id}`}
                className="text-sm font-bold text-ink hover:text-brand-700 transition-colors"
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
              <span className="text-zinc-300" aria-hidden>·</span>
              <time className="text-xs font-medium text-zinc-400">{timeAgo(question.createdAt)}</time>
            </div>
          </div>

          {/* Question */}
          <h3 className="font-display text-lg font-semibold text-ink leading-relaxed mb-4">
            {question.questionText}
          </h3>

          {/* Answer toggle */}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            aria-expanded={showAnswer}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
              showAnswer
                ? 'bg-brand-50/70 border-brand-100 text-brand-700'
                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-brand-50/50 hover:border-brand-100 hover:text-brand-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {showAnswer ? 'Hide Answer' : 'View Answer'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${showAnswer ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Collapsible answer */}
          <div
            className={`grid transition-all duration-300 ease-out ${
              showAnswer ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-5 py-4 rounded-xl bg-linear-to-br from-brand-50/60 to-purple-50/40 border-l-4 border-brand-400">
                <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                  {question.answer}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3.5 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={loading || !currentUser}
              aria-pressed={isLiked}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-rose-200 hover:text-rose-600'
                }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
              <span className="tabular-nums">{likeCount}</span>
            </button>

            {currentUser && currentUser.id !== question.userId && (
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-white text-zinc-600 border border-zinc-200
                  hover:border-amber-300 hover:text-amber-600 transition-all duration-300"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            )}
          </div>

          {canEdit && (
            <div className="flex items-center gap-1">
              <Link
                href={`/questions/${question.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-zinc-500 hover:text-brand-700 hover:bg-brand-50 transition-all duration-300"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(question.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login prompt */}
        {!currentUser && (
          <div className="px-6 py-2.5 bg-zinc-50/70 border-t border-zinc-100">
            <p className="text-xs text-zinc-400 text-center">
              <Link href="/login" className="text-brand-600 hover:text-brand-700 font-semibold hover:underline">
                Login
              </Link>{' '}
              to like or report
            </p>
          </div>
        )}
      </article>

      {/* Report modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowReportModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Report question"
            className="card max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Flag className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Report Question</h3>
                  <p className="text-xs text-zinc-500">Our moderators will review it.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                aria-label="Close"
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Tell us what's wrong with this question…"
              className="field-input h-32 resize-none mb-5"
              required
            />

            <div className="flex gap-3">
              <button
                onClick={handleReport}
                disabled={loading || !reportReason.trim()}
                className="btn-danger flex-1"
              >
                {loading ? 'Submitting…' : 'Submit Report'}
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                className="btn-secondary"
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

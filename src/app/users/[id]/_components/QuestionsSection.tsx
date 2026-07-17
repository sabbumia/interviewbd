// src/app/users/[id]/_components/QuestionsSection.tsx
import Link from 'next/link';
import { Heart, ArrowRight, TrendingUp, ChevronRight, MessagesSquare } from 'lucide-react';
import { timeAgo } from '@/lib/timeAgo';

interface Question {
  id: string;
  questionText: string;
  likeCount: number;
  createdAt: string;
  categoryId: string;
  category: {
    name: string;
    fieldId: string;
    field?: {
      name: string;
    };
  };
}

interface QuestionsSectionProps {
  questions: Question[];
  totalQuestions: number;
  userId: string;
  userName: string;
  isOwnProfile: boolean;
}

export default function QuestionsSection({
  questions,
  totalQuestions,
  userName,
  isOwnProfile,
}: QuestionsSectionProps) {
  return (
    <div className="card p-6 sm:p-7 animate-fade-up" style={{ animationDelay: '120ms' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
          <MessagesSquare className="w-5 h-5 text-brand-600" />
          Recent Questions
        </h2>
        {questions.length > 0 && (
          <span className="chip-brand">{questions.length}</span>
        )}
      </div>

      {questions && questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="group p-5 rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300
                hover:border-brand-200 hover:shadow-card hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-ink flex-1 leading-snug">
                  {question.questionText}
                </h3>
                <div className="flex items-center gap-3 text-sm text-zinc-400 whitespace-nowrap shrink-0">
                  <span className="flex items-center gap-1 font-semibold text-rose-500">
                    <Heart className="w-4 h-4 fill-rose-100" />
                    {question.likeCount}
                  </span>
                  <time className="text-xs font-medium">{timeAgo(question.createdAt)}</time>
                </div>
              </div>

              {question.category && (
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  <Link
                    href={`/fields/${question.category.fieldId}`}
                    className="chip-brand hover:bg-brand-100 transition-colors"
                  >
                    {question.category.field?.name}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                  <Link
                    href={`/fields/${question.category.fieldId}/categories/${question.categoryId}`}
                    className="chip bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 transition-colors"
                  >
                    {question.category.name}
                  </Link>
                </div>
              )}

              <Link
                href={`/fields/${question.category.fieldId}/categories/${question.categoryId}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                View in category
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-brand-400" />
          </div>
          <p className="font-display font-bold text-ink mb-1">No questions posted yet</p>
          <p className="text-sm text-zinc-500">
            {isOwnProfile
              ? 'Start contributing by posting your first question!'
              : `${userName} hasn't posted any questions yet.`}
          </p>
        </div>
      )}

      {totalQuestions > questions.length && (
        <p className="mt-6 pt-5 border-t border-zinc-100 text-center text-sm font-medium text-zinc-400">
          Showing {questions.length} of {totalQuestions} questions
        </p>
      )}
    </div>
  );
}

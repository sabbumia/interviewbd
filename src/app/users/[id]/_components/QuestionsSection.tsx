// src/app/users/[id]/_components/QuestionsSection.tsx
import Link from 'next/link';
import { Heart, ExternalLink, TrendingUp } from 'lucide-react';

function timeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

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
  userId,
  userName,
  isOwnProfile,
}: QuestionsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Questions {questions.length > 0 && `(${questions.length})`}
        </h2>
      </div>

      {questions && questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-gray-900 flex-1 leading-snug">
                  {question.questionText}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {question.likeCount}
                  </span>
                  <span>{timeAgo(question.createdAt)}</span>
                </div>
              </div>

              {question.category && (
                <div className="flex items-center gap-2 mb-3">
                  <Link
                    href={`/fields/${question.category.fieldId}`}
                    className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium hover:bg-blue-100"
                  >
                    {question.category.field?.name}
                  </Link>
                  <span className="text-gray-300">›</span>
                  <Link
                    href={`/fields/${question.category.fieldId}/categories/${question.categoryId}`}
                    className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md font-medium hover:bg-purple-100"
                  >
                    {question.category.name}
                  </Link>
                </div>
              )}

              <Link
                href={`/questions/${question.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View full question
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No questions posted yet</p>
          <p className="text-sm text-gray-500">
            {isOwnProfile 
              ? "Start contributing by posting your first question!" 
              : `${userName} hasn't posted any questions yet.`}
          </p>
        </div>
      )}

      {totalQuestions > questions.length && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href={`/questions?userId=${userId}`}
            className="block w-full text-center bg-blue-50 text-blue-600 py-3 rounded-lg hover:bg-blue-100 font-medium transition-colors"
          >
            View all {totalQuestions} questions →
          </Link>
        </div>
      )}
    </div>
  );
}
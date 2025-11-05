// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionsEmptyState.tsx
import Link from 'next/link';

interface QuestionsEmptyStateProps {
  categoryId: string;
  user: any;
}

export default function QuestionsEmptyState({ categoryId, user }: QuestionsEmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
        <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">No Questions Yet</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Be the first to contribute! Share your interview questions and help others prepare.
      </p>
      {user ? (
        <Link
          href={`/questions/new?categoryId=${categoryId}`}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post First Question
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all font-semibold"
        >
          Login to Post
        </Link>
      )}
    </div>
  );
}
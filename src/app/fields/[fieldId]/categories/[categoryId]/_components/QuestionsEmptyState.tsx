// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionsEmptyState.tsx
import Link from 'next/link';
import { MessageCircleQuestion, Plus } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

interface QuestionsEmptyStateProps {
  categoryId: string;
  user: any;
}

export default function QuestionsEmptyState({ categoryId, user }: QuestionsEmptyStateProps) {
  return (
    <EmptyState
      icon={MessageCircleQuestion}
      title="No questions yet"
      description="Be the first to contribute! Share your interview questions and help others prepare."
      action={
        user ? (
          <Link href={`/questions/new?categoryId=${categoryId}`} className="btn-brand">
            <Plus className="w-4.5 h-4.5" />
            Post First Question
          </Link>
        ) : (
          <Link href="/login" className="btn-brand">
            Login to Post
          </Link>
        )
      }
    />
  );
}

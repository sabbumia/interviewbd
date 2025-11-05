// src/app/fields/[fieldId]/categories/[categoryId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import QuestionsHeader from './_components/QuestionsHeader';
import QuestionsEmptyState from './_components/QuestionsEmptyState';
import QuestionCard from './_components/QuestionCard';

interface Question {
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
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  fieldId: string;
}

interface Field {
  id: string;
  name: string;
}

export default function CategoryQuestionsPage() {
  const [user, setUser] = useState<any>(null);
  const [field, setField] = useState<Field | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const router = useRouter();
  const params = useParams();
  const fieldId = params.fieldId as string;
  const categoryId = params.categoryId as string;

  useEffect(() => {
    fetchUser();
    fetchCategoryData();
    fetchQuestions();
  }, [categoryId]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const fieldRes = await fetch(`/api/fields/${fieldId}`);
      if (fieldRes.ok) {
        const fieldData = await fieldRes.json();
        setField(fieldData);
        
        const categoryData = fieldData.categories.find((c: Category) => c.id === categoryId);
        if (categoryData) {
          setCategory(categoryData);
        } else {
          router.push(`/fields/${fieldId}`);
        }
      } else {
        router.push('/fields');
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      router.push('/fields');
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/questions?categoryId=${categoryId}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await fetch(`/api/questions/${questionId}`, { method: 'DELETE' });
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likeCount - a.likeCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return <Loading message='Questions Page Loading...' />;
  }

  if (!category || !field) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <QuestionsHeader
        field={field}
        category={category}
        categoryId={categoryId}
        user={user}
        questionsCount={sortedQuestions.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {questions.length === 0 ? (
          <QuestionsEmptyState categoryId={categoryId} user={user} />
        ) : (
          <div className="space-y-5">
            {sortedQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                currentUser={user}
                onDelete={handleDelete}
                onLikeToggle={fetchQuestions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
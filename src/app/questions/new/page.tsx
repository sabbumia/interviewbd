// src/app/questions/new/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PenLine } from 'lucide-react';
import Loading from '@/components/Loading';
import QuestionForm from '../_components/QuestionForm';

function NewQuestionForm() {
  const [fields, setFields] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchFields();
    const preselectedCategory = searchParams.get('categoryId');
    if (preselectedCategory) {
      setCategoryId(preselectedCategory);
      fetchCategoryField(preselectedCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedFieldId) {
      fetchCategories(selectedFieldId);
    }
  }, [selectedFieldId]);

  const fetchFields = async () => {
    try {
      const res = await fetch('/api/fields');
      const data = await res.json();
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const fetchCategoryField = async (catId: string) => {
    try {
      const res = await fetch(`/api/categories/${catId}`);
      const data = await res.json();
      setSelectedFieldId(data.fieldId);
    } catch (error) {
      console.error('Error fetching category field:', error);
    }
  };

  const fetchCategories = async (fieldId: string) => {
    try {
      const res = await fetch(`/api/categories?fieldId=${fieldId}`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText, answer, categoryId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create question');
        return;
      }

      router.push('/');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper bg-aurora">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Create New Question
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Share your interview question and answer with the community.
              </p>
            </div>
          </div>
        </div>

        <QuestionForm
          fields={fields}
          categories={categories}
          selectedFieldId={selectedFieldId}
          onFieldChange={(id) => {
            setSelectedFieldId(id);
            setCategoryId('');
          }}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          questionText={questionText}
          onQuestionTextChange={setQuestionText}
          answer={answer}
          onAnswerChange={setAnswer}
          error={error}
          submitting={loading}
          submitLabel="Post Question"
          submittingLabel="Posting…"
          onSubmit={handleSubmit}
        />

        <p className="mt-5 px-2 text-xs text-zinc-400 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <span className="text-rose-400">*</span> Required fields. Your question will be visible to
          all users once posted.
        </p>
      </div>
    </div>
  );
}

export default function NewQuestionPage() {
  return (
    <Suspense fallback={<Loading message="Loading…" />}>
      <NewQuestionForm />
    </Suspense>
  );
}

// src/app/questions/[id]/edit/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileQuestion, PencilRuler } from 'lucide-react';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import QuestionForm from '../../_components/QuestionForm';

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [fields, setFields] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFields();
    fetchQuestion();
  }, []);

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

  const fetchQuestion = async () => {
    try {
      const res = await fetch(`/api/questions/${resolvedParams.id}`);
      if (!res.ok) {
        setError('Question not found');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setQuestionText(data.questionText);
      setAnswer(data.answer);
      setCategoryId(data.categoryId);
      setSelectedFieldId(data.category.fieldId);
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to load question');
    } finally {
      setLoading(false);
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
    setSubmitting(true);

    try {
      const res = await fetch(`/api/questions/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText, answer, categoryId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update question');
        return;
      }

      router.push('/');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading question…" />;
  }

  if (error && !questionText) {
    return (
      <div className="min-h-screen bg-paper bg-aurora">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6">
          <EmptyState
            icon={FileQuestion}
            title="Question not found"
            description={error}
            action={
              <Link href="/" className="btn-primary">
                Go Back Home
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper bg-aurora">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow">
              <PencilRuler className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Edit Question
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Update your interview question and answer.
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
          error={error && questionText ? error : ''}
          submitting={submitting}
          submitLabel="Update Question"
          submittingLabel="Updating…"
          onSubmit={handleSubmit}
        />

        <p className="mt-5 px-2 text-xs text-zinc-400 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <span className="text-rose-400">*</span> Required fields. Changes will be visible
          immediately after saving.
        </p>
      </div>
    </div>
  );
}

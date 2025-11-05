// src/app/questions/[id]/edit/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/Loading';

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
    return (
      <Loading message="Loading Question..." />
    );
  }

  if (error && !questionText) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors">
              Interview Q&A
            </Link>
            <Link href="/profile" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Profile
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Question Not Found</h2>
            <p className="text-neutral-600 mb-6">{error}</p>
            <Link href="/" className="inline-block bg-neutral-900 text-white px-6 py-2.5 rounded-md font-medium hover:bg-neutral-800 transition-colors">
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Edit Question</h1>
          <p className="text-neutral-600">Update your interview question and answer</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
          {error && questionText && (
            <div className="mx-6 mt-6 bg-neutral-900 text-white px-4 py-3 rounded-md text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Field Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                Field <span className="text-neutral-400">*</span>
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => {
                  setSelectedFieldId(e.target.value);
                  setCategoryId('');
                }}
                className="w-full border border-neutral-300 rounded-md px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all bg-white"
                required
              >
                <option value="">Select a field</option>
                {fields.map(field => (
                  <option key={field.id} value={field.id}>{field.name}</option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                Category <span className="text-neutral-400">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all bg-white disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
                required
                disabled={!selectedFieldId}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {!selectedFieldId && (
                <p className="text-xs text-neutral-500">Please select a field first</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200"></div>

            {/* Question Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                Question <span className="text-neutral-400">*</span>
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                rows={2}
                required
                placeholder="e.g., What is the difference between var, let, and const in JavaScript?"
              />
              <p className="text-xs text-neutral-500">Be clear and specific with your question</p>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                Answer <span className="text-neutral-400">*</span>
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                rows={5}
                required
                placeholder="Provide a comprehensive answer with examples if applicable..."
              />
              <p className="text-xs text-neutral-500">Include detailed explanations, examples, or best practices</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-neutral-900 text-white py-3 px-6 rounded-md font-medium hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Question'
                )}
              </button>
              <Link
                href="/"
                className="px-8 bg-white border border-neutral-300 text-neutral-700 py-3 rounded-md font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Helper Text */}
        <div className="mt-6 px-4">
          <p className="text-xs text-neutral-500">
            <span className="text-neutral-400">*</span> Required fields. Changes will be visible immediately after saving.
          </p>
        </div>
      </div>
    </div>
  );
}
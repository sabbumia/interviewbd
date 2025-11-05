// src/app/questions/new/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/Loading';

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
    <div className="min-h-screen bg-neutral-50">
       {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create New Question</h1>
          <p className="text-neutral-600">Share your interview question and answer with the community</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
          {error && (
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
                disabled={loading}
                className="flex-1 bg-neutral-900 text-white py-3 px-6 rounded-md font-medium hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                {loading ? (
                  <Loading message="Posting..." />
                ) : (
                  'Post Question'
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
            <span className="text-neutral-400">*</span> Required fields. Your question will be visible to all users once posted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewQuestionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-neutral-900" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-neutral-600 font-medium">Loading...</span>
        </div>
      </div>
    }>
      <NewQuestionForm />
    </Suspense>
  );
}
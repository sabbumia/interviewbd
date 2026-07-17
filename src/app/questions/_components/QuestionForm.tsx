// src/app/questions/_components/QuestionForm.tsx
'use client';

import Link from 'next/link';
import {
  AlertCircle,
  ChevronDown,
  FileText,
  Layers,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
} from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface QuestionFormProps {
  fields: Option[];
  categories: Option[];
  selectedFieldId: string;
  onFieldChange: (id: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  questionText: string;
  onQuestionTextChange: (value: string) => void;
  answer: string;
  onAnswerChange: (value: string) => void;
  error: string;
  submitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (e: React.FormEvent) => void;
}

/** Shared form used by the create and edit question pages. */
export default function QuestionForm({
  fields,
  categories,
  selectedFieldId,
  onFieldChange,
  categoryId,
  onCategoryChange,
  questionText,
  onQuestionTextChange,
  answer,
  onAnswerChange,
  error,
  submitting,
  submitLabel,
  submittingLabel,
  onSubmit,
}: QuestionFormProps) {
  return (
    <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '80ms' }}>
      {error && (
        <div className="mx-6 mt-6 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-7">
        {/* Placement */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="question-field" className="field-label flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-500" />
              Field <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                id="question-field"
                value={selectedFieldId}
                onChange={(e) => onFieldChange(e.target.value)}
                className="field-input appearance-none pr-10 cursor-pointer"
                required
              >
                <option value="">Select a field</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="question-category" className="field-label flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-500" />
              Category <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                id="question-category"
                value={categoryId}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="field-input appearance-none pr-10 cursor-pointer disabled:bg-zinc-50 disabled:cursor-not-allowed"
                required
                disabled={!selectedFieldId}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
            {!selectedFieldId && (
              <p className="mt-1.5 text-xs text-zinc-400">Please select a field first</p>
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-zinc-200" />

        {/* Question */}
        <div>
          <label htmlFor="question-text" className="field-label flex items-center gap-1.5">
            <MessageCircleQuestion className="w-4 h-4 text-brand-500" />
            Question <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="question-text"
            value={questionText}
            onChange={(e) => onQuestionTextChange(e.target.value)}
            className="field-input resize-none leading-relaxed"
            rows={3}
            required
            placeholder="e.g., What is the difference between var, let, and const in JavaScript?"
          />
          <p className="mt-1.5 text-xs text-zinc-400">Be clear and specific with your question.</p>
        </div>

        {/* Answer */}
        <div>
          <label htmlFor="question-answer" className="field-label flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-brand-500" />
            Answer <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="question-answer"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="field-input resize-none leading-relaxed"
            rows={7}
            required
            placeholder="Provide a comprehensive answer with examples if applicable…"
          />
          <p className="mt-1.5 text-xs text-zinc-400">
            Include detailed explanations, examples, or best practices.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Link href="/" className="btn-secondary justify-center sm:w-32">
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className="btn-brand flex-1 py-3">
            {submitting ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                {submittingLabel}
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

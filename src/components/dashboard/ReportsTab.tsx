// src/components/dashboard/ReportsTab.tsx
'use client';

import { useState } from 'react';
import {
  Flag,
  Trash2,
  Check,
  AlertTriangle,
  User as UserIcon,
  Tag,
  MessageSquare,
  Clock,
  Users,
  ChevronDown,
  X,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import TabHeader from './TabHeader';
import StatCard from './StatCard';
import { Report } from './types';

interface ReportsTabProps {
  reports: Report[];
  onReportAction: (reportId: string, action: string) => void;
}

export default function ReportsTab({ reports, onReportAction }: ReportsTabProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ reportId: string; action: string } | null>(null);

  const uniqueQuestions = new Set(reports.map((r) => r.questionId)).size;
  const uniqueReporters = new Set(reports.map((r) => r.reportedByUserId)).size;

  const executeAction = () => {
    if (confirmAction) {
      onReportAction(confirmAction.reportId, confirmAction.action);
      setConfirmAction(null);
      setSelectedReport(null);
    }
  };

  return (
    <div className="space-y-8">
      <TabHeader
        icon={Flag}
        iconClass="bg-rose-50 text-rose-600 border-rose-100"
        title="Content Reports"
        description="Review and manage reported content from users"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <StatCard
          icon={AlertTriangle}
          accent="bg-rose-50 text-rose-600 border-rose-100"
          value={reports.length}
          label="Pending Reports"
        />
        <StatCard
          icon={MessageSquare}
          accent="bg-brand-50 text-brand-600 border-brand-100"
          value={uniqueQuestions}
          label="Questions Flagged"
        />
        <StatCard
          icon={Users}
          accent="bg-amber-50 text-amber-600 border-amber-100"
          value={uniqueReporters}
          label="Unique Reporters"
        />
      </div>

      {/* Reports list */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-ink">Pending Reports</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {reports.length} {reports.length === 1 ? 'report' : 'reports'} requiring action
              </p>
            </div>
          </div>
          <span className="chip-rose">
            <Flag className="w-3.5 h-3.5" />
            {reports.length} Pending
          </span>
        </div>

        <div className="p-5 sm:p-6">
          {reports.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-semibold text-zinc-500">No pending reports</p>
              <p className="text-sm text-zinc-400 mt-1">All reports have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => {
                const isExpanded = selectedReport?.id === report.id;

                return (
                  <div
                    key={report.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isExpanded
                        ? 'border-rose-200 shadow-card'
                        : 'border-zinc-200/80 hover:border-rose-200/80 hover:shadow-soft'
                    }`}
                  >
                    {/* Report header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                            <Flag className="w-4.5 h-4.5 text-rose-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="chip-rose">
                                <AlertTriangle className="w-3 h-3" />
                                Reported Content
                              </span>
                              <span className="text-sm text-zinc-500 font-medium">
                                by {report.reportedByUser.name}
                              </span>
                            </div>
                            <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <Clock className="w-3.5 h-3.5" />
                              Reported{' '}
                              {new Date(report.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedReport(isExpanded ? null : report)}
                          aria-expanded={isExpanded}
                          className="btn-ghost shrink-0"
                        >
                          {isExpanded ? 'Close' : 'Review'}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Collapsed preview */}
                      {!isExpanded && (
                        <div className="px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                          <p className="text-sm font-semibold text-ink mb-1 line-clamp-2">
                            {report.question.questionText}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {report.question.user.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {report.question.category.name}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="space-y-4 animate-fade-in">
                          {/* Question details */}
                          <div className="rounded-2xl bg-brand-50/50 border border-brand-100 p-5 space-y-3">
                            <h4 className="flex items-center gap-2 font-display font-bold text-ink text-sm">
                              <MessageSquare className="w-4 h-4 text-brand-600" />
                              Question Details
                            </h4>

                            <div className="rounded-xl bg-white border border-brand-100/70 p-4">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                Posted By
                              </p>
                              <div className="flex items-center gap-2.5">
                                <Avatar
                                  src={report.question.user.profilePicture}
                                  name={report.question.user.name}
                                  size={34}
                                  verified={report.question.user.isVerified}
                                />
                                <span className="text-sm font-bold text-ink">
                                  {report.question.user.name}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-xl bg-white border border-brand-100/70 p-4">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                Category
                              </p>
                              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                                <Tag className="w-4 h-4 text-brand-600" />
                                {report.question.category.field?.name} › {report.question.category.name}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white border border-brand-100/70 p-4">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                Question
                              </p>
                              <p className="text-sm text-ink leading-relaxed">{report.question.questionText}</p>
                            </div>

                            <div className="rounded-xl bg-white border border-brand-100/70 p-4">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                Answer
                              </p>
                              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                                {report.question.answer}
                              </p>
                            </div>
                          </div>

                          {/* Report reason */}
                          <div className="rounded-2xl bg-rose-50/60 border border-rose-100 p-5">
                            <h4 className="flex items-center gap-2 font-display font-bold text-rose-800 text-sm mb-3">
                              <AlertTriangle className="w-4 h-4" />
                              Report Reason
                            </h4>
                            <div className="rounded-xl bg-white border border-rose-100 p-4 mb-3">
                              <p className="text-sm text-ink leading-relaxed">{report.reason}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                              <Avatar
                                src={report.reportedByUser.profilePicture}
                                name={report.reportedByUser.name}
                                size={24}
                              />
                              Reported by {report.reportedByUser.name}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                            <button
                              onClick={() => setConfirmAction({ reportId: report.id, action: 'delete_question' })}
                              className="btn-danger flex-1"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                              Delete Question
                            </button>
                            <button
                              onClick={() => setConfirmAction({ reportId: report.id, action: 'dismiss' })}
                              className="btn-primary flex-1"
                            >
                              <Check className="w-4.5 h-4.5" />
                              Dismiss Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setConfirmAction(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="card max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                    confirmAction.action === 'delete_question'
                      ? 'bg-rose-50 border-rose-100'
                      : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  {confirmAction.action === 'delete_question' ? (
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  ) : (
                    <Check className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {confirmAction.action === 'delete_question' ? 'Delete Question?' : 'Dismiss Report?'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {confirmAction.action === 'delete_question'
                      ? 'This action cannot be undone'
                      : 'The report will be marked as resolved'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmAction(null)}
                aria-label="Close"
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`rounded-xl p-4 mb-5 border text-sm leading-relaxed ${
                confirmAction.action === 'delete_question'
                  ? 'bg-rose-50/70 border-rose-100 text-rose-800'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600'
              }`}
            >
              {confirmAction.action === 'delete_question'
                ? 'The question and all associated data will be permanently deleted from the platform.'
                : 'The report will be dismissed and no further action will be taken on this content.'}
            </div>

            <div className="flex gap-3">
              <button
                onClick={executeAction}
                className={confirmAction.action === 'delete_question' ? 'btn-danger flex-1' : 'btn-primary flex-1'}
              >
                {confirmAction.action === 'delete_question' ? 'Delete Permanently' : 'Dismiss Report'}
              </button>
              <button onClick={() => setConfirmAction(null)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

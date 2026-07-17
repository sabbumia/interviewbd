// src/components/dashboard/VerificationsTab.tsx
'use client';

import { useState } from 'react';
import {
  BadgeCheck,
  Check,
  X,
  Clock,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  ExternalLink,
  Mail,
  ChevronDown,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import TabHeader from './TabHeader';
import StatCard from './StatCard';
import { VerificationRequest } from './types';

interface VerificationsTabProps {
  verificationRequests: VerificationRequest[];
  onVerificationAction: (requestId: string, action: string, rejectionReason?: string) => void;
}

const DETAIL_ROWS = [
  { key: 'university', icon: GraduationCap, accent: 'bg-violet-50 border-violet-100 text-violet-600', label: 'University' },
  { key: 'workStatus', icon: Briefcase, accent: 'bg-sky-50 border-sky-100 text-sky-600', label: 'Work Status' },
  { key: 'location', icon: MapPin, accent: 'bg-emerald-50 border-emerald-100 text-emerald-600', label: 'Location' },
  { key: 'mobileNumber', icon: Phone, accent: 'bg-amber-50 border-amber-100 text-amber-600', label: 'Mobile Number' },
] as const;

export default function VerificationsTab({
  verificationRequests,
  onVerificationAction,
}: VerificationsTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const pendingRequests = verificationRequests.filter((r) => r.status === 'pending');
  const approvedRequests = verificationRequests.filter((r) => r.status === 'approved');

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    if (selectedRequest) {
      onVerificationAction(selectedRequest.id, 'reject', rejectionReason);
      setSelectedRequest(null);
      setShowRejectionModal(false);
      setRejectionReason('');
    }
  };

  return (
    <div className="space-y-8">
      <TabHeader
        icon={BadgeCheck}
        iconClass="bg-brand-50 text-brand-600 border-brand-100"
        title="Verification Requests"
        description="Review and approve user verification applications"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <StatCard
          icon={Clock}
          accent="bg-orange-50 text-orange-600 border-orange-100"
          value={pendingRequests.length}
          label="Pending Reviews"
        />
        <StatCard
          icon={BadgeCheck}
          accent="bg-emerald-50 text-emerald-600 border-emerald-100"
          value={approvedRequests.length}
          label="Verified Users"
        />
        <StatCard
          icon={Award}
          accent="bg-brand-50 text-brand-600 border-brand-100"
          value={verificationRequests.length}
          label="Total Requests"
        />
      </div>

      {/* Pending requests */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-ink">Pending Requests</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {pendingRequests.length} {pendingRequests.length === 1 ? 'request' : 'requests'} awaiting review
              </p>
            </div>
          </div>
          <span className="chip-amber">{pendingRequests.length} Pending</span>
        </div>

        <div className="p-5 sm:p-6">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-semibold text-zinc-500">No pending verification requests</p>
              <p className="text-sm text-zinc-400 mt-1">All requests have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const isExpanded = selectedRequest?.id === request.id;

                return (
                  <div
                    key={request.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isExpanded
                        ? 'border-brand-200 shadow-card'
                        : 'border-zinc-200/80 hover:border-brand-200/80 hover:shadow-soft'
                    }`}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <Avatar src={request.user.profilePicture} name={request.user.name} size={52} />
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-ink">{request.user.name}</h4>
                            <p className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              {request.user.email}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              Submitted{' '}
                              {new Date(request.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="chip-amber">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                          <button
                            onClick={() => setSelectedRequest(isExpanded ? null : request)}
                            aria-expanded={isExpanded}
                            className="btn-ghost"
                          >
                            {isExpanded ? 'Close' : 'Review'}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-4 animate-fade-in">
                          <div className="rounded-2xl bg-zinc-50/80 border border-zinc-100 p-5">
                            <h5 className="flex items-center gap-2 font-display font-bold text-ink text-sm mb-4">
                              <BadgeCheck className="w-4 h-4 text-brand-600" />
                              Verification Information
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {DETAIL_ROWS.map((row) => {
                                const Icon = row.icon;
                                return (
                                  <div key={row.key} className="flex items-start gap-3">
                                    <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${row.accent}`}>
                                      <Icon className="w-4.5 h-4.5" />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                                        {row.label}
                                      </p>
                                      <p className="text-sm font-semibold text-ink capitalize">
                                        {String(request[row.key]).replace('_', ' ')}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Social links */}
                          {request.socialMediaLinks &&
                            (request.socialMediaLinks.linkedin ||
                              request.socialMediaLinks.twitter ||
                              request.socialMediaLinks.github) && (
                              <div className="rounded-2xl bg-brand-50/50 border border-brand-100 p-5">
                                <h5 className="flex items-center gap-2 font-display font-bold text-ink text-sm mb-3">
                                  <ExternalLink className="w-4 h-4 text-brand-600" />
                                  Social Media Profiles
                                </h5>
                                <div className="flex flex-wrap gap-2.5">
                                  {request.socialMediaLinks.linkedin && (
                                    <a
                                      href={request.socialMediaLinks.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-sky-200 text-sm font-semibold text-sky-700
                                        hover:bg-sky-50 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                      <Linkedin className="w-4 h-4" />
                                      LinkedIn
                                    </a>
                                  )}
                                  {request.socialMediaLinks.twitter && (
                                    <a
                                      href={request.socialMediaLinks.twitter}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-semibold text-zinc-700
                                        hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                      <Twitter className="w-4 h-4" />
                                      Twitter
                                    </a>
                                  )}
                                  {request.socialMediaLinks.github && (
                                    <a
                                      href={request.socialMediaLinks.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-semibold text-zinc-700
                                        hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                      <Github className="w-4 h-4" />
                                      GitHub
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                            <button
                              onClick={() => onVerificationAction(request.id, 'approve')}
                              className="btn flex-1 bg-emerald-600 text-white px-5 py-2.5 text-sm hover:bg-emerald-700 hover:-translate-y-0.5 shadow-card"
                            >
                              <Check className="w-4.5 h-4.5" />
                              Approve & Verify User
                            </button>
                            <button
                              onClick={() => {
                                setShowRejectionModal(true);
                                setRejectionReason('');
                              }}
                              className="btn-danger flex-1"
                            >
                              <X className="w-4.5 h-4.5" />
                              Reject Request
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

      {/* Approved requests */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-ink">Verified Users</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {approvedRequests.length} {approvedRequests.length === 1 ? 'user has' : 'users have'} been verified
              </p>
            </div>
          </div>
          <span className="chip-emerald">{approvedRequests.length} Verified</span>
        </div>

        <div className="p-5 sm:p-6">
          {approvedRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-zinc-300" />
              </div>
              <p className="font-semibold text-zinc-500">No verified users yet</p>
              <p className="text-sm text-zinc-400 mt-1">Approved verifications will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {approvedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100
                    transition-all duration-300 hover:border-emerald-200 hover:shadow-soft"
                >
                  <Avatar
                    src={request.user.profilePicture}
                    name={request.user.name}
                    size={44}
                    verified
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink text-sm truncate">{request.user.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {request.reviewedAt
                        ? new Date(request.reviewedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <span className="chip-emerald shrink-0">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection modal */}
      {showRejectionModal && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowRejectionModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="card max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Reject Verification</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Provide a reason for rejection</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                aria-label="Close"
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter a clear and constructive reason for rejection…"
              className="field-input h-32 resize-none mb-5"
              required
            />

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="btn-danger flex-1"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// src/app/profile/_components/PendingVerificationBanner.tsx
import { Clock } from 'lucide-react';

interface VerificationRequest {
  createdAt: string;
}

interface PendingVerificationBannerProps {
  verificationRequest: VerificationRequest;
}

export default function PendingVerificationBanner({
  verificationRequest,
}: PendingVerificationBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-5 sm:p-6 mb-6 animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-white border border-amber-200 flex items-center justify-center shrink-0 shadow-soft">
          <Clock className="w-5 h-5 text-amber-600 animate-pulse-soft" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-amber-900 mb-1">Verification Pending</h3>
          <p className="text-sm text-amber-800/90 leading-relaxed mb-2">
            Your verification request has been submitted and is awaiting admin review.
          </p>
          <p className="text-xs font-semibold text-amber-700">
            Submitted on{' '}
            {new Date(verificationRequest.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

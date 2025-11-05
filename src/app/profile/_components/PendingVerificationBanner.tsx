// src/app/profile/_components/PendingVerificationBanner.tsx
import { Clock } from 'lucide-react';

interface VerificationRequest {
  createdAt: string;
}

interface PendingVerificationBannerProps {
  verificationRequest: VerificationRequest;
}

export default function PendingVerificationBanner({ verificationRequest }: PendingVerificationBannerProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-1">Verification Pending</h3>
          <p className="text-sm text-yellow-800 mb-2">
            Your verification request has been submitted and is awaiting admin review.
          </p>
          <p className="text-xs text-yellow-700">
            Submitted on: {new Date(verificationRequest.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
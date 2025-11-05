// src/app/profile/_components/VerifiedInfoCard.tsx
import { CheckCircle, GraduationCap, Briefcase, MapPin, Phone, ExternalLink } from 'lucide-react';

interface VerifiedInfoCardProps {
  verificationDetails: {
    university: string;
    workStatus: string;
    location: string;
    mobileNumber: string;
    socialMediaLinks?: {
      linkedin?: string;
      github?: string;
    };
  };
}

export default function VerifiedInfoCard({ verificationDetails }: VerifiedInfoCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Verified Information</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">University</p>
            <p className="text-sm font-medium text-gray-900">{verificationDetails.university}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Work Status</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {verificationDetails.workStatus.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm font-medium text-gray-900">{verificationDetails.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Mobile</p>
            <p className="text-sm font-medium text-gray-900">{verificationDetails.mobileNumber}</p>
          </div>
        </div>

        {(verificationDetails.socialMediaLinks?.linkedin || verificationDetails.socialMediaLinks?.github) && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Social Links</p>
            </div>
            <div className="space-y-1">
              {verificationDetails.socialMediaLinks.linkedin && (
                <a href={verificationDetails.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                  LinkedIn →
                </a>
              )}
              {verificationDetails.socialMediaLinks.github && (
                <a href={verificationDetails.socialMediaLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                  GitHub →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
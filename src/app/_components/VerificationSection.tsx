// app/_components/VerificationSection.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle } from 'lucide-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface VerificationSectionProps {
  currentUser: CurrentUser | null;
}

export default function VerificationSection({ currentUser }: VerificationSectionProps) {
  const router = useRouter();

  // Only show if user is logged in and not verified
  if (!currentUser || currentUser.isVerified) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Get Verified</h2>
            </div>
            <p className="text-lg text-indigo-100 mb-6">
              Stand out from the crowd with a blue verification badge. Submit your verification 
              request and our team will review it within 24-48 hours.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Increase your credibility',
                'Gain trust from the community',
                'Unlock exclusive features',
                'Priority in search results'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => router.push('/profile?tab=verification')}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Apply for Verification
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
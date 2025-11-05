// app/_components/CTASection.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Heart, ArrowRight, User, MessageSquare } from 'lucide-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface CTASectionProps {
  currentUser: CurrentUser | null;
}

export default function CTASection({ currentUser }: CTASectionProps) {
  const router = useRouter();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 mb-6">
          <Heart className="w-4 h-4" />
          Join Our Growing Community
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          Join thousands of professionals preparing for their dream careers
        </p>
        
        {/* Different CTAs based on login status */}
        {currentUser ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/profile')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              View My Profile
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => router.push('/messages')}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              My Messages
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/signup')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => router.push('/fields')}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              Browse Questions
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
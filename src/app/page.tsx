// src/app/page.tsx

'use client';
import { useState, useEffect } from 'react';
import HeroSection from './_components/HeroSection';
import FieldsSection from './_components/FieldsSection';
import TopContributorsSection from './_components/TopContributorsSection';
import TopLikedUsersSection from './_components/TopLikedUsersSection';
import FeaturesSection from './_components/FeaturesSection';
import BadgeSystemSection from './_components/BadgeSystemSection';
import HowItWorksSection from './_components/HowItWorksSection';
import VerificationSection from './_components/VerificationSection';
import CTASection from './_components/CTASection';
import Loading from '@/components/Loading';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  role: string;
  questionCount: number;
  likeCount?: number;
}

interface Field {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

interface Stats {
  totalUsers: number;
  totalQuestions: number;
  totalFields: number;
  totalCategories: number;
}

interface HomepageData {
  stats: Stats;
  topFields: Field[];
  topQuestionUsers: User[];
  topLikedUsers: User[];
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export default function Homepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    questions: 0,
    fields: 0,
    categories: 0
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      animateStats();
    }
  }, [data]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const result = await res.json();
        setCurrentUser(result.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/stats/homepage');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    if (!data) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedStats({
        users: Math.floor((data.stats.totalUsers / steps) * step),
        questions: Math.floor((data.stats.totalQuestions / steps) * step),
        fields: Math.floor((data.stats.totalFields / steps) * step),
        categories: Math.floor((data.stats.totalCategories / steps) * step)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  };

  if (loading) {
    return (
      <Loading message="Loading homepage..." />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 1. Hero Section */}
      <HeroSection currentUser={currentUser} animatedStats={animatedStats} />

      {/* 2. Fields Section */}
      {data && <FieldsSection fields={data.topFields} />}

      {/* 3. Top Contributors Section */}
      {data && <TopContributorsSection users={data.topQuestionUsers} />}

      {/* 4. Top Liked Users Section */}
      {data && <TopLikedUsersSection users={data.topLikedUsers} />}

      {/* 5. Features Section */}
      <FeaturesSection />

      {/* 6. Badge System Section */}
      <BadgeSystemSection />

      {/* 7. How It Works Section */}
      <HowItWorksSection />

      {/* 8. Verification Section (Conditional) */}
      <VerificationSection currentUser={currentUser} />

      {/* 9. CTA Section */}
      <CTASection currentUser={currentUser} />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
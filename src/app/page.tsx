// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Trophy, Heart } from 'lucide-react';
import HeroSection from './_components/HeroSection';
import FieldsSection from './_components/FieldsSection';
import TopUsersSection from './_components/TopUsersSection';
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
    categories: 0,
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

  // Eased count-up for hero stats
  useEffect(() => {
    if (!data) return;

    const duration = 1600;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedStats({
        users: Math.round(data.stats.totalUsers * eased),
        questions: Math.round(data.stats.totalQuestions * eased),
        fields: Math.round(data.stats.totalFields * eased),
        categories: Math.round(data.stats.totalCategories * eased),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

  if (loading) {
    return <Loading message="Preparing your experience…" />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <HeroSection currentUser={currentUser} animatedStats={animatedStats} />

      {data && <FieldsSection fields={data.topFields} />}

      {data && (
        <TopUsersSection
          users={data.topQuestionUsers}
          eyebrow="Top Contributors"
          eyebrowIcon={Trophy}
          accent="amber"
          title="Most Active Question Posters"
          subtitle="Celebrating our community's most dedicated contributors"
          metric="questions"
        />
      )}

      {data && (
        <TopUsersSection
          users={data.topLikedUsers}
          eyebrow="Most Appreciated"
          eyebrowIcon={Heart}
          accent="rose"
          title="Top Liked Contributors"
          subtitle="Users whose questions received the most love from the community"
          metric="likes"
        />
      )}

      <FeaturesSection />
      <BadgeSystemSection />
      <HowItWorksSection />
      <VerificationSection currentUser={currentUser} />
      <CTASection currentUser={currentUser} />
    </div>
  );
}

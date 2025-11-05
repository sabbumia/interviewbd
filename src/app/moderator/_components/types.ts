// src/app/admin/_components/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  questionCount?: number;
}

export interface Badge {
  emoji: string;
  name: string;
  minQuestions: number;
  maxQuestions: number;
}

export interface Analytics {
  totalUsers: number;
  verifiedUsers: number;
  totalQuestions: number;
  totalLikes: number;
  totalFields: number;
  totalCategories: number;
  pendingReports: number;
  topContributors: Array<{
    userId: string;
    questionCount: number;
    totalLikes: number;
    user: User;
  }>;
}

export interface Field {
  id: string;
  name: string;
  description?: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  fieldId: string;
  field?: Field;
}

export interface Question {
  id: string;
  questionText: string;
  answer: string;
  userId: string;
  categoryId: string;
  user: User;
  category: Category;
}

export interface Report {
  id: string;
  reason: string;
  createdAt: string;
  questionId: string;
  reportedByUserId: string;
  reportedByUser: User;
  question: Question;
}

export interface VerificationRequest {
  id: string;
  status: string;
  university: string;
  workStatus: string;
  location: string;
  mobileNumber: string;
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt: string;
  reviewedAt?: string;
  userId: string;
  user: User;
}

export const badges: Badge[] = [
  { emoji: '🐣', name: 'Newbie', minQuestions: 1, maxQuestions: 4 },
  { emoji: '🌱', name: 'Curious', minQuestions: 5, maxQuestions: 9 },
  { emoji: '🔍', name: 'Seeker', minQuestions: 10, maxQuestions: 19 },
  { emoji: '💡', name: 'Inquirer', minQuestions: 20, maxQuestions: 49 },
  { emoji: '🔥', name: 'Pro Questioner', minQuestions: 50, maxQuestions: 99 },
  { emoji: '🧠', name: 'Expert Inquirer', minQuestions: 100, maxQuestions: 199 },
  { emoji: '🌟', name: 'Legendary Asker', minQuestions: 200, maxQuestions: Infinity },
];

export const getBadge = (questionCount: number): Badge | null => {
  if (questionCount === 0) return null;
  return badges.find(badge => questionCount >= badge.minQuestions && questionCount <= badge.maxQuestions) || null;
};
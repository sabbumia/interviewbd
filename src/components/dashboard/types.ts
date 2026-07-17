// src/components/dashboard/types.ts
// Shared types for the admin/moderator dashboards.
export { getBadge } from '@/lib/badges';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture?: string;
  questionCount?: number;
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

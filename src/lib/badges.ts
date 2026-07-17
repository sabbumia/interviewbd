// src/lib/badges.ts

export interface Badge {
  emoji: string;
  name: string;
  minQuestions: number;
  maxQuestions: number;
  description: string;
}

export const badges: Badge[] = [
  {
    emoji: '🐣',
    name: 'Newbie',
    minQuestions: 1,
    maxQuestions: 4,
    description: 'Just getting started asking questions',
  },
  {
    emoji: '🌱',
    name: 'Curious',
    minQuestions: 5,
    maxQuestions: 9,
    description: 'Showing curiosity and participation',
  },
  {
    emoji: '🔍',
    name: 'Seeker',
    minQuestions: 10,
    maxQuestions: 19,
    description: 'Actively engaging with the community',
  },
  {
    emoji: '💡',
    name: 'Inquirer',
    minQuestions: 20,
    maxQuestions: 49,
    description: 'Contributing thoughtful questions',
  },
  {
    emoji: '🔥',
    name: 'Pro Questioner',
    minQuestions: 50,
    maxQuestions: 99,
    description: 'Highly active participant',
  },
  {
    emoji: '🧠',
    name: 'Expert Inquirer',
    minQuestions: 100,
    maxQuestions: 199,
    description: 'Known for deep and frequent contributions',
  },
  {
    emoji: '🌟',
    name: 'Legendary Asker',
    minQuestions: 200,
    maxQuestions: Infinity,
    description: 'A top-tier community member',
  },
];

export function getBadge(questionCount: number): Badge | null {
  if (questionCount === 0) return null;
  
  return badges.find(
    badge => questionCount >= badge.minQuestions && questionCount <= badge.maxQuestions
  ) || null;
}

export function getNextBadge(questionCount: number): Badge | null {
  const currentBadgeIndex = badges.findIndex(
    badge => questionCount >= badge.minQuestions && questionCount <= badge.maxQuestions
  );
  
  if (currentBadgeIndex === -1 || currentBadgeIndex === badges.length - 1) {
    return null;
  }
  
  return badges[currentBadgeIndex + 1];
}
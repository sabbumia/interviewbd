// app/_components/HeroSection.tsx
"use client";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Users,
  BookOpen,
  Layers,
  Sparkles,
  Search,
  Plus,
} from "lucide-react";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface Stats {
  users: number;
  questions: number;
  fields: number;
  categories: number;
}

interface HeroSectionProps {
  currentUser: CurrentUser | null;
  animatedStats: Stats;
}

export default function HeroSection({
  currentUser,
  animatedStats,
}: HeroSectionProps) {
  const router = useRouter();

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-6">
          <Sparkles className="w-4 h-4" />
          Welcome to InterviewBD
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Master Your
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {" "}
            Interview{" "}
          </span>
          Skills
        </h1>

        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xl md:text-2xl text-gray-600 italic font-light leading-relaxed">
            "From every question, from every answer — knowledge takes its first
            breath."
          </p>
        </div>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Practice with thousands of interview questions, connect with
          professionals, and elevate your career preparation
        </p>

        {/* Different CTAs based on login status */}
        {currentUser ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/fields")}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Questions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/questions/new")}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
            <button
              onClick={() => router.push("/users")}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Network
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/signup")}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/fields")}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              Explore Questions
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            {
              label: "Active Users",
              value: animatedStats.users.toLocaleString(),
              icon: Users,
              color: "emerald" as const,
            },
            {
              label: "Questions",
              value: animatedStats.questions.toLocaleString(),
              icon: BookOpen,
              color: "blue" as const,
            },
            {
              label: "Fields",
              value: animatedStats.fields,
              icon: Layers,
              color: "purple" as const,
            },
            {
              label: "Categories",
              value: animatedStats.categories,
              icon: Sparkles,
              color: "rose" as const,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const colorClasses: Record<typeof stat.color, string> = {
              emerald: "text-emerald-600",
              blue: "text-blue-600",
              purple: "text-purple-600",
              rose: "text-rose-600",
            };
            return (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <Icon
                  className={`w-8 h-8 ${colorClasses[stat.color]} mb-2 mx-auto`}
                />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// app/_components/FeaturesSection.tsx
import { BookOpen, Users, Trophy, MessageSquare, Shield, TrendingUp } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Question Bank',
      description: 'Access thousands of curated interview questions across multiple industries and difficulty levels',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with industry professionals, share experiences, and build meaningful relationships',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges and recognition for your contributions and track your progress',
      color: 'from-orange-600 to-amber-600'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Communication',
      description: 'Instant messaging system to collaborate and share knowledge with peers',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Build credibility with verified badges and stand out in the community',
      color: 'from-rose-600 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Monitor your learning journey with detailed insights and performance metrics',
      color: 'from-violet-600 to-purple-600'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose InterviewBD?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in your interviews, all in one platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-indigo-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
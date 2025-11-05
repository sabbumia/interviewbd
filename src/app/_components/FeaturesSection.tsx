// app/_components/FeaturesSection.tsx
import { BookOpen, Users, Award, MessageSquare, Shield, TrendingUp } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Diverse Question Bank',
      description: 'Access thousands of interview questions across multiple fields and categories'
    },
    {
      icon: Users,
      title: 'Connect & Network',
      description: 'Build connections with professionals and learners in your field'
    },
    {
      icon: Award,
      title: 'Earn Badges',
      description: 'Get recognized for your contributions with achievement badges'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Messaging',
      description: 'Chat with other users and share knowledge instantly'
    },
    {
      icon: Shield,
      title: 'Verified Accounts',
      description: 'Get the blue verification badge and build credibility'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey and see your growth over time'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose InterviewBD?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to ace your interviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
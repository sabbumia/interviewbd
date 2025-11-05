// app/_components/HowItWorksSection.tsx
import { Users, Target, Zap } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: Users,
      title: 'Create Account',
      description: 'Sign up for free and set up your profile with your interests'
    },
    {
      step: '02',
      icon: Target,
      title: 'Choose Your Field',
      description: 'Browse through various fields and select categories you want to practice'
    },
    {
      step: '03',
      icon: Zap,
      title: 'Start Practicing',
      description: 'Post questions, answer others, and earn badges as you grow'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent"></div>
                )}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative z-10">
                  <div className="text-6xl font-bold text-indigo-100 mb-4">{step.step}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
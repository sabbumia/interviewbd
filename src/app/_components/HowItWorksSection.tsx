// app/_components/HowItWorksSection.tsx
import { Users, Target, Zap } from 'lucide-react';

export default function HowItWorksSection() {
    const steps = [
    {
      step: '01',
      icon: Users,
      title: 'Create Your Account',
      description: 'Sign up in seconds and build your professional profile to start your journey',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      step: '02',
      icon: Target,
      title: 'Choose Your Field',
      description: 'Browse through specialized fields and select categories that match your career goals',
      color: 'from-purple-600 to-pink-600'
    },
    {
      step: '03',
      icon: Zap,
      title: 'Start Practicing',
      description: 'Access questions, contribute answers, and earn recognition badges as you grow',
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps and transform your interview preparation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-1 bg-gradient-to-r from-indigo-200 to-transparent z-0"></div>
                )}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative z-10 hover:shadow-2xl transition-all duration-300 group">
                  <div className={`text-7xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform`}>
                    {step.step}
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
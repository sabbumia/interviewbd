// app/_components/FieldsSection.tsx
'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Code, Brain, GraduationCap, Briefcase, Layers } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

interface FieldsSectionProps {
  fields: Field[];
}

export default function FieldsSection({ fields }: FieldsSectionProps) {
  const router = useRouter();

  const getFieldIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('web') || lowerName.includes('development')) return Code;
    if (lowerName.includes('machine') || lowerName.includes('learning') || lowerName.includes('ai')) return Brain;
    if (lowerName.includes('teach') || lowerName.includes('education')) return GraduationCap;
    if (lowerName.includes('business') || lowerName.includes('admin')) return Briefcase;
    return Layers;
  };

  const getFieldColor = (index: number) => {
    const colors = [
      'from-blue-600 to-indigo-600',
      'from-violet-600 to-purple-600',
      'from-emerald-600 to-teal-600',
      'from-orange-600 to-amber-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Fields
          </h2>
          <p className="text-lg text-gray-600">
            Explore our most active fields based on question count
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fields.map((field, i) => {
            const Icon = getFieldIcon(field.name);
            const color = getFieldColor(i);
            return (
              <div
                key={field.id}
                onClick={() => router.push(`/fields/${field.id}`)}
                className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{field.name}</h3>
                <p className="text-gray-600 mb-4">{field.questionCount} Questions</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
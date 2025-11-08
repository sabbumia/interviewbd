// app/_components/FieldsSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Code, Brain, GraduationCap, Briefcase, Layers, TrendingUp } from 'lucide-react';
import { useState } from 'react';

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      { gradient: 'from-blue-600 to-indigo-600', light: 'bg-blue-50', border: 'border-blue-200' },
      { gradient: 'from-violet-600 to-purple-600', light: 'bg-violet-50', border: 'border-violet-200' },
      { gradient: 'from-emerald-600 to-teal-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
      { gradient: 'from-orange-600 to-amber-600', light: 'bg-orange-50', border: 'border-orange-200' }
    ];
    return colors[index % colors.length];
  };

  const formatQuestionCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleFieldClick = (fieldId: string) => {
    router.push(`/fields/${fieldId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFieldClick(fieldId);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Most Popular</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore by Field
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover knowledge across diverse domains with thousands of questions from experts worldwide
          </p>
        </div>

        {/* Fields Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fields.map((field, i) => {
            const Icon = getFieldIcon(field.name);
            const colors = getFieldColor(i);
            const isHovered = hoveredCard === field.id;

            return (
              <div
                key={field.id}
                onClick={() => handleFieldClick(field.id)}
                onKeyDown={(e) => handleKeyDown(e, field.id)}
                onMouseEnter={() => setHoveredCard(field.id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${field.name} with ${field.questionCount} questions`}
                className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                {/* Background Gradient Effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  aria-hidden="true"
                />

                {/* Icon Container */}
                <div 
                  className={`relative w-14 h-14 bg-gradient-to-br from-blue-500 to-gray-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {field.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {field.description || 'Explore questions and answers in this field'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 ${colors.light} rounded-lg`}>
                      <span className="text-sm font-bold text-gray-900">
                        {formatQuestionCount(field.questionCount)}
                      </span>
                      <span className="text-xs text-gray-600 ml-1">questions</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Explore Field</span>
                    <ArrowRight 
                      className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                        isHovered ? 'translate-x-1' : ''
                      }`} 
                    />
                  </div>
                </div>

                {/* Hover Border Animation */}
                <div 
                  className={`absolute inset-0 rounded-2xl border-2 ${colors.border} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-16">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No fields available</h3>
            <p className="text-gray-600">Check back soon for new fields to explore</p>
          </div>
        )}
      </div>
    </section>
  );
}
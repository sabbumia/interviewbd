// app/_components/FieldsSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Code, Brain, GraduationCap, Briefcase, Layers } from 'lucide-react';
import Reveal from '@/components/Reveal';

interface Field {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

interface FieldsSectionProps {
  fields: Field[];
}

const FIELD_STYLES = [
  { gradient: 'from-brand-500 to-indigo-600', soft: 'bg-brand-50 text-brand-700' },
  { gradient: 'from-violet-500 to-purple-600', soft: 'bg-violet-50 text-violet-700' },
  { gradient: 'from-emerald-500 to-teal-600', soft: 'bg-emerald-50 text-emerald-700' },
  { gradient: 'from-orange-500 to-amber-600', soft: 'bg-orange-50 text-orange-700' },
];

function getFieldIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('web') || lowerName.includes('development')) return Code;
  if (lowerName.includes('machine') || lowerName.includes('learning') || lowerName.includes('ai')) return Brain;
  if (lowerName.includes('teach') || lowerName.includes('education')) return GraduationCap;
  if (lowerName.includes('business') || lowerName.includes('admin')) return Briefcase;
  return Layers;
}

export default function FieldsSection({ fields }: FieldsSectionProps) {
  const router = useRouter();

  return (
    <section className="py-24 bg-white border-y border-zinc-100">
      <div className="section-container">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow mb-4">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                Popular Fields
              </span>
              <h2 className="section-title mt-4">Where will you excel?</h2>
              <p className="section-subtitle mt-3 max-w-xl">
                Explore our most active fields, ranked by community questions.
              </p>
            </div>
            <button
              onClick={() => router.push('/fields')}
              className="btn-ghost group shrink-0 self-start sm:self-auto"
            >
              View all fields
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fields.map((field, i) => {
            const Icon = getFieldIcon(field.name);
            const style = FIELD_STYLES[i % FIELD_STYLES.length];
            return (
              <Reveal key={field.id} delay={i * 70}>
                <button
                  onClick={() => router.push(`/fields/${field.id}`)}
                  className="card-hover group w-full h-full p-6 text-left relative overflow-hidden"
                >
                  {/* Hover wash */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${style.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}
                  />

                  <div
                    className={`w-14 h-14 bg-linear-to-br ${style.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-card
                      group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink mb-2 line-clamp-1">{field.name}</h3>
                  <span className={`chip ${style.soft} mb-5`}>
                    {field.questionCount.toLocaleString()} Questions
                  </span>

                  <div className="flex items-center gap-1 text-sm font-semibold text-brand-600">
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

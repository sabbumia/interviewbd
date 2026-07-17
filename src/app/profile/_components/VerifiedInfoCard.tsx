// src/app/profile/_components/VerifiedInfoCard.tsx
import {
  CheckCircle2,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  Linkedin,
  Github,
  ArrowUpRight,
} from 'lucide-react';

interface VerifiedInfoCardProps {
  verificationDetails: {
    university: string;
    workStatus: string;
    location: string;
    mobileNumber: string;
    socialMediaLinks?: {
      linkedin?: string;
      github?: string;
    };
  };
}

export default function VerifiedInfoCard({ verificationDetails }: VerifiedInfoCardProps) {
  const rows = [
    {
      icon: GraduationCap,
      accent: 'bg-violet-50 border-violet-100 text-violet-600',
      label: 'University',
      value: verificationDetails.university,
    },
    {
      icon: Briefcase,
      accent: 'bg-sky-50 border-sky-100 text-sky-600',
      label: 'Work Status',
      value: verificationDetails.workStatus.replace('_', ' '),
      capitalize: true,
    },
    {
      icon: MapPin,
      accent: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      label: 'Location',
      value: verificationDetails.location,
    },
    {
      icon: Phone,
      accent: 'bg-amber-50 border-amber-100 text-amber-600',
      label: 'Mobile',
      value: verificationDetails.mobileNumber,
    },
  ];

  const socials = verificationDetails.socialMediaLinks;

  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '140ms' }}>
      <h2 className="font-display text-lg font-bold text-ink mb-5 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        Verified Information
      </h2>

      <div className="space-y-4">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-start gap-3">
              <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${row.accent}`}>
                <Icon className="w-4.5 h-4.5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                  {row.label}
                </p>
                <p className={`text-sm font-semibold text-ink ${row.capitalize ? 'capitalize' : ''}`}>
                  {row.value}
                </p>
              </div>
            </div>
          );
        })}

        {(socials?.linkedin || socials?.github) && (
          <div className="pt-4 border-t border-zinc-100">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
              Social Links
            </p>
            <div className="flex flex-wrap gap-2">
              {socials?.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-100 text-sm font-semibold text-sky-700
                    hover:bg-sky-100 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
              {socials?.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-sm font-semibold text-zinc-700
                    hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

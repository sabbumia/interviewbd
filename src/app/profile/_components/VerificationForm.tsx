// src/app/profile/_components/VerificationForm.tsx
import { useState } from 'react';
import {
  X,
  AlertCircle,
  BadgeCheck,
  Briefcase,
  ChevronDown,
  GraduationCap,
  Github,
  Linkedin,
  Loader2,
  MapPin,
  Phone,
} from 'lucide-react';

interface VerificationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VerificationForm({ onSuccess, onCancel }: VerificationFormProps) {
  const [formData, setFormData] = useState({
    university: '',
    workStatus: 'student',
    location: '',
    socialMediaLinks: { linkedin: '', twitter: '', github: '' },
    mobileNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification request failed');
        return;
      }

      alert(data.message || 'Verification request submitted successfully!');
      onSuccess();
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 sm:p-7 animate-scale-in">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow shrink-0">
            <BadgeCheck className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Verification Request</h3>
            <p className="text-sm text-zinc-500">Submit your details for account verification.</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          aria-label="Close verification form"
          className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="vf-university" className="field-label flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-brand-500" />
              University / Institution <span className="text-rose-400">*</span>
            </label>
            <input
              id="vf-university"
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="field-input"
              required
              placeholder="Enter your university name"
            />
          </div>

          <div>
            <label htmlFor="vf-work-status" className="field-label flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-500" />
              Work Status <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                id="vf-work-status"
                value={formData.workStatus}
                onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                className="field-input appearance-none pr-10 cursor-pointer"
                required
              >
                <option value="student">Student</option>
                <option value="job_holder">Job Holder</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="vf-location" className="field-label flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-500" />
              Location <span className="text-rose-400">*</span>
            </label>
            <input
              id="vf-location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="field-input"
              required
              placeholder="City, Country"
            />
          </div>

          <div>
            <label htmlFor="vf-mobile" className="field-label flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-brand-500" />
              Mobile Number <span className="text-rose-400">*</span>
            </label>
            <input
              id="vf-mobile"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className="field-input"
              required
              placeholder="+880 1234-567890"
            />
          </div>
        </div>

        <div>
          <p className="field-label">Social Media Links <span className="text-zinc-400 font-normal">(Optional)</span></p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="relative">
              <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500 pointer-events-none" />
              <input
                type="url"
                placeholder="LinkedIn URL"
                aria-label="LinkedIn URL"
                value={formData.socialMediaLinks.linkedin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMediaLinks: { ...formData.socialMediaLinks, linkedin: e.target.value },
                  })
                }
                className="field-input pl-10"
              />
            </div>
            <div className="relative">
              <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="url"
                placeholder="GitHub URL"
                aria-label="GitHub URL"
                value={formData.socialMediaLinks.github}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMediaLinks: { ...formData.socialMediaLinks, github: e.target.value },
                  })
                }
                className="field-input pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn-secondary justify-center sm:w-32">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-brand flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Submitting…
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

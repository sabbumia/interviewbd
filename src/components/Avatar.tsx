// src/components/Avatar.tsx
'use client';

import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name: string;
  /** Pixel size of the avatar square */
  size?: number;
  verified?: boolean;
  /** Adds a subtle gradient ring around the avatar */
  ring?: boolean;
  className?: string;
}

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #10b981, #0ea5e9)',
  'linear-gradient(135deg, #f59e0b, #f43f5e)',
  'linear-gradient(135deg, #8b5cf6, #d946ef)',
  'linear-gradient(135deg, #f43f5e, #8b5cf6)',
];

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
}

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/**
 * Avatar with a deterministic initials fallback (no external placeholder
 * service) and an optional verified badge overlay.
 */
export default function Avatar({
  src,
  name,
  size = 40,
  verified = false,
  ring = false,
  className = '',
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  const badgeSize = Math.max(14, Math.round(size * 0.36));

  return (
    <div className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
      {ring && (
        <div
          aria-hidden
          className="absolute -inset-[3px] rounded-full opacity-70"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)' }}
        />
      )}
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          className="relative w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
        />
      ) : (
        <div
          aria-hidden
          className="relative w-full h-full rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold select-none"
          style={{ background: gradientFor(name), fontSize: Math.max(10, size * 0.38) }}
        >
          {initialsOf(name)}
        </div>
      )}
      {verified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white flex items-center justify-center"
          style={{ width: badgeSize + 4, height: badgeSize + 4 }}
          title="Verified"
        >
          <BadgeCheck
            className="text-brand-600 fill-brand-100"
            style={{ width: badgeSize, height: badgeSize }}
          />
        </span>
      )}
    </div>
  );
}

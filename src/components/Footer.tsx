// src/components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  ArrowUpRight,
} from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/fields', label: 'Explore Fields' },
  { href: '/users', label: 'Network' },
  { href: '/messages', label: 'Messages' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const resources = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/verification', label: 'Get Verified' },
  { href: '/badges', label: 'Badges & Achievements' },
  { href: '/guidelines', label: 'Community Guidelines' },
  { href: '/faq', label: 'FAQ' },
  { href: '/help', label: 'Help Center' },
];

const socialLinks = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0e0d14] text-zinc-400 overflow-hidden">
      {/* Texture + glow accents */}
      <div aria-hidden className="absolute inset-0 bg-grid-dark" />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-160 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: 'linear-gradient(90deg, #4f46e5, #a855f7)' }}
      />

      <div className="relative section-container">
        {/* Main content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center mb-5 group">
              <Image
                src="/footerlogo.png"
                alt="InterviewBD"
                width={246}
                height={79}
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 mb-6 max-w-xs">
              Your ultimate platform for interview preparation and professional
              networking in Bangladesh.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400
                      hover:bg-brand-600 hover:border-brand-500 hover:text-white hover:-translate-y-0.5 hover:shadow-glow
                      transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="group inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {resource.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@interviewbd.com"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-brand-500/50 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  support@interviewbd.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-brand-500/50 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  +880 1234-567890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-sm text-zinc-500">
            © {currentYear} InterviewBD. All rights reserved.
          </span>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            Created by
            <a
              href="https://sazzadadib.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sazzad Hossain
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

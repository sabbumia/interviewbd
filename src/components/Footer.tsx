// app/components/Footer.tsx
'use client';

import Link from 'next/link';
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
  Sparkles,
  Heart,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                InterviewBD
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your ultimate platform for interview preparation and professional networking in Bangladesh.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@interviewbd.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors group"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>support@interviewbd.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors group"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+880 1234-567890</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} InterviewBD. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="hidden sm:inline text-gray-700">•</span>
              <span>Created by</span>
              <a
                href="https://sazzadadib.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
              >
                Sazzad Hossain
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
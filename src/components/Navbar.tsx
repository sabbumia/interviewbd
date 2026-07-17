// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Layers,
  Users,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/Avatar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadUserCount, setUnreadUserCount] = useState(0);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (user) {
      fetchUnreadUserCount();
      const interval = setInterval(fetchUnreadUserCount, 30000);

      // Listen for message updates from other components
      const handleMessagesUpdate = () => {
        fetchUnreadUserCount();
      };
      window.addEventListener('messages-updated', handleMessagesUpdate);

      return () => {
        clearInterval(interval);
        window.removeEventListener('messages-updated', handleMessagesUpdate);
      };
    }
  }, [user]);

  const fetchUnreadUserCount = async () => {
    try {
      const res = await fetch('/api/messages/unread-by-user');
      if (res.ok) {
        const data = await res.json();
        const usersWithUnreadMessages = Object.keys(data.unreadCounts || {}).filter(
          (userId) => data.unreadCounts[userId] > 0
        ).length;
        setUnreadUserCount(usersWithUnreadMessages);
      }
    } catch (error) {
      console.error('Error fetching unread user count:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/fields', label: 'Explore', icon: Layers },
    { href: '/users', label: 'Network', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 shadow-soft'
            : 'bg-paper/60 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <nav className="section-container" aria-label="Main navigation">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <Image
                src="/interviewbd.png"
                alt="InterviewBD"
                width={246}
                height={80}
                priority
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop nav — centered */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 p-1 rounded-full bg-zinc-100/80 border border-zinc-200/60">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                      active
                        ? 'bg-white text-ink shadow-soft'
                        : 'text-zinc-500 hover:text-ink hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-brand-600' : ''}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {/* Messages */}
                  <Link
                    href="/messages"
                    aria-label={`Messages${unreadUserCount > 0 ? `, ${unreadUserCount} unread conversations` : ''}`}
                    className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                      isActive('/messages') ? 'bg-brand-50 text-brand-600' : 'text-zinc-500 hover:bg-zinc-100 hover:text-ink'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadUserCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-linear-to-br from-rose-500 to-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-card ring-2 ring-white">
                        {unreadUserCount > 9 ? '9+' : unreadUserCount}
                      </span>
                    )}
                  </Link>

                  {user.role === 'admin' && (
                    <Link href="/admin" className="chip-rose hover:bg-rose-100 transition-colors py-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  {user.role === 'moderator' && (
                    <Link href="/moderator" className="chip-amber hover:bg-amber-100 transition-colors py-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Moderator
                    </Link>
                  )}

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-expanded={showUserMenu}
                      aria-haspopup="menu"
                      className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-full border border-transparent hover:border-zinc-200 hover:bg-white hover:shadow-soft transition-all duration-300"
                    >
                      <Avatar
                        src={user.profilePicture}
                        name={user.name}
                        size={34}
                        verified={user.isVerified}
                      />
                      <span className="hidden lg:block max-w-[120px] truncate text-sm font-semibold text-ink">
                        {user.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                          showUserMenu ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {showUserMenu && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-3 w-72 card overflow-hidden animate-scale-in origin-top-right z-50"
                      >
                        <div className="p-4 bg-linear-to-br from-brand-50/80 via-white to-purple-50/60 border-b border-zinc-100">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.profilePicture}
                              name={user.name}
                              size={44}
                              verified={user.isVerified}
                              ring
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-ink truncate">{user.name}</div>
                              <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 capitalize">
                                {user.role === 'admin' && <Crown className="w-3 h-3" />}
                                {user.role === 'moderator' && <ShieldCheck className="w-3 h-3" />}
                                {user.role}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            role="menuitem"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            <User className="w-4.5 h-4.5" />
                            My Profile
                          </Link>
                          <button
                            role="menuitem"
                            onClick={() => {
                              handleLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <LogOut className="w-4.5 h-4.5" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost">
                    Sign In
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              {!isOpen && unreadUserCount > 0 && user && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-xl animate-slide-down">
            <div className="section-container py-4 space-y-1">
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-2xl bg-linear-to-br from-brand-50/80 to-purple-50/60 border border-brand-100/60">
                  <Avatar src={user.profilePicture} name={user.name} size={42} verified={user.isVerified} />
                  <div className="min-w-0">
                    <div className="font-bold text-ink truncate">{user.name}</div>
                    <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                  </div>
                </div>
              )}

              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                      active ? 'bg-brand-50 text-brand-700' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <Link
                    href="/messages"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                      isActive('/messages') ? 'bg-brand-50 text-brand-700' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    Messages
                    {unreadUserCount > 0 && (
                      <span className="ml-auto bg-linear-to-br from-rose-500 to-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadUserCount > 9 ? '9+' : unreadUserCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                      isActive('/profile') ? 'bg-brand-50 text-brand-700' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <User className="w-4.5 h-4.5" />
                    Profile
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                    >
                      <Crown className="w-4.5 h-4.5" />
                      Admin Panel
                    </Link>
                  )}
                  {user.role === 'moderator' && (
                    <Link
                      href="/moderator"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" />
                      Moderator Panel
                    </Link>
                  )}

                  <div className="border-t border-zinc-100 my-2" />

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-zinc-100 my-2" />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary justify-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary justify-center"
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Click-outside to close the user dropdown */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </>
  );
}

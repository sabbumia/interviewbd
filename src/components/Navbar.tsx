// app/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Shield,
  Award,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Check,
  Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadUserCount, setUnreadUserCount] = useState(0);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const toggleMenu = () => setIsOpen(!isOpen);

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
      <nav
        className={`fixed top-0 left-0 w-full text-gray-900 shadow-lg transition-all duration-300 z-50 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200'
            : 'bg-white'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-80 transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  InterviewBD
                </span>
              </Link>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Messages Icon with User Count Badge */}
                  <Link
                    href="/messages"
                    className="relative p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
                    {unreadUserCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg">
                        {unreadUserCount > 9 ? '9+' : unreadUserCount}
                      </span>
                    )}
                  </Link>

                  {/* Admin Badge */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-105 transform transition-all duration-300 rounded-lg shadow-lg flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  {/* Moderator Badge */}
                  {user.role === 'moderator' && (
                    <Link
                      href="/moderator"
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 hover:scale-105 transform transition-all duration-300 rounded-lg shadow-lg flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Moderator
                    </Link>
                  )}

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all group"
                    >
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-60 transition"></div>
                        <img
                          src={
                            user.profilePicture ||
                            'https://via.placeholder.com/40'
                          }
                          alt={user.name}
                          className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-bold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          <div className="flex items-center">{user.role === "admin" && <Crown className="w-3 h-3 text-red-400 mr-1" />} {user.role === "moderator" && <ShieldCheck className="w-3 h-3 text-orange-400 mr-1" />}  {user.role}</div>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          showUserMenu ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                user.profilePicture ||
                                'https://via.placeholder.com/40'
                              }
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div>
                              <div className="font-bold text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
                          >
                            <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              My Profile
                            </span>
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all group"
                          >
                            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                            <span className="font-medium text-gray-700 group-hover:text-red-600">
                              Sign Out
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:scale-105 transform transition-all duration-300 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 transform transition-all duration-300 rounded-lg shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden animate-slideDown">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-xl rounded-lg mb-4 border border-gray-200 shadow-lg">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                        active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                      onClick={toggleMenu}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    <Link
                      href="/messages"
                      className="relative block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors duration-300 flex items-center gap-2 text-gray-700"
                      onClick={toggleMenu}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                      {unreadUserCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {unreadUserCount > 9 ? '9+' : unreadUserCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/profile"
                      className={`block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                        isActive('/profile')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700'
                      }`}
                      onClick={toggleMenu}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
                        onClick={toggleMenu}
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-red-50 rounded-lg transition-colors duration-300 flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>

                    <Link
                      href="/login"
                      className="block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-lg transition-colors duration-300 text-gray-700"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-colors duration-300 text-center"
                      onClick={toggleMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }

          .animate-slide-down {
            animation: slideDown 0.2s ease-out;
          }
        `}</style>
      </nav>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </>
  );
}
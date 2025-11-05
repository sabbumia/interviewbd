// src/components/MessageNotificationBadge.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function MessageNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/messages/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleClick = () => {
    router.push('/messages');
  };

  if (unreadCount === 0) return null;

  return (
    <button
      onClick={handleClick}
      className="relative inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
    >
      Messages
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </button>
  );
}
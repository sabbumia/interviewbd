// src/hooks/useRefreshMessages.ts

'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom hook to trigger message refresh in Navbar
 * Use this hook in your messages page/component to notify Navbar when messages are read
 */
export function useRefreshMessages() {
  const eventRef = useRef<CustomEvent | null>(null);

  const triggerRefresh = () => {
    // Dispatch custom event that Navbar can listen to
    const event = new CustomEvent('messages-updated');
    window.dispatchEvent(event);
  };

  return { triggerRefresh };
}

// Example usage in your messages component:
/*
import { useRefreshMessages } from '@/app/hooks/useRefreshMessages';

export default function MessagesPage() {
  const { triggerRefresh } = useRefreshMessages();

  const markMessageAsRead = async (messageId: string) => {
    // Your API call to mark message as read
    await fetch(`/api/messages/${messageId}/read`, { method: 'POST' });
    
    // Trigger navbar to refresh unread count
    triggerRefresh();
  };

  // Or trigger after any message-related action
  const sendMessage = async (data: any) => {
    await fetch('/api/messages', { method: 'POST', body: JSON.stringify(data) });
    triggerRefresh();
  };

  return (
    // Your JSX
  );
}
*/
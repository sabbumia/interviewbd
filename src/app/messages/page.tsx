// src/app/messages/page.tsx
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useRefreshMessages } from "@/hooks/useRefreshMessages";
import MessagesSidebar from "./_components/MessagesSidebar";
import ChatHeader from "./_components/ChatHeader";
import MessagesContainer from "./_components/MessagesContainer";
import MessageInput from "./_components/MessageInput";
import EmptyState from "./_components/EmptyState";

function MessagesContent() {
  const [user, setUser] = useState<any>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [userActivities, setUserActivities] = useState<Record<string, Date>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);
  const userScrolledRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { triggerRefresh } = useRefreshMessages();

  useEffect(() => {
    updateActivity();
    const interval = setInterval(updateActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUser();
    fetchConnections();

    const preselectedUserId = searchParams.get("userId");
    if (preselectedUserId) {
      setSelectedUserId(preselectedUserId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
      markMessagesAsDelivered();
      const interval = setInterval(() => {
        fetchMessages();
        fetchUserActivities();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchUnreadCounts();
    fetchUserActivities();
    const interval = setInterval(() => {
      fetchUnreadCounts();
      fetchUserActivities();
    }, 10000);
    return () => clearInterval(interval);
  }, [connections]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter((conn) => {
        const otherUser = conn.userId === user?.id ? conn.connectedUser : conn.user;
        return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConnections(filtered);
    }
  }, [searchQuery, connections, user]);

  useEffect(() => {
    const messageCountChanged = messages.length !== previousMessageCountRef.current;
    const isNewMessage = messages.length > previousMessageCountRef.current;

    if (messageCountChanged) {
      const container = messagesContainerRef.current;
      const isNearBottom = container
        ? container.scrollHeight - container.scrollTop - container.clientHeight < 150
        : true;

      if (isNewMessage && (isNearBottom || !userScrolledRef.current)) {
        scrollToBottom();
      }

      previousMessageCountRef.current = messages.length;
    }
  }, [messages]);

  useEffect(() => {
    userScrolledRef.current = false;
    previousMessageCountRef.current = 0;
    setTimeout(() => scrollToBottom(), 100);
  }, [selectedUserId]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 10;

    if (!isAtBottom) {
      userScrolledRef.current = true;
    } else {
      userScrolledRef.current = false;
    }
  };

  const updateActivity = async () => {
    try {
      await fetch("/api/users/activity", { method: "POST" });
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const fetchUserActivities = async () => {
    if (connections.length === 0) return;

    const userIds = connections.map((c) =>
      c.userId === user?.id ? c.connectedUserId : c.userId
    );

    try {
      const res = await fetch(`/api/users/activity?userIds=${userIds.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        const activitiesMap: Record<string, Date> = {};
        data.activities.forEach((activity: any) => {
          activitiesMap[activity.id] = new Date(activity.lastActiveAt);
        });
        setUserActivities(activitiesMap);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await fetch("/api/messages/unread-by-user");
      if (res.ok) {
        const data = await res.json();
        setUnreadCounts(data.unreadCounts || {});
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  const markMessagesAsDelivered = async () => {
    try {
      await fetch("/api/messages/delivered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: [] }),
      });
    } catch (error) {
      console.error("Error marking delivered:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/connections");
      if (res.ok) {
        const data = await res.json();
        const accepted = data.filter((c: any) => c.status === "accepted");
        setConnections(accepted);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUserId) return;

    try {
      const res = await fetch(`/api/messages?userId=${selectedUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);

        const unreadMessages = data.filter(
          (msg: any) => msg.receiverId === user?.id && !msg.isRead
        );

        unreadMessages.forEach((msg: any) => {
          markAsRead(msg.id);
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: "PUT",
      });
      fetchUnreadCounts();
      triggerRefresh();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        userScrolledRef.current = false;
        fetchMessages();
        triggerRefresh();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const isAdminMessage = (msg: any) => {
    return msg.sender?.role === "admin" && msg.senderId !== user?.id;
  };

  const isUserOnline = (userId: string) => {
    const lastActive = userActivities[userId];
    if (!lastActive) return false;
    const now = new Date();
    const diff = now.getTime() - new Date(lastActive).getTime();
    return diff < 60000;
  };

  const getLastSeenText = (userId: string) => {
    const lastActive = userActivities[userId];
    if (!lastActive) return "Offline";

    if (isUserOnline(userId)) {
      return "Active now";
    }

    return `Active ${timeAgo(lastActive)}`;
  };

  const timeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  const getMessageStatus = (msg: any) => {
    if (msg.senderId !== user?.id) return null;

    if (msg.readAt) {
      return <span className="text-blue-500 text-xs">✓✓</span>;
    } else if (msg.deliveredAt) {
      return <span className="text-gray-400 text-xs">✓✓</span>;
    } else {
      return <span className="text-gray-400 text-xs">✓</span>;
    }
  };

  if (loading) {
    return <Loading message="Loading Messages..." />;
  }

  if (!user) return null;

  const selectedConnection = connections.find(
    (c) => c.userId === selectedUserId || c.connectedUserId === selectedUserId
  );
  const selectedUser = selectedConnection
    ? selectedConnection.userId === user.id
      ? selectedConnection.connectedUser
      : selectedConnection.user
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-140px)] flex">
          <MessagesSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredConnections={filteredConnections}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            user={user}
            unreadCounts={unreadCounts}
            isUserOnline={isUserOnline}
            getLastSeenText={getLastSeenText}
          />

          <div className="flex-1 flex flex-col bg-gray-50">
            {!selectedUser ? (
              <EmptyState />
            ) : (
              <>
                <ChatHeader
                  selectedUser={selectedUser}
                  isUserOnline={isUserOnline}
                  getLastSeenText={getLastSeenText}
                />
                <MessagesContainer
                  messages={messages}
                  user={user}
                  isAdminMessage={isAdminMessage}
                  getMessageStatus={getMessageStatus}
                  // @ts-ignore
                  messagesContainerRef={messagesContainerRef}
                  // @ts-ignore
                  messagesEndRef={messagesEndRef}
                  onScroll={handleScroll}
                />
                <MessageInput
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  sending={sending}
                  onSubmit={handleSendMessage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
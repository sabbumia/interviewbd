// src/app/messages/page.tsx
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/timeAgo";
import Loading from "@/components/Loading";
import { Search, MoreVertical, Send, Smile, Paperclip, Info } from "lucide-react";

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

  // Update user activity every 30 seconds
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

  // Filter connections based on search
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

  // Smart scroll: only scroll to bottom when appropriate
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
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900 mb-3">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Connections List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConnections.length === 0 ? (
                <div className="p-6 text-center">
                  {searchQuery ? (
                    <p className="text-gray-500 text-sm">No results found</p>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm mb-2">No connections yet</p>
                      <Link
                        href="/users"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Find connections
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredConnections.map((conn) => {
                    const otherUser = conn.userId === user.id ? conn.connectedUser : conn.user;
                    const unreadCount = unreadCounts[otherUser.id] || 0;
                    const online = isUserOnline(otherUser.id);
                    const isSelected = selectedUserId === otherUser.id;

                    return (
                      <button
                        key={conn.id}
                        onClick={() => setSelectedUserId(otherUser.id)}
                        className={`w-full p-4 hover:bg-gray-50 transition-colors duration-150 flex items-start gap-3 ${
                          isSelected ? "bg-blue-50 hover:bg-blue-50" : ""
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          {otherUser.profilePicture ? (
                            <img
                              src={otherUser.profilePicture}
                              alt={otherUser.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                              {otherUser.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              online ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`font-medium truncate ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                                {otherUser.name}
                              </span>
                              {otherUser.isVerified && (
                                <img
                                  src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
                                  alt="Verified"
                                  className="w-4 h-4 flex-shrink-0"
                                />
                              )}
                              {otherUser.role === "admin" && (
                                <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                  Admin
                                </span>
                              )}
                            </div>
                            {unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center flex-shrink-0">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
                            {getLastSeenText(otherUser.id)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {!selectedUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1">Select a conversation</p>
                <p className="text-xs text-gray-400">Choose a connection to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {selectedUser.profilePicture ? (
                          <img
                            src={selectedUser.profilePicture}
                            alt={selectedUser.name}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            isUserOnline(selectedUser.id) ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900">{selectedUser.name}</span>
                          {selectedUser.isVerified && (
                            <img
                              src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
                              alt="Verified"
                              className="w-4 h-4"
                            />
                          )}
                          {selectedUser.role === "admin" && (
                            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{getLastSeenText(selectedUser.id)}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs text-gray-400 mt-1">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwnMessage = msg.senderId === user.id;
                      const isAdmin = isAdminMessage(msg);

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[70%] ${isOwnMessage ? "text-right" : "text-left"}`}>
                            {isAdmin && !isOwnMessage && (
                              <div className="flex items-center gap-1 mb-1 ml-1">
                                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium">
                                  Admin Message
                                </span>
                              </div>
                            )}
                            <div
                              className={`inline-block px-4 py-2.5 rounded-2xl ${
                                isOwnMessage
                                  ? "bg-blue-600 text-white rounded-br-md"
                                  : isAdmin
                                  ? "bg-red-50 text-gray-900 border border-red-100 rounded-bl-md"
                                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                {msg.content}
                              </p>
                              <div className="flex items-center gap-1.5 justify-end mt-1.5">
                                <p
                                  className={`text-xs ${
                                    isOwnMessage
                                      ? "text-blue-100"
                                      : isAdmin
                                      ? "text-red-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {timeAgo(msg.createdAt)}
                                </p>
                                {isOwnMessage && getMessageStatus(msg)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-sm max-h-32"
                        style={{ minHeight: "44px" }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm hover:shadow disabled:shadow-none"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Press Enter to send, Shift + Enter for new line</p>
                </form>
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
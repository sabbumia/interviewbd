// src/app/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import UsersHeader from './_components/UsersHeader';
import UserCard from './_components/UserCard';
import EmptyState from './_components/EmptyState';
import { getBadge } from '@/lib/badges';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture: string;
  questionCount: number;
  verificationDetails?: {
    university: string;
    workStatus: string;
    location: string;
  };
}

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: string;
}

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
      await fetchUsers();
      await fetchConnections();
    };
    init();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const getConnectionStatus = (userId: string) => {
    if (!currentUser) return null;
    return connections.find(c => 
      (c.userId === currentUser.id && c.connectedUserId === userId) ||
      (c.connectedUserId === currentUser.id && c.userId === userId)
    );
  };

  const handleConnect = async (userId: string) => {
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectedUserId: userId }),
      });

      if (res.ok) {
        fetchConnections();
        alert('Connection request sent!');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (res.ok) {
        alert('Connection accepted!');
        await fetchConnections();
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Connection rejected');
        await fetchConnections();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return <Loading message="Loading Users..." />;
  }

  const acceptedConnections = connections.filter(c => c.status === 'accepted');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.verificationDetails?.university?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'verified' && user.isVerified) ||
      (filterStatus === 'unverified' && !user.isVerified);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesFilter && matchesRole && user.id !== currentUser?.id;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <UsersHeader 
        totalUsers={users.length} 
        totalConnections={acceptedConnections.length}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        filterRole={filterRole}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
        onFilterRoleChange={setFilterRole}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => {
              const connection = getConnectionStatus(user.id);
              const badge = user.questionCount > 0 ? getBadge(user.questionCount) : null;
              
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  badge={badge}
                  connection={connection}
                  currentUserId={currentUser?.id}
                  onConnect={handleConnect}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
// src/app/users/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import ProfileHeader from './_components/ProfileHeader';
import StatisticsCard from './_components/StatisticsCard';
import VerificationInfoCard from './_components/VerificationInfoCard';
import QuestionsSection from './_components/QuestionsSection';
import { getBadge } from '@/lib/badges';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  profilePicture: string;
  role: string;
  createdAt: string;
  questionCount: number;
  totalLikes: number;
  verificationDetails?: {
    university: string;
    workStatus: string;
    location: string;
    mobileNumber: string;
    socialMediaLinks?: {
      linkedin?: string;
      github?: string;
    };
  };
  recentQuestions: any[];
}

export default function UserDetailPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [connection, setConnection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserDetail();
      fetchConnection();
    }
  }, [userId, currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      router.push('/login');
    }
  };

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push('/users');
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
      router.push('/users');
    } finally {
      setLoading(false);
    }
  };

  const fetchConnection = async () => {
    try {
      const res = await fetch('/api/connections');
      if (res.ok) {
        const connections = await res.json();
        const conn = connections.find((c: any) => 
          (c.userId === currentUser?.id && c.connectedUserId === userId) ||
          (c.connectedUserId === currentUser?.id && c.userId === userId)
        );
        setConnection(conn);
      }
    } catch (error) {
      console.error('Error fetching connection:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectedUserId: userId }),
      });

      if (res.ok) {
        alert('Connection request sent successfully!');
        await fetchConnection();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const handleAcceptRequest = async () => {
    if (!connection) return;

    try {
      const res = await fetch(`/api/connections/${connection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (res.ok) {
        alert('Connection accepted successfully!');
        await fetchConnection();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to accept connection');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept connection. Please try again.');
    }
  };

  const handleRejectRequest = async () => {
    if (!connection) return;

    if (!confirm('Are you sure you want to reject this connection request?')) {
      return;
    }

    try {
      const res = await fetch(`/api/connections/${connection.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Connection request rejected');
        setConnection(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reject connection');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject connection. Please try again.');
    }
  };

  if (loading) {
    return <Loading message="Loading Profile..." />;
  }

  if (!user) return null;

  const badge = user.questionCount > 0 ? getBadge(user.questionCount) : null;
  const isOwnProfile = currentUser?.id === userId;
  const avgLikes = user.questionCount > 0 ? (user.totalLikes / user.questionCount).toFixed(1) : '0';
  const isConnected = connection?.status === 'accepted';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          user={user}
          badge={badge}
          isOwnProfile={isOwnProfile}
          connection={connection}
          currentUserId={currentUser?.id}
          onConnect={handleConnect}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            <StatisticsCard
              questionCount={user.questionCount}
              totalLikes={user.totalLikes}
              avgLikes={avgLikes}
            />

            {user.verificationDetails && (
              <VerificationInfoCard
                verificationDetails={user.verificationDetails}
                isConnected={isConnected}
              />
            )}
          </div>

          {/* Right Column - Questions */}
          <div className="lg:col-span-2">
            <QuestionsSection
              questions={user.recentQuestions}
              totalQuestions={user.questionCount}
              userId={userId}
              userName={user.name}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
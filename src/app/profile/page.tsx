// // src/app/profile/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import OwnProfileHeader from './_components/OwnProfileHeader';
// import VerificationForm from './_components/VerificationForm';
// import PendingVerificationBanner from './_components/PendingVerificationBanner';
// import ActivityStatistics from './_components/ActivityStatistics';
// import VerifiedInfoCard from './_components/VerifiedInfoCard';
// import PendingRequests from './_components/PendingRequests';
// import ConnectionsList from './_components/ConnectionsList';
// import { getBadge } from '@/lib/badges';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   isVerified: boolean;
//   profilePicture: string;
//   verificationDetails?: any;
// }

// interface VerificationRequest {
//   id: string;
//   status: 'pending' | 'approved' | 'rejected';
//   university: string;
//   workStatus: string;
//   location: string;
//   mobileNumber: string;
//   socialMediaLinks?: string;
//   createdAt: string;
//   rejectionReason?: string;
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [questionCount, setQuestionCount] = useState(0);
//   const [totalLikes, setTotalLikes] = useState(0);
//   const [connections, setConnections] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState<any[]>([]);
//   const [allUsers, setAllUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showVerificationForm, setShowVerificationForm] = useState(false);
//   const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [editingName, setEditingName] = useState(false);
//   const [newName, setNewName] = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchUser();
//     fetchQuestionStats();
//     fetchConnections();
//     fetchVerificationRequest();
//     fetchUsers();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await fetch('/api/auth/me');
//       if (!res.ok) {
//         router.push('/login');
//         return;
//       }
//       const data = await res.json();
//       setUser(data.user);
//       setNewName(data.user.name);
//     } catch (error) {
//       console.error('Error fetching user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVerificationRequest = async () => {
//     try {
//       const res = await fetch('/api/verification');
//       if (res.ok) {
//         const data = await res.json();
//         setVerificationRequest(data);
//       }
//     } catch (error) {
//       // No verification request exists
//     }
//   };

//   const fetchQuestionStats = async () => {
//     try {
//       const res = await fetch('/api/auth/me');
//       if (res.ok) {
//         const data = await res.json();
//         const questionsRes = await fetch(`/api/questions?userId=${data.user.id}`);
//         const questions = await questionsRes.json();
//         setQuestionCount(questions.length);
        
//         const likes = questions.reduce((sum: number, q: any) => sum + (q.likeCount || 0), 0);
//         setTotalLikes(likes);
//       }
//     } catch (error) {
//       console.error('Error fetching question stats:', error);
//     }
//   };

//   const fetchConnections = async () => {
//     try {
//       const res = await fetch('/api/connections');
//       if (res.ok) {
//         const data = await res.json();
//         const accepted = data.filter((c: any) => c.status === 'accepted');
//         setConnections(accepted);
//       }
//     } catch (error) {
//       console.error('Error fetching connections:', error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch('/api/users');
//       if (res.ok) {
//         const data = await res.json();
//         setAllUsers(data);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchPendingRequests();
//     }
//   }, [user, connections]);

//   const fetchPendingRequests = async () => {
//     try {
//       const res = await fetch('/api/connections');
//       if (res.ok) {
//         const data = await res.json();
//         const pending = data.filter((c: any) => 
//           c.status === 'pending' && c.connectedUserId === user?.id
//         );
//         setPendingRequests(pending);
//       }
//     } catch (error) {
//       console.error('Error fetching pending requests:', error);
//     }
//   };

//   const handleAcceptRequest = async (connectionId: string) => {
//     try {
//       const res = await fetch(`/api/connections/${connectionId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'accepted' }),
//       });

//       if (res.ok) {
//         alert('Connection accepted!');
//         await fetchConnections();
//         await fetchPendingRequests();
//       }
//     } catch (error) {
//       console.error('Error accepting request:', error);
//     }
//   };

//   const handleRejectRequest = async (connectionId: string) => {
//     try {
//       const res = await fetch(`/api/connections/${connectionId}`, {
//         method: 'DELETE',
//       });

//       if (res.ok) {
//         alert('Connection rejected');
//         await fetchPendingRequests();
//       }
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//     }
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       alert('Please upload an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }

//     setUploadingImage(true);

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const uploadRes = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!uploadRes.ok) {
//         throw new Error('Upload failed');
//       }

//       const uploadData = await uploadRes.json();

//       const updateRes = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profilePicture: uploadData.url }),
//       });

//       if (updateRes.ok) {
//         const data = await updateRes.json();
//         setUser(data.user);
//         alert('Profile picture updated successfully!');
//       } else {
//         throw new Error('Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Failed to upload image. Please try again.');
//     } finally {
//       setUploadingImage(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleNameUpdate = async () => {
//     if (!newName.trim() || newName === user?.name) {
//       setEditingName(false);
//       return;
//     }

//     try {
//       const res = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: newName.trim() }),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setUser(data.user);
//         setEditingName(false);
//         alert('Name updated successfully!');
//       } else {
//         throw new Error('Failed to update name');
//       }
//     } catch (error) {
//       console.error('Error updating name:', error);
//       alert('Failed to update name');
//     }
//   };

//   const handleVerificationSuccess = () => {
//     setShowVerificationForm(false);
//     fetchVerificationRequest();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   const canRequestVerification = !user.isVerified && !verificationRequest;
//   const hasPendingRequest = verificationRequest?.status === 'pending';
//   const badge = getBadge(questionCount);
//   const avgLikes = questionCount > 0 ? (totalLikes / questionCount).toFixed(1) : '0';

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Profile Header */}
//         <OwnProfileHeader
//           user={user}
//           badge={badge}
//           editingName={editingName}
//           newName={newName}
//           uploadingImage={uploadingImage}
//           onNameChange={setNewName}
//           onNameSave={handleNameUpdate}
//           onNameCancel={() => {
//             setEditingName(false);
//             setNewName(user.name);
//           }}
//           onEditName={() => setEditingName(true)}
//           onImageUpload={handleImageUpload}
//           fileInputRef={fileInputRef}
//         />

//         {/* Request Verification Button */}
//         {canRequestVerification && !showVerificationForm && (
//           <div className="mb-6 text-center">
//             <button
//               onClick={() => setShowVerificationForm(true)}
//               className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
//             >
//               Request Verification
//             </button>
//           </div>
//         )}

//         {/* Pending Verification Status */}
//         {hasPendingRequest && verificationRequest && (
//           <PendingVerificationBanner verificationRequest={verificationRequest} />
//         )}

//         {/* Verification Form */}
//         {showVerificationForm && canRequestVerification && (
//           <div className="mb-6">
//             <VerificationForm 
//               onSuccess={handleVerificationSuccess} 
//               onCancel={() => setShowVerificationForm(false)} 
//             />
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Stats & Info */}
//           <div className="lg:col-span-1 space-y-6">
//             <ActivityStatistics
//               questionCount={questionCount}
//               totalLikes={totalLikes}
//               avgLikes={avgLikes}
//               connectionsCount={connections.length}
//               pendingRequestsCount={pendingRequests.length}
//             />

//             {user.isVerified && user.verificationDetails && (
//               <VerifiedInfoCard verificationDetails={user.verificationDetails} />
//             )}
//           </div>

//           {/* Right Column - Connections and Pending Requests */}
//           <div className="lg:col-span-2 space-y-6">
//             <PendingRequests
//               requests={pendingRequests}
//               users={allUsers}
//               getBadge={getBadge}
//               onAccept={handleAcceptRequest}
//               onReject={handleRejectRequest}
//             />

//             <ConnectionsList
//               connections={connections}
//               currentUserId={user.id}
//               getBadge={getBadge}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











// src/app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import OwnProfileHeader from './_components/OwnProfileHeader';
import VerificationForm from './_components/VerificationForm';
import PendingVerificationBanner from './_components/PendingVerificationBanner';
import ActivityStatistics from './_components/ActivityStatistics';
import VerifiedInfoCard from './_components/VerifiedInfoCard';
import PendingRequests from './_components/PendingRequests';
import ConnectionsList from './_components/ConnectionsList';
import { getBadge } from '@/lib/badges';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture: string;
  verificationDetails?: any;
}

interface VerificationRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  university: string;
  workStatus: string;
  location: string;
  mobileNumber: string;
  socialMediaLinks?: string;
  createdAt: string;
  rejectionReason?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchQuestionStats();
    fetchConnections();
    fetchVerificationRequest();
    fetchUsers();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setNewName(data.user.name);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationRequest = async () => {
    try {
      const res = await fetch('/api/verification');
      if (res.ok) {
        const data = await res.json();
        setVerificationRequest(data);
      }
    } catch (error) {
      // No verification request exists
    }
  };

  const fetchQuestionStats = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        const questionsRes = await fetch(`/api/questions?userId=${data.user.id}`);
        const questions = await questionsRes.json();
        setQuestionCount(questions.length);
        
        const likes = questions.reduce((sum: number, q: any) => sum + (q.likeCount || 0), 0);
        setTotalLikes(likes);
      }
    } catch (error) {
      console.error('Error fetching question stats:', error);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/connections');
      if (res.ok) {
        const data = await res.json();
        const accepted = data.filter((c: any) => c.status === 'accepted');
        setConnections(accepted);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPendingRequests();
    }
  }, [user, connections]);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch('/api/connections');
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter((c: any) => 
          c.status === 'pending' && c.connectedUserId === user?.id
        );
        setPendingRequests(pending);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
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
        await fetchPendingRequests();
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
        await fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadRes.json();

      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: uploadData.url }),
      });

      if (updateRes.ok) {
        const data = await updateRes.json();
        setUser(data.user);
        alert('Profile picture updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim() || newName === user?.name) {
      setEditingName(false);
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditingName(false);
        alert('Name updated successfully!');
      } else {
        throw new Error('Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationForm(false);
    fetchVerificationRequest();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const canRequestVerification = !user.isVerified && !verificationRequest;
  const hasPendingRequest = verificationRequest?.status === 'pending';
  const badge = getBadge(questionCount);
  const avgLikes = questionCount > 0 ? (totalLikes / questionCount).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header with Request Verification Button */}
        <OwnProfileHeader
          user={user}
          badge={badge}
          editingName={editingName}
          newName={newName}
          uploadingImage={uploadingImage}
          onNameChange={setNewName}
          onNameSave={handleNameUpdate}
          onNameCancel={() => {
            setEditingName(false);
            setNewName(user.name);
          }}
          onEditName={() => setEditingName(true)}
          onImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          canRequestVerification={canRequestVerification}
          onRequestVerification={() => setShowVerificationForm(true)}
        />

        {/* Pending Verification Status */}
        {hasPendingRequest && verificationRequest && (
          <PendingVerificationBanner verificationRequest={verificationRequest} />
        )}

        {/* Verification Form */}
        {showVerificationForm && canRequestVerification && (
          <div className="mb-6">
            <VerificationForm 
              onSuccess={handleVerificationSuccess} 
              onCancel={() => setShowVerificationForm(false)} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            <ActivityStatistics
              questionCount={questionCount}
              totalLikes={totalLikes}
              avgLikes={avgLikes}
              connectionsCount={connections.length}
              pendingRequestsCount={pendingRequests.length}
            />

            {user.isVerified && user.verificationDetails && (
              <VerifiedInfoCard verificationDetails={user.verificationDetails} />
            )}
          </div>

          {/* Right Column - Connections and Pending Requests */}
          <div className="lg:col-span-2 space-y-6">
            <PendingRequests
              requests={pendingRequests}
              users={allUsers}
              getBadge={getBadge}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />

            <ConnectionsList
              connections={connections}
              currentUserId={user.id}
              getBadge={getBadge}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
// // src/app/admin/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   LayoutDashboard,
//   Flag,
//   CheckCircle,
//   Users,
//   FolderTree,
//   X,
//   Check,
//   Trash2,
//   Award,
//   TrendingUp,
//   Activity,
//   AlertCircle
// } from "lucide-react";

// // Badge data
// const badges = [
//   { emoji: '🐣', name: 'Newbie', minQuestions: 1, maxQuestions: 4 },
//   { emoji: '🌱', name: 'Curious', minQuestions: 5, maxQuestions: 9 },
//   { emoji: '🔍', name: 'Seeker', minQuestions: 10, maxQuestions: 19 },
//   { emoji: '💡', name: 'Inquirer', minQuestions: 20, maxQuestions: 49 },
//   { emoji: '🔥', name: 'Pro Questioner', minQuestions: 50, maxQuestions: 99 },
//   { emoji: '🧠', name: 'Expert Inquirer', minQuestions: 100, maxQuestions: 199 },
//   { emoji: '🌟', name: 'Legendary Asker', minQuestions: 200, maxQuestions: Infinity },
// ];

// const getBadge = (questionCount) => {
//   if (questionCount === 0) return null;
//   return badges.find(badge => questionCount >= badge.minQuestions && questionCount <= badge.maxQuestions) || null;
// };

// export default function AdminDashboard() {
//   const [user, setUser] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [fields, setFields] = useState([]);
//   const [verificationRequests, setVerificationRequests] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [showRejectionModal, setShowRejectionModal] = useState(false);
//   const router = useRouter();

//   // Form states
//   const [newFieldName, setNewFieldName] = useState("");
//   const [newFieldDesc, setNewFieldDesc] = useState("");
//   const [newCategoryName, setNewCategoryName] = useState("");
//   const [newCategoryDesc, setNewCategoryDesc] = useState("");
//   const [selectedFieldForCategory, setSelectedFieldForCategory] = useState("");

//   useEffect(() => {
//     fetchUser();
//     fetchAnalytics();
//     fetchUsers();
//     fetchFields();
//     fetchVerificationRequests();
//     fetchReports();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await fetch("/api/auth/me");
//       if (!res.ok) {
//         router.push("/login");
//         return;
//       }
//       const data = await res.json();
//       if (data.user.role !== "admin" && data.user.role !== "moderator") {
//         router.push("/");
//         return;
//       }
//       setUser(data.user);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAnalytics = async () => {
//     try {
//       const res = await fetch("/api/admin/analytics");
//       if (res.ok) {
//         const data = await res.json();
//         setAnalytics(data);
//       }
//     } catch (error) {
//       console.error("Error fetching analytics:", error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("/api/admin/users");
//       if (res.ok) {
//         const data = await res.json();
//         setUsers(data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const fetchFields = async () => {
//     try {
//       const res = await fetch("/api/fields");
//       const data = await res.json();
//       setFields(data);
//     } catch (error) {
//       console.error("Error fetching fields:", error);
//     }
//   };

//   const fetchVerificationRequests = async () => {
//     try {
//       const res = await fetch("/api/admin/verification");
//       if (res.ok) {
//         const data = await res.json();
//         setVerificationRequests(data);
//       }
//     } catch (error) {
//       console.error("Error fetching verification requests:", error);
//     }
//   };

//   const fetchReports = async () => {
//     try {
//       const res = await fetch("/api/admin/reports");
//       if (res.ok) {
//         const data = await res.json();
//         setReports(data);
//       }
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     }
//   };

//   const handleVerificationAction = async (requestId, action) => {
//     if (action === "reject" && !rejectionReason.trim()) {
//       alert("Please provide a reason for rejection");
//       return;
//     }

//     try {
//       const res = await fetch(`/api/admin/verification/${requestId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action,
//           rejectionReason: action === "reject" ? rejectionReason : undefined,
//         }),
//       });
     
//       if (res.ok) {
//         fetchVerificationRequests();
//         fetchUsers();
//         fetchAnalytics();
//         setSelectedRequest(null);
//         setShowRejectionModal(false);
//         setRejectionReason("");
//         alert(action === "approve" ? "User verified successfully!" : "Verification rejected.");
//       }
//     } catch (error) {
//       console.error("Error processing verification:", error);
//     }
//   };

//   const handleReportAction = async (reportId, action) => {
//     const confirmMsg = action === "delete_question"
//       ? "Are you sure you want to delete this question and all related data?"
//       : "Are you sure you want to dismiss this report?";

//     if (!confirm(confirmMsg)) return;

//     try {
//       const res = await fetch(`/api/admin/reports/${reportId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert(data.message);
//         fetchReports();
//         fetchAnalytics();
//         setSelectedReport(null);
//       } else {
//         alert(data.error || "Action failed");
//       }
//     } catch (error) {
//       console.error("Error handling report:", error);
//       alert("An error occurred");
//     }
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     try {
//       const res = await fetch(`/api/admin/users/${userId}/role`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role: newRole }),
//       });

//       if (res.ok) {
//         fetchUsers();
//       }
//     } catch (error) {
//       console.error("Error updating role:", error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const res = await fetch(`/api/admin/users/${userId}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         fetchUsers();
//         fetchAnalytics();
//       }
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const handleCreateField = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/fields", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newFieldName, description: newFieldDesc }),
//       });

//       if (res.ok) {
//         setNewFieldName("");
//         setNewFieldDesc("");
//         fetchFields();
//         fetchAnalytics();
//       }
//     } catch (error) {
//       console.error("Error creating field:", error);
//     }
//   };

//   const handleCreateCategory = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/categories", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: newCategoryName,
//           description: newCategoryDesc,
//           fieldId: selectedFieldForCategory,
//         }),
//       });

//       if (res.ok) {
//         setNewCategoryName("");
//         setNewCategoryDesc("");
//         setSelectedFieldForCategory("");
//         fetchFields();
//         fetchAnalytics();
//       }
//     } catch (error) {
//       console.error("Error creating category:", error);
//     }
//   };

//   const handleDeleteField = async (fieldId) => {
//     if (!confirm("Delete this field and all its categories?")) return;

//     try {
//       await fetch(`/api/fields/${fieldId}`, { method: "DELETE" });
//       fetchFields();
//       fetchAnalytics();
//     } catch (error) {
//       console.error("Error deleting field:", error);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (!confirm("Delete this category and all its questions?")) return;

//     try {
//       await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
//       fetchFields();
//       fetchAnalytics();
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading Admin Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   const pendingRequests = verificationRequests.filter(r => r.status === "pending");
//   const approvedRequests = verificationRequests.filter(r => r.status === "approved");

//   const navItems = [
//     { id: "overview", label: "Overview", icon: LayoutDashboard },
//     { id: "reports", label: "Reports", icon: Flag, badge: reports.length },
//     { id: "verifications", label: "Verifications", icon: CheckCircle, badge: pendingRequests.length },
//     { id: "users", label: "Users", icon: Users },
//     { id: "fields", label: "Fields & Categories", icon: FolderTree },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
//         <div className="p-6 border-b border-gray-200">
//           <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
//           <p className="text-sm text-gray-500 mt-1">{user.name}</p>
//         </div>
        
//         <nav className="p-4 space-y-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === item.id
//                     ? "bg-blue-50 text-blue-700"
//                     : "text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <Icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </div>
//                 {item.badge > 0 && (
//                   <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                     {item.badge}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="ml-64 flex-1 p-8">
//         {/* Overview Tab */}
//         {activeTab === "overview" && analytics && (
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
//               <p className="text-gray-600">Monitor your platform statistics and activity</p>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-blue-50 rounded-lg">
//                     <Users className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <TrendingUp className="w-5 h-5 text-green-500" />
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
//                 <p className="text-sm text-gray-600 mt-1">Total Users</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-green-50 rounded-lg">
//                     <CheckCircle className="w-6 h-6 text-green-600" />
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">{analytics.verifiedUsers}</p>
//                 <p className="text-sm text-gray-600 mt-1">Verified Users</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-purple-50 rounded-lg">
//                     <Activity className="w-6 h-6 text-purple-600" />
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">{analytics.totalQuestions}</p>
//                 <p className="text-sm text-gray-600 mt-1">Total Questions</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-pink-50 rounded-lg">
//                     <Award className="w-6 h-6 text-pink-600" />
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">{analytics.totalLikes}</p>
//                 <p className="text-sm text-gray-600 mt-1">Total Likes</p>
//               </div>
//             </div>

//             {/* Secondary Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <p className="text-2xl font-bold text-gray-900">{analytics.totalFields}</p>
//                 <p className="text-sm text-gray-600 mt-1">Fields</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <p className="text-2xl font-bold text-gray-900">{analytics.totalCategories}</p>
//                 <p className="text-sm text-gray-600 mt-1">Categories</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <AlertCircle className="w-5 h-5 text-yellow-500" />
//                   <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
//                 </div>
//                 <p className="text-sm text-gray-600">Pending Verifications</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Flag className="w-5 h-5 text-red-500" />
//                   <p className="text-2xl font-bold text-red-600">{analytics.pendingReports || 0}</p>
//                 </div>
//                 <p className="text-sm text-gray-600">Pending Reports</p>
//               </div>
//             </div>

//             {/* Top Contributors */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-6">Top Contributors</h3>
//               <div className="space-y-4">
//                 {analytics.topContributors.map((contributor, index) => {
//                   const badge = getBadge(contributor.questionCount);
//                   return (
//                     <div key={contributor.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div className="flex items-center gap-4">
//                         <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-bold">
//                           #{index + 1}
//                         </div>
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <span className="font-semibold text-gray-900">{contributor.user.name}</span>
//                             {contributor.user.isVerified && (
//                               <img
//                                 src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
//                                 alt="Verified"
//                                 className="w-4 h-4"
//                               />
//                             )}
//                             {badge && (
//                               <span className="text-lg" title={badge.name}>
//                                 {badge.emoji}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-sm text-gray-600">{contributor.user.email}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-blue-600">{contributor.questionCount} questions</p>
//                         <p className="text-sm text-gray-600">{contributor.totalLikes} likes</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reports Tab */}
//         {activeTab === "reports" && (
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">Content Reports</h2>
//               <p className="text-gray-600">Review and manage reported content</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Pending Reports ({reports.length})
//                 </h3>
//               </div>

//               {reports.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No pending reports</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {reports.map((report) => (
//                     <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2">
//                             <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
//                               REPORTED
//                             </span>
//                             <span className="text-sm text-gray-600">
//                               by {report.reportedByUser.name}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-500">
//                             {new Date(report.createdAt).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>

//                       {selectedReport?.id === report.id ? (
//                         <div className="mt-4 space-y-4">
//                           <div className="bg-gray-50 rounded-lg p-4">
//                             <h4 className="font-semibold text-gray-900 mb-3">Question Details</h4>
//                             <div className="space-y-2 text-sm">
//                               <p><span className="font-medium">Posted by:</span> {report.question.user.name}</p>
//                               <p><span className="font-medium">Category:</span> {report.question.category.field.name} › {report.question.category.name}</p>
//                               <p><span className="font-medium">Question:</span> {report.question.questionText}</p>
//                               <p><span className="font-medium">Answer:</span> {report.question.answer}</p>
//                             </div>
//                           </div>

//                           <div className="bg-red-50 rounded-lg p-4">
//                             <h4 className="font-semibold text-red-800 mb-2">Report Reason</h4>
//                             <p className="text-sm text-red-900">{report.reason}</p>
//                           </div>

//                           <div className="flex gap-3">
//                             <button
//                               onClick={() => handleReportAction(report.id, "delete_question")}
//                               className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                               Delete Question
//                             </button>
//                             <button
//                               onClick={() => handleReportAction(report.id, "dismiss")}
//                               className="flex-1 bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
//                             >
//                               <Check className="w-4 h-4" />
//                               Dismiss Report
//                             </button>
//                             <button
//                               onClick={() => setSelectedReport(null)}
//                               className="px-6 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors"
//                             >
//                               Close
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div>
//                           <p className="text-sm text-gray-700 mb-3 line-clamp-2">
//                             <span className="font-medium">Question:</span> {report.question.questionText}
//                           </p>
//                           <button
//                             onClick={() => setSelectedReport(report)}
//                             className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                           >
//                             View Details & Take Action →
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Verifications Tab */}
//         {activeTab === "verifications" && (
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">Verification Requests</h2>
//               <p className="text-gray-600">Review and approve user verification requests</p>
//             </div>

//             {/* Pending Requests */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Pending Requests ({pendingRequests.length})
//                 </h3>
//               </div>

//               {pendingRequests.length === 0 ? (
//                 <div className="text-center py-12">
//                   <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No pending verification requests</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingRequests.map((request) => (
//                     <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h4 className="font-semibold text-lg text-gray-900">{request.user.name}</h4>
//                           <p className="text-sm text-gray-600">{request.user.email}</p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Submitted: {new Date(request.createdAt).toLocaleString()}
//                           </p>
//                         </div>
//                         <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
//                           Pending
//                         </span>
//                       </div>

//                       {selectedRequest?.id === request.id ? (
//                         <div className="mt-4 space-y-4">
//                           <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
//                             <div>
//                               <p className="text-xs font-medium text-gray-500 mb-1">University</p>
//                               <p className="text-sm text-gray-900">{request.university}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs font-medium text-gray-500 mb-1">Work Status</p>
//                               <p className="text-sm text-gray-900">{request.workStatus}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
//                               <p className="text-sm text-gray-900">{request.location}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs font-medium text-gray-500 mb-1">Mobile</p>
//                               <p className="text-sm text-gray-900">{request.mobileNumber}</p>
//                             </div>
//                           </div>

//                           {request.socialMediaLinks && (
//                             <div className="bg-gray-50 rounded-lg p-4">
//                               <p className="text-xs font-medium text-gray-500 mb-2">Social Media</p>
//                               <div className="space-y-1">
//                                 {request.socialMediaLinks.linkedin && (
//                                   <a href={request.socialMediaLinks.linkedin} target="_blank" className="text-sm text-blue-600 hover:underline block">
//                                     LinkedIn →
//                                   </a>
//                                 )}
//                                 {request.socialMediaLinks.twitter && (
//                                   <a href={request.socialMediaLinks.twitter} target="_blank" className="text-sm text-blue-600 hover:underline block">
//                                     Twitter →
//                                   </a>
//                                 )}
//                                 {request.socialMediaLinks.github && (
//                                   <a href={request.socialMediaLinks.github} target="_blank" className="text-sm text-blue-600 hover:underline block">
//                                     GitHub →
//                                   </a>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           <div className="flex gap-3">
//                             <button
//                               onClick={() => handleVerificationAction(request.id, "approve")}
//                               className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2">
//                               <Check className="w-4 h-4" />
//                               Approve & Verify
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setShowRejectionModal(true);
//                                 setRejectionReason("");
//                               }}
//                               className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
//                             >
//                               <X className="w-4 h-4" />
//                               Reject
//                             </button>
//                             <button
//                               onClick={() => setSelectedRequest(null)}
//                               className="px-6 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors"
//                             >
//                               Close
//                             </button>
//                           </div>

//                           {showRejectionModal && (
//                             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                               <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//                                 <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Verification</h3>
//                                 <p className="text-sm text-gray-600 mb-4">
//                                   Please provide a reason for rejection.
//                                 </p>
//                                 <textarea
//                                   value={rejectionReason}
//                                   onChange={(e) => setRejectionReason(e.target.value)}
//                                   placeholder="Enter rejection reason..."
//                                   className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                   required
//                                 />
//                                 <div className="flex gap-3">
//                                   <button
//                                     onClick={() => handleVerificationAction(request.id, "reject")}
//                                     className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium transition-colors"
//                                     disabled={!rejectionReason.trim()}
//                                   >
//                                     Confirm Rejection
//                                   </button>
//                                   <button
//                                     onClick={() => {
//                                       setShowRejectionModal(false);
//                                       setRejectionReason("");
//                                     }}
//                                     className="px-6 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-medium transition-colors"
//                                   >
//                                     Cancel
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => setSelectedRequest(request)}
//                           className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                         >
//                           View Details & Review →
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Approved Requests */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">
//                 Approved Verifications ({approvedRequests.length})
//               </h3>
//               {approvedRequests.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No approved verifications yet</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {approvedRequests.map((request) => (
//                     <div key={request.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-gray-900">{request.user.name}</span>
//                           <img
//                             src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
//                             alt="Verified"
//                             className="w-4 h-4"
//                           />
//                         </div>
//                         <p className="text-xs text-gray-600">
//                           {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : "N/A"}
//                         </p>
//                       </div>
//                       <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
//                         Verified
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Users Tab */}
//         {activeTab === "users" && (
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">User Management</h2>
//               <p className="text-gray-600">Manage user accounts and permissions</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Badge
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Questions
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Role
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {users.map((u) => {
//                       const badge = getBadge(u.questionCount || 0);
//                       return (
//                         <tr key={u.id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <span className="font-medium text-gray-900">{u.name}</span>
//                               {u.isVerified && (
//                                 <img
//                                   src="https://res.cloudinary.com/dk7yaqqyt/image/upload/v1762100837/interview-qa-profiles/xf7lo8jpjhqcf6sju1xx.png"
//                                   alt="Verified"
//                                   className="w-4 h-4"
//                                 />
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                             {u.email}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {badge ? (
//                               <div className="flex items-center gap-2">
//                                 <span className="text-2xl">{badge.emoji}</span>
//                                 <span className="text-sm font-medium text-gray-700">{badge.name}</span>
//                               </div>
//                             ) : (
//                               <span className="text-sm text-gray-400">No badge</span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="text-sm font-semibold text-blue-600">{u.questionCount || 0}</span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <select
//                               value={u.role}
//                               onChange={(e) => handleRoleChange(u.id, e.target.value)}
//                               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               disabled={u.id === user.id}
//                             >
//                               <option value="user">User</option>
//                               <option value="moderator">Moderator</option>
//                               <option value="admin">Admin</option>
//                             </select>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {u.isVerified ? (
//                               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
//                                 Verified
//                               </span>
//                             ) : (
//                               <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
//                                 Unverified
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {u.id !== user.id && (
//                               <button
//                                 onClick={() => handleDeleteUser(u.id)}
//                                 className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                                 Delete
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Fields & Categories Tab */}
//         {activeTab === "fields" && (
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">Fields & Categories</h2>
//               <p className="text-gray-600">Organize your content structure</p>
//             </div>

//             {/* Create Forms */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Field</h3>
//                 <form onSubmit={handleCreateField} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Field Name
//                     </label>
//                     <input
//                       type="text"
//                       value={newFieldName}
//                       onChange={(e) => setNewFieldName(e.target.value)}
//                       placeholder="e.g., Computer Science"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description (Optional)
//                     </label>
//                     <textarea
//                       value={newFieldDesc}
//                       onChange={(e) => setNewFieldDesc(e.target.value)}
//                       placeholder="Brief description..."
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
//                   >
//                     Create Field
//                   </button>
//                 </form>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
//                 <form onSubmit={handleCreateCategory} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Field
//                     </label>
//                     <select
//                       value={selectedFieldForCategory}
//                       onChange={(e) => setSelectedFieldForCategory(e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     >
//                       <option value="">Choose a field...</option>
//                       {fields.map((field) => (
//                         <option key={field.id} value={field.id}>
//                           {field.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category Name
//                     </label>
//                     <input
//                       type="text"
//                       value={newCategoryName}
//                       onChange={(e) => setNewCategoryName(e.target.value)}
//                       placeholder="e.g., Data Structures"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description (Optional)
//                     </label>
//                     <textarea
//                       value={newCategoryDesc}
//                       onChange={(e) => setNewCategoryDesc(e.target.value)}
//                       placeholder="Brief description..."
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
//                   >
//                     Create Category
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Existing Fields */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Existing Fields & Categories</h3>
//               <div className="space-y-4">
//                 {fields.map((field) => (
//                   <div key={field.id} className="border border-gray-200 rounded-lg p-5">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h4 className="font-bold text-lg text-gray-900">{field.name}</h4>
//                         {field.description && (
//                           <p className="text-sm text-gray-600 mt-1">{field.description}</p>
//                         )}
//                         <p className="text-xs text-gray-500 mt-2">
//                           {field.categories?.length || 0} categories
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleDeleteField(field.id)}
//                         className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                         Delete
//                       </button>
//                     </div>
//                     <div className="ml-4 space-y-2">
//                       {field.categories?.map((category) => (
//                         <div
//                           key={category.id}
//                           className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg"
//                         >
//                           <span className="text-sm font-medium text-gray-900">{category.name}</span>
//                           <button
//                             onClick={() => handleDeleteCategory(category.id)}
//                             className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1"
//                           >
//                             <Trash2 className="w-3 h-3" />
//                             Delete
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }













// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import OverviewTab from "./_components/OverviewTab";
import ReportsTab from "./_components/ReportsTab";
import VerificationsTab from "./_components/VerificationsTab";
import UsersTab from "./_components/UsersTab";
import FieldsTab from "./_components/FieldsTab";
import { User, Analytics, Field, VerificationRequest, Report } from "./_components/types";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchAnalytics();
    fetchUsers();
    fetchFields();
    fetchVerificationRequests();
    fetchReports();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.user.role !== "admin" && data.user.role !== "moderator") {
        router.push("/");
        return;
      }
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFields = async () => {
    try {
      const res = await fetch("/api/fields");
      const data = await res.json();
      setFields(data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  const fetchVerificationRequests = async () => {
    try {
      const res = await fetch("/api/admin/verification");
      if (res.ok) {
        const data = await res.json();
        setVerificationRequests(data);
      }
    } catch (error) {
      console.error("Error fetching verification requests:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleVerificationAction = async (requestId: string, action: string, rejectionReason?: string) => {
    if (action === "reject" && !rejectionReason?.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      const res = await fetch(`/api/admin/verification/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      });
     
      if (res.ok) {
        fetchVerificationRequests();
        fetchUsers();
        fetchAnalytics();
        alert(action === "approve" ? "User verified successfully!" : "Verification rejected.");
      }
    } catch (error) {
      console.error("Error processing verification:", error);
    }
  };

  const handleReportAction = async (reportId: string, action: string) => {
    const confirmMsg = action === "delete_question"
      ? "Are you sure you want to delete this question and all related data?"
      : "Are you sure you want to dismiss this report?";

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchReports();
        fetchAnalytics();
      } else {
        alert(data.error || "Action failed");
      }
    } catch (error) {
      console.error("Error handling report:", error);
      alert("An error occurred");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchUsers();
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateField = async (name: string, description: string) => {
    try {
      const res = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        fetchFields();
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error creating field:", error);
    }
  };

  const handleCreateCategory = async (name: string, description: string, fieldId: string) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, fieldId }),
      });

      if (res.ok) {
        fetchFields();
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm("Delete this field and all its categories?")) return;

    try {
      await fetch(`/api/fields/${fieldId}`, { method: "DELETE" });
      fetchFields();
      fetchAnalytics();
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Delete this category and all its questions?")) return;

    try {
      await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      fetchFields();
      fetchAnalytics();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pendingRequests = verificationRequests.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        userName={user.name}
        activeTab={activeTab}
        pendingReportsCount={reports.length}
        pendingVerificationsCount={pendingRequests.length}
        onTabChange={setActiveTab}
      />

      <div className="ml-64 flex-1 p-8">
        {activeTab === "overview" && analytics && (
          <OverviewTab
            analytics={analytics}
            pendingReportsCount={reports.length}
            pendingVerificationsCount={pendingRequests.length}
          />
        )}

        {activeTab === "reports" && (
          <ReportsTab
            reports={reports}
            onReportAction={handleReportAction}
          />
        )}

        {activeTab === "verifications" && (
          <VerificationsTab
            verificationRequests={verificationRequests}
            onVerificationAction={handleVerificationAction}
          />
        )}

        {activeTab === "users" && (
          <UsersTab
            users={users}
            currentUserId={user.id}
            onRoleChange={handleRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === "fields" && (
          <FieldsTab
            fields={fields}
            onCreateField={handleCreateField}
            onCreateCategory={handleCreateCategory}
            onDeleteField={handleDeleteField}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </div>
    </div>
  );
}
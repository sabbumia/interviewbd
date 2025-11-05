// // src/app/page.tsx

// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   ArrowRight, 
//   BookOpen, 
//   Users, 
//   Shield, 
//   MessageSquare, 
//   Award,
//   TrendingUp,
//   Star,
//   CheckCircle,
//   Layers,
//   Sparkles,
//   Heart,
//   Code,
//   Brain,
//   Briefcase,
//   GraduationCap,
//   Trophy,
//   ThumbsUp,
//   Crown,
//   Zap,
//   Target,
//   Plus,
//   Search,
//   User
// } from 'lucide-react';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   profilePicture?: string;
//   isVerified: boolean;
//   role: string;
//   questionCount: number;
//   likeCount?: number;
// }

// interface Field {
//   id: string;
//   name: string;
//   description: string;
//   questionCount: number;
// }

// interface Stats {
//   totalUsers: number;
//   totalQuestions: number;
//   totalFields: number;
//   totalCategories: number;
// }

// interface HomepageData {
//   stats: Stats;
//   topFields: Field[];
//   topQuestionUsers: User[];
//   topLikedUsers: User[];
// }

// interface CurrentUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   isVerified: boolean;
// }

// export default function Homepage() {
//   const router = useRouter();
//   const [data, setData] = useState<HomepageData | null>(null);
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [animatedStats, setAnimatedStats] = useState({
//     users: 0,
//     questions: 0,
//     fields: 0,
//     categories: 0
//   });

//   useEffect(() => {
//     fetchCurrentUser();
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (data) {
//       animateStats();
//     }
//   }, [data]);

//   const fetchCurrentUser = async () => {
//     try {
//       const res = await fetch('/api/auth/me');
//       if (res.ok) {
//         const result = await res.json();
//         setCurrentUser(result.user);
//       }
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetch('/api/stats/homepage');
//       if (res.ok) {
//         const result = await res.json();
//         setData(result);
//       }
//     } catch (error) {
//       console.error('Error fetching homepage data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const animateStats = () => {
//     if (!data) return;

//     const duration = 2000;
//     const steps = 60;
//     const interval = duration / steps;

//     let step = 0;
//     const timer = setInterval(() => {
//       step++;
//       setAnimatedStats({
//         users: Math.floor((data.stats.totalUsers / steps) * step),
//         questions: Math.floor((data.stats.totalQuestions / steps) * step),
//         fields: Math.floor((data.stats.totalFields / steps) * step),
//         categories: Math.floor((data.stats.totalCategories / steps) * step)
//       });

//       if (step >= steps) clearInterval(timer);
//     }, interval);

//     return () => clearInterval(timer);
//   };

//   const handleFieldClick = (fieldId: string) => {
//     router.push(`/fields/${fieldId}`);
//   };

//   const handleUserClick = (userId: string) => {
//     router.push(`/users/${userId}`);
//   };

//   const getFieldIcon = (name: string) => {
//     const lowerName = name.toLowerCase();
//     if (lowerName.includes('web') || lowerName.includes('development')) return Code;
//     if (lowerName.includes('machine') || lowerName.includes('learning') || lowerName.includes('ai')) return Brain;
//     if (lowerName.includes('teach') || lowerName.includes('education')) return GraduationCap;
//     if (lowerName.includes('business') || lowerName.includes('admin')) return Briefcase;
//     return Layers;
//   };

//   const getFieldColor = (index: number) => {
//     const colors = [
//       'from-blue-600 to-indigo-600',
//       'from-violet-600 to-purple-600',
//       'from-emerald-600 to-teal-600',
//       'from-orange-600 to-amber-600'
//     ];
//     return colors[index % colors.length];
//   };

//   const getBadgeInfo = (questionCount: number) => {
//     if (questionCount >= 200) return { icon: '🌟', name: 'Legendary Asker' };
//     if (questionCount >= 100) return { icon: '🧠', name: 'Expert Inquirer' };
//     if (questionCount >= 50) return { icon: '🔥', name: 'Pro Questioner' };
//     if (questionCount >= 20) return { icon: '💡', name: 'Inquirer' };
//     if (questionCount >= 10) return { icon: '🔍', name: 'Seeker' };
//     if (questionCount >= 5) return { icon: '🌱', name: 'Curious' };
//     return { icon: '🐣', name: 'Newbie' };
//   };

//   const features = [
//     {
//       icon: BookOpen,
//       title: 'Diverse Question Bank',
//       description: 'Access thousands of interview questions across multiple fields and categories'
//     },
//     {
//       icon: Users,
//       title: 'Connect & Network',
//       description: 'Build connections with professionals and learners in your field'
//     },
//     {
//       icon: Award,
//       title: 'Earn Badges',
//       description: 'Get recognized for your contributions with achievement badges'
//     },
//     {
//       icon: MessageSquare,
//       title: 'Real-time Messaging',
//       description: 'Chat with other users and share knowledge instantly'
//     },
//     {
//       icon: Shield,
//       title: 'Verified Accounts',
//       description: 'Get the blue verification badge and build credibility'
//     },
//     {
//       icon: TrendingUp,
//       title: 'Track Progress',
//       description: 'Monitor your learning journey and see your growth over time'
//     }
//   ];

//   const badges = [
//     { icon: '🐣', name: 'Newbie', range: '1-4 questions' },
//     { icon: '🌱', name: 'Curious', range: '5-9 questions' },
//     { icon: '🔍', name: 'Seeker', range: '10-19 questions' },
//     { icon: '💡', name: 'Inquirer', range: '20-49 questions' },
//     { icon: '🔥', name: 'Pro Questioner', range: '50-99 questions' },
//     { icon: '🧠', name: 'Expert Inquirer', range: '100-199 questions' },
//     { icon: '🌟', name: 'Legendary Asker', range: '200+ questions' }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Hero Section */}
//       <section className="relative pt-32 pb-20 px-4 overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
//           <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
//         </div>

//         <div className="relative max-w-6xl mx-auto text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-6">
//             <Sparkles className="w-4 h-4" />
//             Welcome to InterviewBD
//           </div>
          
//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
//             Master Your
//             <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Interview </span>
//             Skills
//           </h1>
          
//           <div className="max-w-3xl mx-auto mb-8">
//             <p className="text-xl md:text-2xl text-gray-600 italic font-light leading-relaxed">
//               "From every question, from every answer — knowledge takes its first breath."
//             </p>
//           </div>

//           <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
//             Practice with thousands of interview questions, connect with professionals, 
//             and elevate your career preparation
//           </p>

//           {/* Different CTAs based on login status */}
//           {currentUser ? (
//             // Logged in users - 3 action buttons
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <button 
//                 onClick={() => router.push('/fields')}
//                 className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
//               >
//                 <Search className="w-5 h-5" />
//                 Browse Questions
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button 
//                 onClick={() => router.push('/fields/add-question')}
//                 className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
//               >
//                 <Plus className="w-5 h-5" />
//                 Add Question
//               </button>
//               <button 
//                 onClick={() => router.push('/users')}
//                 className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
//               >
//                 <Users className="w-5 h-5" />
//                 Network
//               </button>
//             </div>
//           ) : (
//             // Not logged in users - Sign up & Explore
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <button 
//                 onClick={() => router.push('/signup')}
//                 className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
//               >
//                 Get Started Free
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button 
//                 onClick={() => router.push('/fields')}
//                 className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
//               >
//                 Explore Questions
//               </button>
//             </div>
//           )}

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
//             {[
//               { label: 'Active Users', value: animatedStats.users.toLocaleString(), icon: Users },
//               { label: 'Questions', value: animatedStats.questions.toLocaleString(), icon: BookOpen },
//               { label: 'Fields', value: animatedStats.fields, icon: Layers },
//               { label: 'Categories', value: animatedStats.categories, icon: Sparkles }
//             ].map((stat, i) => {
//               const Icon = stat.icon;
//               return (
//                 <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//                   <Icon className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
//                   <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
//                   <div className="text-sm text-gray-600">{stat.label}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Fields Section */}
//       <section className="py-20 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Popular Fields
//             </h2>
//             <p className="text-lg text-gray-600">
//               Explore our most active fields based on question count
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {data?.topFields.map((field, i) => {
//               const Icon = getFieldIcon(field.name);
//               const color = getFieldColor(i);
//               return (
//                 <div
//                   key={field.id}
//                   onClick={() => handleFieldClick(field.id)}
//                   className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
//                 >
//                   <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
//                   <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//                     <Icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">{field.name}</h3>
//                   <p className="text-gray-600 mb-4">{field.questionCount} Questions</p>
//                   <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
//                     Explore
//                     <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Top Contributors Section */}
//       <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full text-sm font-medium text-yellow-700 mb-4">
//               <Trophy className="w-4 h-4" />
//               Top Contributors
//             </div>
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Most Active Question Posters
//             </h2>
//             <p className="text-lg text-gray-600">
//               Celebrating our community's most dedicated contributors
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
//             {data?.topQuestionUsers.map((user, i) => {
//               const badge = getBadgeInfo(user.questionCount);
//               return (
//                 <div
//                   key={user.id}
//                   onClick={() => handleUserClick(user.id)}
//                   className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden cursor-pointer"
//                 >
//                   {i === 0 && (
//                     <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-bl-full flex items-start justify-end p-2">
//                       <Crown className="w-5 h-5 text-white" />
//                     </div>
//                   )}
                  
//                   <div className="relative inline-block mb-4">
//                     <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur opacity-40"></div>
//                     <img
//                       src={user.profilePicture || 'https://via.placeholder.com/80'}
//                       alt={user.name}
//                       className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
//                     />
//                     {user.isVerified && (
//                       <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
//                         <Award className="w-4 h-4 text-white" />
//                       </div>
//                     )}
//                   </div>

//                   <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
//                   <p className="text-sm text-gray-600 mb-3 truncate">{user.email}</p>
                  
//                   <div className="flex items-center justify-center gap-2 mb-3">
//                     <span className="text-2xl">{badge.icon}</span>
//                     <span className="text-xs font-semibold text-gray-700">{badge.name}</span>
//                   </div>

//                   <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3">
//                     <div className="flex items-center justify-center gap-2 text-indigo-700">
//                       <BookOpen className="w-4 h-4" />
//                       <span className="text-2xl font-bold">{user.questionCount}</span>
//                     </div>
//                     <p className="text-xs text-gray-600 mt-1">Questions Posted</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Top Liked Users Section */}
//       <section className="py-20 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm font-medium text-pink-700 mb-4">
//               <Heart className="w-4 h-4" />
//               Most Appreciated
//             </div>
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Top Liked Contributors
//             </h2>
//             <p className="text-lg text-gray-600">
//               Users whose questions received the most likes from the community
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
//             {data?.topLikedUsers.map((user, i) => {
//               const badge = getBadgeInfo(user.questionCount);
//               return (
//                 <div
//                   key={user.id}
//                   onClick={() => handleUserClick(user.id)}
//                   className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden cursor-pointer"
//                 >
//                   {i === 0 && (
//                     <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-bl-full flex items-start justify-end p-2">
//                       <Star className="w-5 h-5 text-white fill-white" />
//                     </div>
//                   )}
                  
//                   <div className="relative inline-block mb-4">
//                     <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur opacity-40"></div>
//                     <img
//                       src={user.profilePicture || 'https://via.placeholder.com/80'}
//                       alt={user.name}
//                       className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
//                     />
//                     {user.isVerified && (
//                       <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
//                         <Award className="w-4 h-4 text-white" />
//                       </div>
//                     )}
//                   </div>

//                   <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
//                   <p className="text-sm text-gray-600 mb-3 truncate">{user.email}</p>
                  
//                   <div className="flex items-center justify-center gap-2 mb-3">
//                     <span className="text-2xl">{badge.icon}</span>
//                     <span className="text-xs font-semibold text-gray-700">{badge.name}</span>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3">
//                       <div className="flex items-center justify-center gap-2 text-rose-700">
//                         <ThumbsUp className="w-4 h-4" />
//                         <span className="text-2xl font-bold">{user.likeCount}</span>
//                       </div>
//                       <p className="text-xs text-gray-600 mt-1">Total Likes</p>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       <span className="font-semibold">{user.questionCount}</span> Questions
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Why Choose InterviewBD?
//             </h2>
//             <p className="text-lg text-gray-600">
//               Everything you need to ace your interviews
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, i) => {
//               const Icon = feature.icon;
//               return (
//                 <div
//                   key={i}
//                   className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                 >
//                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
//                     <Icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.description}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Badge System Section */}
//       <section className="py-20 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Achievement Badge System
//             </h2>
//             <p className="text-lg text-gray-600">
//               Earn badges as you contribute more questions to the community
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
//             {badges.map((badge, i) => (
//               <div
//                 key={i}
//                 className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
//               >
//                 <div className="text-4xl mb-2">{badge.icon}</div>
//                 <div className="font-bold text-gray-900 text-sm mb-1">{badge.name}</div>
//                 <div className="text-xs text-gray-600">{badge.range}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               How It Works
//             </h2>
//             <p className="text-lg text-gray-600">
//               Get started in three simple steps
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 step: '01',
//                 icon: Users,
//                 title: 'Create Account',
//                 description: 'Sign up for free and set up your profile with your interests'
//               },
//               {
//                 step: '02',
//                 icon: Target,
//                 title: 'Choose Your Field',
//                 description: 'Browse through various fields and select categories you want to practice'
//               },
//               {
//                 step: '03',
//                 icon: Zap,
//                 title: 'Start Practicing',
//                 description: 'Post questions, answer others, and earn badges as you grow'
//               }
//             ].map((step, i) => {
//               const Icon = step.icon;
//               return (
//                 <div key={i} className="relative">
//                   {i < 2 && (
//                     <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent"></div>
//                   )}
//                   <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative z-10">
//                     <div className="text-6xl font-bold text-indigo-100 mb-4">{step.step}</div>
//                     <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
//                       <Icon className="w-7 h-7 text-white" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
//                     <p className="text-gray-600">{step.description}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Verification Section - Only show if user is logged in and not verified */}
//       {currentUser && !currentUser.isVerified && (
//         <section className="py-20 px-4 bg-white">
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden">
//               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
//               <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
//               <div className="relative z-10">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                     <Shield className="w-6 h-6" />
//                   </div>
//                   <h2 className="text-3xl font-bold">Get Verified</h2>
//                 </div>
//                 <p className="text-lg text-indigo-100 mb-6">
//                   Stand out from the crowd with a blue verification badge. Submit your verification 
//                   request and our team will review it within 24-48 hours.
//                 </p>
//                 <ul className="space-y-3 mb-8">
//                   {[
//                     'Increase your credibility',
//                     'Gain trust from the community',
//                     'Unlock exclusive features',
//                     'Priority in search results'
//                   ].map((benefit, i) => (
//                     <li key={i} className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 flex-shrink-0" />
//                       <span>{benefit}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <button 
//                   onClick={() => router.push('/profile?tab=verification')}
//                   className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
//                 >
//                   Apply for Verification
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* CTA Section */}
//       <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 mb-6">
//             <Heart className="w-4 h-4" />
//             Join Our Growing Community
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//             Ready to Start Your Journey?
//           </h2>
//           <p className="text-xl text-gray-600 mb-10">
//             Join thousands of professionals preparing for their dream careers
//           </p>
          
//           {/* Different CTAs based on login status */}
//           {currentUser ? (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button 
//                 onClick={() => router.push('/profile')}
//                 className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
//               >
//                 <User className="w-5 h-5" />
//                 View My Profile
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button 
//                 onClick={() => router.push('/messages')}
//                 className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
//               >
//                 <MessageSquare className="w-5 h-5" />
//                 My Messages
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button 
//                 onClick={() => router.push('/signup')}
//                 className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
//               >
//                 Sign Up Now
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button 
//                 onClick={() => router.push('/fields')}
//                 className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
//               >
//                 Browse Questions
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// }






























// src/app/page.tsx

'use client';
import { useState, useEffect } from 'react';
import HeroSection from './_components/HeroSection';
import FieldsSection from './_components/FieldsSection';
import TopContributorsSection from './_components/TopContributorsSection';
import TopLikedUsersSection from './_components/TopLikedUsersSection';
import FeaturesSection from './_components/FeaturesSection';
import BadgeSystemSection from './_components/BadgeSystemSection';
import HowItWorksSection from './_components/HowItWorksSection';
import VerificationSection from './_components/VerificationSection';
import CTASection from './_components/CTASection';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  role: string;
  questionCount: number;
  likeCount?: number;
}

interface Field {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

interface Stats {
  totalUsers: number;
  totalQuestions: number;
  totalFields: number;
  totalCategories: number;
}

interface HomepageData {
  stats: Stats;
  topFields: Field[];
  topQuestionUsers: User[];
  topLikedUsers: User[];
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export default function Homepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    questions: 0,
    fields: 0,
    categories: 0
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      animateStats();
    }
  }, [data]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const result = await res.json();
        setCurrentUser(result.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/stats/homepage');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    if (!data) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedStats({
        users: Math.floor((data.stats.totalUsers / steps) * step),
        questions: Math.floor((data.stats.totalQuestions / steps) * step),
        fields: Math.floor((data.stats.totalFields / steps) * step),
        categories: Math.floor((data.stats.totalCategories / steps) * step)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 1. Hero Section */}
      <HeroSection currentUser={currentUser} animatedStats={animatedStats} />

      {/* 2. Fields Section */}
      {data && <FieldsSection fields={data.topFields} />}

      {/* 3. Top Contributors Section */}
      {data && <TopContributorsSection users={data.topQuestionUsers} />}

      {/* 4. Top Liked Users Section */}
      {data && <TopLikedUsersSection users={data.topLikedUsers} />}

      {/* 5. Features Section */}
      <FeaturesSection />

      {/* 6. Badge System Section */}
      <BadgeSystemSection />

      {/* 7. How It Works Section */}
      <HowItWorksSection />

      {/* 8. Verification Section (Conditional) */}
      <VerificationSection currentUser={currentUser} />

      {/* 9. CTA Section */}
      <CTASection currentUser={currentUser} />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
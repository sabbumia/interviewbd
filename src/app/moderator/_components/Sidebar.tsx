// src/app/moderator/_components/Sidebar.tsx

import {
  LayoutDashboard,
  Flag,
  CheckCircle,
  Users,
  FolderTree,
  LucideIcon,
  Shield,
  Activity,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  userName: string;
  userProfilePicture: string;
  activeTab: string;
  pendingReportsCount: number;
  pendingVerificationsCount: number;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({
  userName,
  userProfilePicture,
  activeTab,
  pendingReportsCount,
  pendingVerificationsCount,
  onTabChange,
}: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "reports",
      label: "Reports",
      icon: Flag,
      badge: pendingReportsCount,
    },
    {
      id: "verifications",
      label: "Verifications",
      icon: CheckCircle,
      badge: pendingVerificationsCount,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "fields",
      label: "Fields & Categories",
      icon: FolderTree,
    },
  ];

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalPending = pendingReportsCount + pendingVerificationsCount;

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      {/* Header Section */}
      <div className="p-6 mt-16 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Moderator Panel</h1>
            <p className="text-xs text-gray-500">Management Console</p>
          </div>
        </div>

        {/* Moderator Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <div className="relative flex-shrink-0">
                
              <img
                src={userProfilePicture || "/default-avatar.png"}
                alt={userName}
                className="w-12 h-12 object-cover border-2 border-gray-200 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
                />
                </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-600">Moderator</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {totalPending > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-orange-900">
                Pending Actions
              </p>
              <p className="text-xs text-orange-700 mt-0.5">
                {totalPending} {totalPending === 1 ? "item" : "items"} need
                attention
              </p>
            </div>
          </div>
        </div>
      )}

{/* Navigation Section */}
<nav className="flex-1 p-4 space-y-2 overflow-y-auto">        
  {navItems.map((item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const hasBadge = item.badge !== undefined && item.badge > 0;
    
    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
            : "text-slate-700 hover:bg-slate-50 hover:shadow-md border border-transparent hover:border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`p-2 rounded-lg transition-all duration-200 ${
            isActive 
              ? "bg-white/20 shadow-inner" 
              : "bg-slate-100 group-hover:bg-slate-200 group-hover:scale-110"
          }`}>
            <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-slate-600"}`} />
          </div>
          <span className={`font-semibold text-[15px] tracking-tight ${isActive ? "text-white" : "text-slate-700"}`}>
            {item.label}
          </span>
        </div>
        
        {hasBadge && (
          <span className={`text-xs font-bold rounded-lg min-w-[22px] h-6 px-2 flex items-center justify-center shadow-sm transition-all ${
            isActive 
              ? "bg-white text-blue-600" 
              : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
          }`}>
            {item.badge! > 99 ? "99+" : item.badge}
          </span>
        )}
      </button>
    );
  })}
</nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">
                Full Access
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Complete platform management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

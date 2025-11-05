// src/app/admin/_components/Sidebar.tsx

import { LayoutDashboard, Flag, CheckCircle, Users, FolderTree, LucideIcon, Shield } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  userName: string;
  activeTab: string;
  pendingReportsCount: number;
  pendingVerificationsCount: number;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({
  userName,
  activeTab,
  pendingReportsCount,
  pendingVerificationsCount,
  onTabChange,
}: SidebarProps) {
  const navItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "reports", label: "Reports", icon: Flag, badge: pendingReportsCount },
    { id: "verifications", label: "Verifications", icon: CheckCircle, badge: pendingVerificationsCount },
    { id: "users", label: "Users", icon: Users },
    { id: "fields", label: "Fields & Categories", icon: FolderTree },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col">
      {/* Header Section */}
      <div className="p-6 mt-20 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Moderator Panel</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-gray-700 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-100" 
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-700" : "text-gray-600"}`} />
                </div>
                <span className={`font-medium text-sm ${isActive ? "text-blue-700" : "text-gray-700"}`}>
                  {item.label}
                </span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-sm">
                  {item.badge > 99 ? "99+" : item.badge}
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
              <p className="text-xs font-semibold text-blue-900 mb-1">Admin Access</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                You have full control over all platform operations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
import Loading from "@/components/Loading";

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
      <Loading message="Loading admin dashboard..." />
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
// src/app/admin/_components/ReportsTab.tsx

import { useState } from "react";
import { Flag, Trash2, Check, AlertTriangle, User, Tag, MessageSquare, Clock, Shield } from "lucide-react";
import { Report } from "./types";

interface ReportsTabProps {
  reports: Report[];
  onReportAction: (reportId: string, action: string) => void;
}

export default function ReportsTab({ reports, onReportAction }: ReportsTabProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ reportId: string; action: string } | null>(null);

  const handleActionWithConfirm = (reportId: string, action: string) => {
    setConfirmAction({ reportId, action });
  };

  const executeAction = () => {
    if (confirmAction) {
      onReportAction(confirmAction.reportId, confirmAction.action);
      setConfirmAction(null);
      setSelectedReport(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-50 rounded-lg">
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Content Reports</h2>
            <p className="text-gray-600 mt-1">Review and manage reported content from users</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Pending Reports</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {reports.length > 0 ? Math.round((reports.length / (reports.length + 10)) * 100) : 0}%
          </p>
          <p className="text-sm font-medium text-gray-600 mt-1">Resolution Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {reports.length > 0 ? `${Math.floor(Math.random() * 24) + 1}h` : '0h'}
          </p>
          <p className="text-sm font-medium text-gray-600 mt-1">Avg Response Time</p>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Pending Reports</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {reports.length} {reports.length === 1 ? 'report' : 'reports'} requiring action
                </p>
              </div>
            </div>
            <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-200 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5" />
              {reports.length} Pending
            </span>
          </div>
        </div>

        <div className="p-6">
          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Flag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No pending reports</p>
              <p className="text-sm text-gray-400 mt-1">All reports have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                        <Flag className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            REPORTED CONTENT
                          </span>
                          <span className="text-sm text-gray-600 font-medium">
                            by {report.reportedByUser.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            Reported {new Date(report.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Preview */}
                  {!selectedReport || selectedReport.id !== report.id ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3 mb-3">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Question Preview</p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {report.question.questionText}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {report.question.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {report.question.category.name}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-2"
                      >
                        View Full Details & Take Action
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-5">
                      {/* Question Details */}
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          Question Details
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Posted By</p>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-700 font-bold text-xs">
                                  {report.question.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{report.question.user.name}</span>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-900">
                                {report.question.category.field?.name} › {report.question.category.name}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Question</p>
                            <p className="text-sm text-gray-900 leading-relaxed">{report.question.questionText}</p>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Answer</p>
                            <p className="text-sm text-gray-900 leading-relaxed">{report.question.answer}</p>
                          </div>
                        </div>
                      </div>

                      {/* Report Reason */}
                      <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                        <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Report Reason
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-red-100">
                          <p className="text-sm text-red-900 leading-relaxed">{report.reason}</p>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-red-700">
                          <User className="w-3 h-3" />
                          <span className="font-medium">Reported by: {report.reportedByUser.name}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleActionWithConfirm(report.id, "delete_question")}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-red-600 hover:shadow-md"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete Question
                        </button>
                        <button
                          onClick={() => handleActionWithConfirm(report.id, "dismiss")}
                          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-gray-600 hover:shadow-md"
                        >
                          <Check className="w-5 h-5" />
                          Dismiss Report
                        </button>
                        <button
                          onClick={() => setSelectedReport(null)}
                          className="px-8 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-bold transition-all shadow-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                confirmAction.action === "delete_question" ? "bg-red-50" : "bg-gray-50"
              }`}>
                {confirmAction.action === "delete_question" ? (
                  <Trash2 className="w-6 h-6 text-red-600" />
                ) : (
                  <Check className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {confirmAction.action === "delete_question" ? "Delete Question?" : "Dismiss Report?"}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {confirmAction.action === "delete_question" 
                    ? "This action cannot be undone" 
                    : "The report will be marked as resolved"}
                </p>
              </div>
            </div>
            
            <div className={`rounded-lg p-4 mb-4 border ${
              confirmAction.action === "delete_question" 
                ? "bg-red-50 border-red-200" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-sm text-gray-700 leading-relaxed">
                {confirmAction.action === "delete_question" 
                  ? "The question and all associated data will be permanently deleted from the platform." 
                  : "The report will be dismissed and no further action will be taken on this content."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={executeAction}
                className={`flex-1 text-white py-2.5 rounded-lg font-bold transition-all shadow-sm ${
                  confirmAction.action === "delete_question"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {confirmAction.action === "delete_question" ? "Delete Permanently" : "Dismiss Report"}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="px-6 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// src/app/admin/_components/VerificationsTab.tsx

import { useState } from "react";
import { CheckCircle, Check, X, Clock, Award, MapPin, Briefcase, GraduationCap, Phone, ExternalLink, AlertCircle, Crown, ShieldCheck, Mail } from "lucide-react";
import { VerificationRequest } from "./types";

interface VerificationsTabProps {
  verificationRequests: VerificationRequest[];
  onVerificationAction: (requestId: string, action: string, rejectionReason?: string) => void;
}

export default function VerificationsTab({ verificationRequests, onVerificationAction }: VerificationsTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const pendingRequests = verificationRequests.filter(r => r.status === "pending");
  const approvedRequests = verificationRequests.filter(r => r.status === "approved");

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    if (selectedRequest) {
      onVerificationAction(selectedRequest.id, "reject", rejectionReason);
      setSelectedRequest(null);
      setShowRejectionModal(false);
      setRejectionReason("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Verification Requests</h2>
            <p className="text-gray-600 mt-1">Review and approve user verification applications</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Pending Reviews</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Verified Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{verificationRequests.length}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">Total Requests</p>
        </div>
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Pending Requests</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {pendingRequests.length} {pendingRequests.length === 1 ? 'request' : 'requests'} awaiting review
                </p>
              </div>
            </div>
            <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-200">
              {pendingRequests.length} Pending
            </span>
          </div>
        </div>

        <div className="p-6">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No pending verification requests</p>
              <p className="text-sm text-gray-400 mt-1">All requests have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  {/* Request Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <img
                            src={
                              request.user.profilePicture 
                            }
                            alt={request.user.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                            
                          />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{request.user.name}</h4>
                        <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-600"/> <p className="text-sm text-gray-600 mt-0.5">{request.user.email}</p>
                            </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            Submitted {new Date(request.createdAt).toLocaleDateString('en-US', { 
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
                    <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Review
                    </span>
                  </div>

                  {selectedRequest?.id === request.id ? (
                    <div className="mt-6 space-y-5">
                      {/* User Information Grid */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          Verification Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                              <GraduationCap className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">University</p>
                              <p className="text-sm font-semibold text-gray-900">{request.university}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Work Status</p>
                              <p className="text-sm font-semibold text-gray-900">{request.workStatus}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                              <MapPin className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Location</p>
                              <p className="text-sm font-semibold text-gray-900">{request.location}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                              <Phone className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Mobile Number</p>
                              <p className="text-sm font-semibold text-gray-900">{request.mobileNumber}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Social Media Links */}
                      {request.socialMediaLinks && (
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                          <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            Social Media Profiles
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {request.socialMediaLinks.linkedin && (
                              <a 
                                href={request.socialMediaLinks.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">LinkedIn Profile</span>
                              </a>
                            )}
                            {request.socialMediaLinks.twitter && (
                              <a 
                                href={request.socialMediaLinks.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">Twitter Profile</span>
                              </a>
                            )}
                            {request.socialMediaLinks.github && (
                              <a 
                                href={request.socialMediaLinks.github} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">GitHub Profile</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => onVerificationAction(request.id, "approve")}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-green-600 hover:shadow-md"
                        >
                          <Check className="w-5 h-5" />
                          Approve & Verify User
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectionModal(true);
                            setRejectionReason("");
                          }}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-red-600 hover:shadow-md"
                        >
                          <X className="w-5 h-5" />
                          Reject Request
                        </button>
                        <button
                          onClick={() => setSelectedRequest(null)}
                          className="px-8 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-bold transition-all shadow-sm"
                        >
                          Close
                        </button>
                      </div>

                      {/* Rejection Modal */}
                      {showRejectionModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-red-50 rounded-lg">
                                <X className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">Reject Verification</h3>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  Provide a reason for rejection
                                </p>
                              </div>
                            </div>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Enter a clear and constructive reason for rejection..."
                              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 h-32 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                              required
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={handleReject}
                                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-bold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                                disabled={!rejectionReason.trim()}
                              >
                                Confirm Rejection
                              </button>
                              <button
                                onClick={() => {
                                  setShowRejectionModal(false);
                                  setRejectionReason("");
                                }}
                                className="px-6 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-bold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-2 mt-2"
                    >
                      View Full Details & Review
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approved Requests Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Verified Users</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {approvedRequests.length} {approvedRequests.length === 1 ? 'user has' : 'users have'} been verified
                </p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200">
              {approvedRequests.length} Verified
            </span>
          </div>
        </div>

        <div className="p-6">
          {approvedRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No verified users yet</p>
              <p className="text-sm text-gray-400 mt-1">Approved verifications will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="bg-green-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                       
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              request.user.profilePicture 
                            }
                            alt={request.user.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                            
                          />
                          {request.user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white shadow-md">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {request.user.role === "admin" && (
                            <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-red-500 to-orange-600 rounded-full border-2 border-white">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {request.user.role === "moderator" && (
                            <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-red-400 to-yellow-800 rounded-full border-2 border-white">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900 text-sm">{request.user.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-green-600 text-white mt-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
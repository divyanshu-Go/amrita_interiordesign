"use client";

import { useAccount } from "../AccountDataProvider";
import { updateUserProfile } from "@/lib/actions/user";
import { useState } from "react";
import { AlertCircle, CheckCircle, User, Mail, Building2, FileText, Phone, ShieldCheck } from "lucide-react";
import AccountLoader from "@/components/Loaders/AccountLoader";

// Skeleton Loader Component
function ProfileSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Personal Information Card Skeleton */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Card Skeleton */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="mb-5">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-64 bg-gray-100 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfileView() {
  const { user, setUser, loading } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    businessName: user?.enterpriseProfile?.businessName || "",
    gstNumber: user?.enterpriseProfile?.gstNumber || "",
    phone: user?.enterpriseProfile?.phone || "",
  });

  // Show skeleton while loading
  if (loading.user || !user) {
    return <AccountLoader />;
  }

  const isEnterprise = user.role === "enterprise";
  const enterprise = user.enterpriseProfile || {};

  const handleEditClick = () => {
    setFormData({
      name: user.name,
      businessName: enterprise.businessName || "",
      gstNumber: enterprise.gstNumber || "",
      phone: enterprise.phone || "",
    });
    setError(null);
    setSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      const updated = await updateUserProfile({
        name: formData.name,
        ...(isEnterprise && {
          businessName: formData.businessName,
          gstNumber: formData.gstNumber,
          phone: formData.phone,
        }),
      });

      setUser(updated);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = () => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      verified: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[enterprise.status] || "";
  };

  return (
    <div className="space-y-5">
      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Success</p>
            <p className="text-green-700 text-sm">Profile updated successfully</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800 text-sm">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Personal Information
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Update your basic account details
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-medium text-sm">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              Email Address
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-medium text-sm">
                  {user.email}
                </p>
              </div>
              <div className="px-3 py-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.emailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.emailVerified ? (
                    <>
                      <CheckCircle size={12} />
                      Verified
                    </>
                  ) : (
                    "Unverified"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Information Card */}
      {isEnterprise && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
              <Building2 size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Enterprise Details
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Business information and verification status
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building2 size={16} className="text-gray-500" />
                Business Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium text-sm">
                    {enterprise.businessName || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                GST Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, gstNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium text-sm">
                    {enterprise.gstNumber || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium text-sm">
                    {enterprise.phone || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-gray-500" />
                Verification Status
              </label>
              <div className="pt-2">
                {enterprise.status ? (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor()}`}
                  >
                    {enterprise.status === "pending" && "⏳"}
                    {enterprise.status === "verified" && <CheckCircle size={12} />}
                    {enterprise.status === "rejected" && "✗"}
                    <span className="ml-1">
                      {enterprise.status.charAt(0).toUpperCase() +
                        enterprise.status.slice(1)}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">No status</span>
                )}
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {enterprise.adminNotes && (
            <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                📝 Admin Notes
              </p>
              <p className="text-sm text-blue-700">{enterprise.adminNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
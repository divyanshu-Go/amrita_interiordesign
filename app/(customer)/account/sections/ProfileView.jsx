"use client";

import { useAccount } from "../AccountDataProvider";
import { updateUserProfile } from "@/lib/actions/user";
import { useState } from "react";

export default function ProfileView() {
  const { user, setUser, loading } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    gstNumber: "",
    phone: "",
  });

  if (loading.user || !user) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading profile…</p>
          </div>
        </div>
      </div>
    );
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
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const updated = await updateUserProfile({
        name: formData.name,
        ...(isEnterprise && {
          businessName: formData.businessName,
          gstNumber: formData.gstNumber,
          phone: formData.phone,
        }),
      });

      setUser(updated);
      setIsEditing(false);
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
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <div className="flex">
            <span className="text-lg mr-3">⚠️</span>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-500 mt-1">Update your basic account details</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-medium">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-medium text-sm">{user.email}</p>
              </div>
              <div className="px-3 py-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    user.emailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.emailVerified ? "✓ Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Information Card */}
      {isEnterprise && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Enterprise Details</h2>
            <p className="text-sm text-gray-500 mt-1">Business information and verification status</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter business name"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {enterprise.businessName || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GST Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, gstNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter GST number"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {enterprise.gstNumber || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {enterprise.phone || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Status
              </label>
              <div className="pt-2">
                {enterprise.status ? (
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold border ${getStatusColor()}`}
                  >
                    {enterprise.status === "pending" && "⏳ "}
                    {enterprise.status === "verified" && "✓ "}
                    {enterprise.status === "rejected" && "✗ "}
                    {enterprise.status.charAt(0).toUpperCase() +
                      enterprise.status.slice(1)}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">No status</span>
                )}
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {enterprise.adminNotes && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">Admin Notes</p>
              <p className="text-sm text-blue-700">{enterprise.adminNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 flex gap-3 justify-end border-t-2 border-gray-100">
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
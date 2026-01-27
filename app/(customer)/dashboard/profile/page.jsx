// app/dashboard/profile/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        setProfile(data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12 text-red-600">Failed to load profile</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your profile information</p>
        </div>
        <Link
          href="/dashboard/profile/edit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Edit Profile
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* Name */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <p className="text-lg text-gray-900 mt-1">{profile.name}</p>
        </div>

        {/* Email */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <p className="text-lg text-gray-900 mt-1">{profile.email}</p>
        </div>

        {/* Account Type */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-600">Account Type</label>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg text-gray-900 capitalize">{profile.role}</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                profile.role === 'enterprise'
                  ? 'bg-purple-100 text-purple-800'
                  : profile.role === 'admin'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {profile.role}
            </span>
          </div>
        </div>

        {/* Email Verification Status */}
        <div>
          <label className="text-sm font-medium text-gray-600">Email Status</label>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-3 h-3 rounded-full ${
                profile.emailVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <p className="text-lg text-gray-900">
              {profile.emailVerified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        </div>
      </div>

      {/* Enterprise Profile Section - Only show if role is enterprise AND enterpriseProfile exists */}
      {profile.role === 'enterprise' && profile.enterpriseProfile && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Enterprise Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">Business Name</label>
              <p className="text-gray-900 mt-1">
                {profile.enterpriseProfile.businessName || 'Not provided'}
              </p>
            </div>

            {/* GST Number */}
            <div>
              <label className="text-sm font-medium text-gray-600">GST Number</label>
              <p className="text-gray-900 mt-1 font-mono">
                {profile.enterpriseProfile.gstNumber || 'Not provided'}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900 mt-1">
                {profile.enterpriseProfile.phone || 'Not provided'}
              </p>
            </div>

            {/* Verification Status */}
            <div>
              <label className="text-sm font-medium text-gray-600">Verification Status</label>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile.enterpriseProfile.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : profile.enterpriseProfile.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {profile.enterpriseProfile.status}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {profile.enterpriseProfile.adminNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-600">Admin Notes</label>
              <p className="text-gray-900 mt-1 text-sm bg-gray-50 p-3 rounded">
                {profile.enterpriseProfile.adminNotes}
              </p>
            </div>
          )}

          {/* Verified At */}
          {profile.enterpriseProfile.verifiedAt && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">Verified On</label>
              <p className="text-gray-900 mt-1">
                {new Date(profile.enterpriseProfile.verifiedAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Account Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm">
            🔐 Change Password
          </button>
          <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm">
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
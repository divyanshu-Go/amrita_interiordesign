"use client";

import { useEffect, useState } from "react";

export default function ProfileSection() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        if (mounted) {
          setUser(data.user);
          setForm({ name: data.user.name });
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile</h2>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-orange-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Name
        </label>

        {isEditing ? (
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-sm"
          />
        ) : (
          <p className="text-sm font-medium">{user.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Email
        </label>
        <p className="text-sm font-medium">{user.email}</p>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Account Type
        </label>
        <p className="text-sm font-medium capitalize">
          {user.role}
        </p>
      </div>

      {/* Enterprise Info */}
      {user.role === "enterprise" && user.enterpriseProfile && (
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Business Details
          </h3>

          <p className="text-sm">
            <span className="text-gray-600">Business Name:</span>{" "}
            {user.enterpriseProfile.businessName || "—"}
          </p>

          <p className="text-sm">
            <span className="text-gray-600">GST Number:</span>{" "}
            {user.enterpriseProfile.gstNumber || "—"}
          </p>

          <p className="text-sm">
            <span className="text-gray-600">Status:</span>{" "}
            <span className="capitalize">
              {user.enterpriseProfile.status}
            </span>
          </p>
        </div>
      )}

      {/* Actions */}
      {isEditing && (
        <div className="flex gap-3 pt-4">
          <button
            disabled
            className="bg-orange-500 text-white text-sm px-4 py-2 rounded opacity-50 cursor-not-allowed"
          >
            Save (API pending)
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setForm({ name: user.name });
            }}
            className="text-sm px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

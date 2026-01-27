"use client";

import { useAccount } from "../AccountDataProvider";
import { updateUserProfile } from "@/lib/actions/user";
import { useState } from "react";

export default function ProfileView() {
  const { user, setUser, loading } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  if (loading.user || !user) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="bg-white border rounded p-6 space-y-6">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Profile</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setName(user.name);
              setIsEditing(true);
            }}
            className="text-sm text-orange-600"
          >
            Edit
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Name</label>
        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded w-full text-sm"
          />
        ) : (
          <p className="text-sm font-medium">{user.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <p className="text-sm font-medium">{user.email}</p>
        
      </div>

      {isEditing && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={async () => {
              const updated = await updateUserProfile({ name });
              setUser(updated);
              setIsEditing(false);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
          >
            Save
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="border px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

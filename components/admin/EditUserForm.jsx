"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function EditUserForm({ user }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      router.push("/user"); // Redirect back to Manage Users page
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-lg"
    >
      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Role */}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-3 py-2 bg-red-100 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-orange-500 text-white font-medium py-2 px-4 rounded hover:bg-orange-600 transition disabled:opacity-50"
      >
        {isLoading ? (
          <>
            Saving...
            <LoaderCircle className="animate-spin ml-2 w-4 h-4" />
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}

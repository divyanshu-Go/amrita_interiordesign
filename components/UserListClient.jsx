"use client";

import { User, Mail, Shield } from "lucide-react";

export default function UserListClient({ users }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="p-5 bg-white border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition"
        >
          {/* User Name */}
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-orange-700">{user.name || "No Name"}</h3>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Mail className="w-4 h-4 text-orange-400" />
            {user.email}
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-1 rounded">
              {user.role || "User"}
            </span>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <p className="text-gray-500 text-sm col-span-full">No users found.</p>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { User, LogOut, Edit, Pencil, Folders } from "lucide-react";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const ProfileDashboard = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-orange-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-orange-100">
        <h2 className="text-2xl font-semibold text-orange-600">
          Profile Dashboard
        </h2>
        <p className="text-sm text-orange-400">
          Manage your profile and settings
        </p>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="w-16 h-16 text-orange-400" />
            </div>
          </div>

          {/* User Information */}
          <div className="flex-grow space-y-4 w-full">
            {/* User Details */}
            <div className="bg-orange-50 p-4 rounded-md w-full flex flex-col gap-3 border border-orange-100">
              <h3 className="text-lg font-semibold text-orange-600 max-w-max">
                User Details
              </h3>
              <div className="text-md text-orange-500 mt-2 space-y-2">
                <p>
                  <span className="font-medium text-orange-600">Name :</span>
                  <span className="font-semibold"> {user.name}</span>
                </p>
                <p>
                  <span className="font-medium text-orange-600">Email :</span>
                  <span className="font-semibold"> {user.email}</span>
                </p>
              </div>
            </div>

            {/* Role & Joined Date */}
            <div className="flex items-center justify-between bg-orange-50 p-4 rounded-md border border-orange-100">
              <span className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md shadow-sm transition">
                {user.role}
              </span>
              <span className="text-sm text-orange-500">
                Joined on {format(new Date(user.createdAt), "MMMM dd, yyyy")}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6 flex-wrap">
              {/* Edit Profile */}
              <button
                className="flex items-center border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                onClick={() => router.push(`/profile/${user._id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>

              {/* Logout */}
              <button
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>

              {/* Create */}
              <button
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                onClick={() => router.push("/create-task")}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Create Task
              </button>

              {/* Dashboard Switch */}
              {user.role === "admin" && (
                <button
                  className="flex items-center border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  onClick={() => router.push("/admin-dashboard")}
                >
                  <Folders className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </button>
              ) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;

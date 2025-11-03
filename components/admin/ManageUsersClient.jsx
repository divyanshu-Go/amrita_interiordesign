"use client";

import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";

export default function ManageUsersClient({ users }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    const res = await fetch(`/api/user/${selectedUser._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setShowModal(false);
      setSelectedUser(null);
      router.refresh(); // refresh server data without page reload
    } else {
      alert("Failed to delete user.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-orange-600">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs mt-1 px-2 py-1 inline-block bg-gray-200 rounded">
                Role: {user.role}
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <Link
                href={`/manage-user/${user._id}/edit`}
                className="flex items-center gap-1 px-3 py-1 border border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white rounded text-sm"
              >
                <Pencil className="w-4 h-4" /> Edit
              </Link>
              <button
                onClick={() => handleDeleteClick(user)}
                className="flex items-center gap-1 px-3 py-1 border border-red-400 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">No users found.</p>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
    </>
  );
}

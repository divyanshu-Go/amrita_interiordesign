import UserListClient from "@/components/UserListClient";
import { getAllUsers } from "@/lib/api/api";

export default async function UserPage() {
  const users = await getAllUsers();
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">All Users</h1>
      <UserListClient users={safeUsers} />
    </div>
  );
}

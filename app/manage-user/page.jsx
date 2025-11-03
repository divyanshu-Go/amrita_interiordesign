import ManageUsersClient from "@/components/admin/ManageUsersClient";
import { getAllUsers } from "@/lib/api/api";

export default async function ManageUserPage() {
  const users = await getAllUsers();
  const safeUsers = Array.isArray(users) ? users : [];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Manage Users</h1>
      <ManageUsersClient users={safeUsers} /> 
    </div>
  );
}

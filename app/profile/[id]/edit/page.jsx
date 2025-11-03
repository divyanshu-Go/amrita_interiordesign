import { getUserById } from "@/lib/api/api";
import EditUserForm from "@/components/admin/EditUserForm";

export default async function EditUserPage({ params }) {
  const user = await getUserById(params.id);
  console.log(user)

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-500">User not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
        <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Edit User
        </h1>
        <EditUserForm user={user} />
      </div>
    </div>
  );
}

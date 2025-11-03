import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Users Button */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4">Manage Users</h2>
          <p className="text-gray-500 text-sm mb-4">
            View, edit, and delete users from the system.
          </p>
          <Link
            href="/manage-user"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-200"
          >
            Go to Manage Users →
          </Link>
        </div>

        {/* Manage Tasks Button */}
<div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col justify-between">
  <h2 className="text-lg font-semibold mb-4">Manage Tasks</h2>
  <p className="text-gray-500 text-sm mb-4">
    Assign, update, and track tasks for all users.
  </p>
  <Link
    href="/manage-task"
    className="inline-flex items-center justify-center px-5 py-2.5 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-200"
  >
    Go to Manage Tasks →
  </Link>
</div>

      </div>
    </div>
  );
}

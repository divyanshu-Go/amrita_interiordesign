// app/admin/applications/page.jsx

import Link from "next/link";
import { Plus, Edit, Trash2, EyeIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { deleteApplicationByIdServer, getAllApplicationsServer } from "@/lib/serversideFetchers/applications";

/* -------------------- SERVER ACTION -------------------- */
async function handleDelete(formData) {
  "use server";
  const id = formData.get("id");
  await deleteApplicationByIdServer(id);
  revalidatePath("/admin/applications");
}


export const revalidate = 600; // Revalidate every 10 minutes

/* -------------------- PAGE COMPONENT -------------------- */
export default async function ApplicationsPage() {
  const applications = await getAllApplicationsServer();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl  font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-2 text-sm">Manage product applications</p>
        </div>
        <Link
          href="/admin/applications/new"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md font-semibold text-sm transition"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </Link>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">No applications added yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Image</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Slug</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Description</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      {app.image ? (
                        <img
                          src={app.image}
                          alt={app.name}
                          className="h-10 w-16 rounded object-contain border border-gray-200"
                        />
                      ) : (
                        <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{app.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{app.slug}</td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-1">
                      {app.desc || "-"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/applications/${app?.slug}`}
                        className="p-1 bg-green-100 rounded text-xs inline-flex items-center gap-1 text-green-800 hover:text-green-800 transition font-medium"
                      >
                        <EyeIcon className="w-3 h-3" />
                        View
                      </Link>
                      <Link
                        href={`/admin/applications/${app._id}`}
                        className="p-1 bg-blue-100 rounded text-xs inline-flex items-center gap-1 text-blue-800 hover:text-blue-800 transition font-medium"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>

                      <form action={handleDelete} className="inline-block">
                        <input type="hidden" name="id" value={app._id} />
                        <button
                          type="submit"
                          className="p-1 bg-red-100 rounded text-xs inline-flex items-center gap-1 text-red-800 hover:text-red-800 transition font-medium"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
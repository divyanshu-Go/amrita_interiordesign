import Link from "next/link";
import { getAllColorVariants } from "@/lib/fetchers/colorVariants";
import { Plus } from "lucide-react";

export default async function ColorVariantsPage() {
  const variants = await getAllColorVariants();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Color Variants</h1>
        <Link
          href="/admin/color-variants/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Color Variant
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border p-4">
        {variants.length === 0 ? (
          <p>No variants yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Hex</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {variants.map((v) => (
                <tr key={v._id} className="border-b">
                  <td className="py-2">{v.name}</td>
                  <td className="py-2">{v.hexCode}</td>
                  <td className="py-2">{v.description}</td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/color-variants/${v._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

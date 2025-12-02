import Link from "next/link";
import { getAllColorVariants, deleteColorVariant } from "@/lib/fetchers/colorVariants";
import { getAllPatternVariants, deletePatternVariant } from "@/lib/fetchers/patternVariants";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

// Server Actions
async function handleColorDelete(formData) {
  "use server";
  const id = formData.get("id");
  await deleteColorVariant(id);
  revalidatePath("/admin/variants");
}

async function handlePatternDelete(formData) {
  "use server";
  const id = formData.get("id");
  await deletePatternVariant(id);
  revalidatePath("/admin/variants");
}

// Color Variant Row Component
const ColorVariantRow = ({ variant, onDelete }) => (
  <tr className="border-b hover:bg-gray-50 transition">
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        {variant.hexCode && (
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: variant.hexCode }}
            title={variant.hexCode}
          />
        )}
        <span className="font-medium text-gray-900">{variant.name}</span>
      </div>
    </td>
    <td className="py-3 px-4 text-gray-600 font-mono text-sm">{variant.hexCode || "-"}</td>
    <td className="py-3 px-4 text-gray-600 text-sm line-clamp-1">
      {variant.description || "-"}
    </td>
    <td className="py-3 px-4 text-right space-x-2">
      <Link
        href={`/admin/variants/color/${variant._id}`}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
      >
        <Edit className="w-3 h-3" />
        Edit
      </Link>

      <form action={onDelete} className="inline-block">
        <input type="hidden" name="id" value={variant._id} />
        <button
          type="submit"
          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition text-sm font-medium"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </form>
    </td>
  </tr>
);

// Pattern Variant Row Component
const PatternVariantRow = ({ variant, onDelete }) => (
  <tr className="border-b hover:bg-gray-50 transition">
    <td className="py-3 px-4">
      <span className="font-medium text-gray-900">{variant.name}</span>
    </td>
    <td className="py-3 px-4 text-gray-600 font-mono text-sm">{variant.hexCode || "-"}</td>
    <td className="py-3 px-4 text-gray-600 text-sm line-clamp-1">
      {variant.description || "-"}
    </td>
    <td className="py-3 px-4 text-right space-x-2">
      <Link
        href={`/admin/variants/pattern/${variant._id}`}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
      >
        <Edit className="w-3 h-3" />
        Edit
      </Link>

      <form action={onDelete} className="inline-block">
        <input type="hidden" name="id" value={variant._id} />
        <button
          type="submit"
          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition text-sm font-medium"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </form>
    </td>
  </tr>
);

// Variant Section Component
const VariantSection = ({
  title,
  label,
  variants,
  createLink,
  deleteAction,
  rowComponent: RowComponent,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <Link
        href={createLink}
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
      >
        <Plus className="w-4 h-4" />
        Add {title}
      </Link>
    </div>

    <div className="overflow-x-auto">
      {variants.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p className="text-sm">No {title.toLowerCase()} added yet</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">{label}</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Description</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <RowComponent
                key={variant._id}
                variant={variant}
                onDelete={deleteAction}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

export default async function VariantsManagementPage() {
  const colorVariants = await getAllColorVariants();
  const patternVariants = await getAllPatternVariants();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Variants Management</h1>
        <p className="text-gray-600 mt-2">Manage color and pattern variants for your products</p>
      </div>

      {/* Two Row Grid */}
      <div className="space-y-6">
        {/* Color Variants Row */}
        <VariantSection
          title="Color Variants"
          label="Hex Code"
          variants={colorVariants}
          createLink="/admin/variants/color/new"
          deleteAction={handleColorDelete}
          rowComponent={ColorVariantRow}
        />

        {/* Pattern Variants Row */}
        <VariantSection
          title="Pattern Variants"
          label="Pattern Code"
          variants={patternVariants}
          createLink="/admin/variants/pattern/new"
          deleteAction={handlePatternDelete}
          rowComponent={PatternVariantRow}
        />
      </div>
    </div>
  );
}
// admin/variants/page.js

import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

// Fetchers
import { getAllColorVariantProducts } from "@/lib/fetchers/colorVariantProducts";
import { getAllPatternVariantProducts } from "@/lib/fetchers/patternVariantProducts";
import { deleteColorVariantById } from "@/lib/serversideMutations/colorVariants";
import { deletePatternVariantById } from "@/lib/serversideMutations/patternVariants";



/* -------------------- SERVER ACTIONS -------------------- */
async function handleColorDelete(formData) {
  "use server";
  const id = formData.get("id");
  await deleteColorVariantById(id);
  revalidatePath("/admin/variants");
}

async function handlePatternDelete(formData) {
  "use server";
  const id = formData.get("id");
  await deletePatternVariantById(id);
  revalidatePath("/admin/variants");
}

/* -------------------- PRODUCT LIST COMPONENT -------------------- */
const ProductList = ({ products }) => {
  if (!products || products.length === 0)
    return <span className="text-gray-400 text-sm">–</span>;

  return (
    <div className="space-y-1 min-w-36">
      {products.map((p) => (
        <div key={p._id} className="flex items-center gap-2">
          {/* Thumbnail */}
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-8 h-8 rounded-xs object-cover border-gray-500"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-xs border border-gray-500" />
          )}

          {/* Product Name (truncate) */}
          <Link
            href={`/product/${p.slug}`}
            className="ml-auto text-sm font-medium text-gray-900 truncate max-w-[120px]"
          >
            {p.name}
          </Link>

          {/* Edit Icon */}
          <Link
            href={`/admin/products/${p.slug}`}
            className="text-blue-600 hover:text-blue-800"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
};

/* -------------------- COLOR VARIANT ROW -------------------- */
const ColorVariantRow = ({ variant, colorProductsMap }) => (
  <tr className="border-b hover:bg-gray-50 transition">
    {/* Name + Swatch */}
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        {variant.hexCode && (
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: variant.hexCode }}
            title={variant.hexCode}
          />
        )}
        <span className="font-medium text-gray-900">{variant.name}</span>
      </div>
    </td>

    {/* Hex Code */}
    <td className="py-3 px-4 text-gray-600 font-mono text-sm">
      {variant.hexCode || "-"}
    </td>

    {/* Description */}
    <td className="py-3 px-4 text-gray-600 text-sm line-clamp-1">
      {variant.description || "-"}
    </td>

    {/* Products Column */}
    <td className="py-3 px-4">
      <ProductList products={colorProductsMap[variant._id.toString()] || []} />
    </td>

    {/* Actions */}
    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
      <Link
        href={`/admin/variants/color/${variant._id}`}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
      >
        <Edit className="w-3 h-3" />
        Edit
      </Link>

      <form action={handleColorDelete} className="inline-block">
        <input type="hidden" name="id" value={String(variant._id)} />
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

/* -------------------- PATTERN VARIANT ROW -------------------- */
const PatternVariantRow = ({ variant, patternProductsMap }) => (
  <tr className="border-b hover:bg-gray-50 transition">
    {/* Name */}
    <td className="py-3 px-4">
      <span className="font-medium text-gray-900">{variant.name}</span>
    </td>

    {/* Hex Code */}
    <td className="py-3 px-4 text-gray-600 font-mono text-sm">
      {variant.hexCode || "-"}
    </td>

    {/* Description */}
    <td className="py-3 px-4 text-gray-600 text-sm line-clamp-1">
      {variant.description || "-"}
    </td>

    {/* Products Column */}
    <td className="py-3 px-4">
      <ProductList products={patternProductsMap[variant._id.toString()] || []} />
    </td>

    {/* Actions */}
    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
      <Link
        href={`/admin/variants/pattern/${variant._id}`}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
      >
        <Edit className="w-3 h-3" />
        Edit
      </Link>

      <form action={handlePatternDelete} className="inline-block">
        <input type="hidden" name="id" value={String(variant._id)} />
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

/* -------------------- REUSABLE VARIANT TABLE WRAPPER -------------------- */
const VariantSection = ({
  title,
  label,
  variants,
  productsMap,
  createLink,
  rowComponent: RowComponent,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <Link
        href={createLink}
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
      >
        <Plus className="w-4 h-4" />
        Add {title}
      </Link>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      {variants.length === 0 ? (
        <div className="p-6 text-center text-gray-500 text-sm">
          No {title.toLowerCase()} added yet
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {label}
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Description
              </th>

              {/* New Products Column */}
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Products
              </th>

              <th className="py-3 px-4 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant) => (
              <RowComponent
                key={variant._id}
                variant={variant}
                colorProductsMap={productsMap}
                patternProductsMap={productsMap}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);


export const revalidate = 0;
/* -------------------- PAGE COMPONENT -------------------- */
export default async function VariantsManagementPage() {
  // Optimized fetch: variants + grouped products
  const { variants: colorVariants, map: colorProductsMap } =
    await getAllColorVariantProducts();

  const { variants: patternVariants, map: patternProductsMap } =
    await getAllPatternVariantProducts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Variants Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage color and pattern variants for your products
        </p>
      </div>

      <div className="space-y-6">
        {/* Color Variants Table */}
        <VariantSection
          title="Color Variants"
          label="Hex Code"
          variants={colorVariants}
          productsMap={colorProductsMap}
          createLink="/admin/variants/color/new"
          rowComponent={ColorVariantRow}
        />

        {/* Pattern Variants Table */}
        <VariantSection
          title="Pattern Variants"
          label="Pattern Code"
          variants={patternVariants}
          productsMap={patternProductsMap}
          createLink="/admin/variants/pattern/new"
          rowComponent={PatternVariantRow}
        />
      </div>
    </div>
  );
}

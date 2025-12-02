
// ===== app/admin/variants/color/[id]/page.js =====
import VariantForm from "@/components/admin/VariantForm";
import { getColorVariantById } from "@/lib/fetchers/colorVariants";

export default async function EditColorVariantPage({ params }) {
  const variant = await getColorVariantById(params.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Color Variant</h1>
        <p className="text-gray-600 mt-2">Modify color variant details</p>
      </div>
      <VariantForm variant={variant} type="color" />
    </div>
  );
}
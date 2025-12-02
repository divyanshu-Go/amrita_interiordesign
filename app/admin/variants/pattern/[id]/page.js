// ===== app/admin/variants/pattern/[id]/page.js =====
import VariantForm from "@/components/admin/VariantForm";
import { getPatternVariantById } from "@/lib/fetchers/patternVariants";

export default async function EditPatternVariantPage({ params }) {
  const variant = await getPatternVariantById(params.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Pattern Variant</h1>
        <p className="text-gray-600 mt-2">Modify pattern variant details</p>
      </div>
      <VariantForm variant={variant} type="pattern" />
    </div>
  );
}
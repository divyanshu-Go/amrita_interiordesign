// ===== app/admin/variants/pattern/new/page.js =====
import VariantForm from "@/components/admin/VariantForm";

export default function NewPatternVariantPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Pattern Variant</h1>
        <p className="text-gray-600 mt-2">Add a new pattern variant to your store</p>
      </div>
      <VariantForm type="pattern" />
    </div>
  );
}
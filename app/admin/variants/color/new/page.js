// ===== app/admin/variants/color/new/page.js =====
import VariantForm from "@/components/admin/VariantForm";

export default function NewColorVariantPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Color Variant</h1>
        <p className="text-gray-600 mt-2">Add a new color variant to your store</p>
      </div>
      <VariantForm type="color" />
    </div>
  );
}
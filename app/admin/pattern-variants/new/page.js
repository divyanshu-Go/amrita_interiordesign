import { getPatternVariantById } from "@/lib/fetchers/patternVariants";
import PatternVariantForm from "@/components/admin/PatternVariantForm";

export default async function EditPatternVariantPage({ params }) {
  const variant = await getPatternVariantById(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Pattern Variant</h1>
      <PatternVariantForm variant={variant} />
    </div>
  );
}

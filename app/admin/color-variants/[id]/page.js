import { getColorVariantById } from "@/lib/fetchers/colorVariants";
import ColorVariantForm from "@/components/admin/ColorVariantForm";

export default async function EditColorVariantPage({ params }) {
  const variant = await getColorVariantById(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Color Variant</h1>
      <ColorVariantForm variant={variant} />
    </div>
  );
}

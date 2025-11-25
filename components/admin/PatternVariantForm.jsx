"use client";

import { useState } from "react";
import { createPatternVariant, updatePatternVariant } from "@/lib/fetchers/patternVariants";
import { useRouter } from "next/navigation";

export default function PatternVariantForm({ variant = null }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: variant?.name || "",
    hexCode: variant?.hexCode || "",
    description: variant?.description || "",
  });

  const isEdit = !!variant;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit)
      await updatePatternVariant(variant._id, form);
    else
      await createPatternVariant(form);

    router.push("/admin/pattern-variants");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg space-y-4">
      <div>
        <label>Name</label>
        <input 
          type="text"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Hex Code</label>
        <input 
          type="text"
          className="w-full border p-2 rounded"
          value={form.hexCode}
          onChange={(e) => setForm({ ...form, hexCode: e.target.value })}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
      >
        {isEdit ? "Update Variant" : "Create Variant"}
      </button>
    </form>
  );
}

// components/admin/CategoryForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/lib/fetchers/categories";
import { Save, X, Loader, Plus, Trash2 } from "lucide-react";
import Toast from "./Toast";
import ImageUploadDropzone from "./ImageUploadDropzone";

// ── Reusable field components ─────────────────────────────────────────────

const InputField = ({
  label,
  required,
  helperText,
  error,
  type = "text",
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {error ? (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    ) : (
      helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>
    )}
  </div>
);

const TextareaField = ({ label, helperText, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <textarea
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors resize-none ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);

// ── Section wrapper for visual grouping ──────────────────────────────────
const FormSection = ({ title, subtitle, children }) => (
  <div className="border border-gray-200 rounded-md p-4 bg-white space-y-4">
    <div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ── Main form ─────────────────────────────────────────────────────────────

export default function CategoryForm({ category = null }) {
  const router = useRouter();
  const isEdit = !!category;

  const [formData, setFormData] = useState({
    name:            category?.name            || "",
    slug:            category?.slug            || "",
    description:     category?.description     || "",
    image:           category?.image           || "",
    isTrending:      category?.isTrending      || false,
    trendingTagline: category?.trendingTagline  || "",
    // SEO fields
    seoIntro:        category?.seoIntro        || "",
    buyingGuide:     category?.buyingGuide     || "",
  });

  // FAQs managed separately — array of { question, answer }
  const [faqs, setFaqs] = useState(
    category?.faqs?.length
      ? category.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]             = useState({});
  const [toast, setToast]               = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    // Auto-generate slug from name when creating
    if (name === "name" && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // FAQ handlers
  const addFaq = () =>
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);

  const removeFaq = (index) =>
    setFaqs((prev) => prev.filter((_, i) => i !== index));

  const updateFaq = (index, field, value) =>
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );

  // ── Validation ───────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Category name is required";

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Merge faqs into the payload — strip empty entries before saving
    const payload = {
      ...formData,
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      if (isEdit) {
        await updateCategory(category.slug, payload);
        setToast({ message: "Category updated successfully!", type: "success" });
      } else {
        await createCategory(payload);
        setToast({ message: "Category created successfully!", type: "success" });
      }

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 1000);
    } catch (err) {
      setToast({ message: err.message || "Something went wrong", type: "error" });
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── BASIC DETAILS ──────────────────────────────────────────── */}
        <FormSection
          title="Basic Details"
          subtitle="Name, slug, and short description shown in listings"
        >
          <InputField
            label="Category Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., PVC Panels"
          />

          <InputField
            label="Slug"
            required
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            disabled={isEdit}
            error={errors.slug}
            helperText={isEdit ? "Slug cannot be changed" : "Auto-generated from name"}
            placeholder="e.g., pvc-panels"
          />

          <TextareaField
            label="Short Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            placeholder="2-3 lines shown under the category name on the page"
            helperText="Shown in the category header card"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category Image
            </label>
            <ImageUploadDropzone
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              folder="categories"
            />
            <p className="text-xs text-gray-500 mt-1">
              Displayed in category listings and the page header
            </p>
          </div>
        </FormSection>

        {/* ── TRENDING ───────────────────────────────────────────────── */}
        <FormSection
          title="Trending Collection"
          subtitle="Show this category in the Trending section on the homepage"
        >
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isTrending"
              checked={formData.isTrending}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isTrending: e.target.checked }))
              }
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as Trending Collection
            </span>
          </label>

          {formData.isTrending && (
            <InputField
              label="Trending Tagline"
              name="trendingTagline"
              value={formData.trendingTagline}
              onChange={handleChange}
              placeholder="e.g., Modern Designs Loved This Week"
              helperText="Shown under the category name in Trending Collections"
            />
          )}
        </FormSection>

        {/* ── SEO CONTENT ────────────────────────────────────────────── */}
        <FormSection
          title="SEO Content"
          subtitle="This content is rendered server-side — Google reads it directly. Write naturally, include Delhi NCR and product type keywords."
        >
          {/* SEO Intro */}
          <TextareaField
            label="SEO Intro"
            name="seoIntro"
            value={formData.seoIntro}
            onChange={handleChange}
            rows={5}
            placeholder={`e.g., Looking for PVC panels in Delhi NCR? Interio97 offers a wide range of premium PVC wall panels at the best prices, delivered across Delhi, Gurgaon, Noida, and Faridabad.\n\nOur PVC panels are available in 100+ designs including wood grain, marble, and contemporary textures — perfect for bedrooms, living rooms, and commercial spaces.`}
            helperText="2-3 paragraphs. Separate paragraphs with a blank line. Shown above the product grid. Used as meta description if filled."
          />

          {/* Buying Guide */}
          <TextareaField
            label="Buying Guide"
            name="buyingGuide"
            value={formData.buyingGuide}
            onChange={handleChange}
            rows={6}
            placeholder={`e.g., When choosing PVC panels for your home, consider thickness (6mm vs 8mm), finish type (matte, glossy, or textured), and the room's moisture levels.\n\nFor bathrooms and kitchens in Delhi NCR's humid climate, opt for 8mm waterproof panels with a matte finish to avoid fingerprints.\n\nInterio97 provides free samples delivered across Delhi NCR so you can compare textures before purchasing.`}
            helperText="3-5 paragraphs. Shown below the product grid in a 'Buying Guide' section. Targets informational search queries."
          />
        </FormSection>

        {/* ── FAQs ───────────────────────────────────────────────────── */}
        <FormSection
          title="FAQs"
          subtitle="5-7 questions targeting Delhi NCR keywords. Rendered as FAQ schema — eligible for rich results in Google Search."
        >
          {faqs.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No FAQs yet. Add 5-7 questions relevant to this category.
            </p>
          )}

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    FAQ {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove this FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  placeholder={`e.g., What is the price of PVC panels in Delhi?`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                />

                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  placeholder={`e.g., PVC panels in Delhi are priced between ₹150 and ₹400 per piece depending on thickness and finish. At Interio97, we offer PVC panels starting at ₹259 with free delivery across Delhi NCR.`}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none bg-white"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </FormSection>

        {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? "Update Category" : "Create Category"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

      </form>
    </>
  );
}
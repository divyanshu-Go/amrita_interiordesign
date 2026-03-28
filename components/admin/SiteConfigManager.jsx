// components/admin/SiteConfigManager.jsx
"use client";

import { useState }          from "react";
import { Check, Loader }     from "lucide-react";
import { toast }             from "sonner";
import ImageUploadDropzone   from "./ImageUploadDropzone";

// ── Section wrapper — keeps the form visually grouped ────────────────────
function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

// ── Reusable labelled input ───────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {hint && <p className="text-[11px] text-gray-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all";

// ─────────────────────────────────────────────────────────────────────────

export default function SiteConfigManager({ initial }) {
  // ── Form state (one field per schema key) ────────────────────────────
  const [companyName, setCompanyName] = useState(initial.companyName || "");
  const [tagline,     setTagline]     = useState(initial.tagline     || "");
  const [logoUrl,     setLogoUrl]     = useState(initial.logoUrl     || "");

  const [email,     setEmail]     = useState(initial.email     || "");
  const [phone,     setPhone]     = useState(initial.phone     || "");
  const [whatsapp,  setWhatsapp]  = useState(initial.whatsapp  || "");
  const [address,   setAddress]   = useState(initial.address   || "");

  const [instagram, setInstagram] = useState(initial.instagram || "");
  const [linkedin,  setLinkedin]  = useState(initial.linkedin  || "");
  const [twitter,   setTwitter]   = useState(initial.twitter   || "");

  const [saving, setSaving] = useState(false);

  // ── Save handler ─────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName, tagline, logoUrl,
          email, phone, whatsapp, address,
          instagram, linkedin, twitter,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Site config saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Brand ── */}
      <Section title="Brand">
        <Field label="Company Name" hint="Shown in the header logo and footer">
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Amrita"
            className={inputCls}
          />
        </Field>

        <Field label="Tagline" hint="Shown below the company name in header and footer">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Interior & Design"
            className={inputCls}
          />
        </Field>

        {/* Logo spans full width since it has a dropzone */}
        <div className="md:col-span-2">
          <Field label="Company Logo" hint="Shown in header and footer. JPG, PNG, WebP up to 5MB.">
            <ImageUploadDropzone
              value={logoUrl}
              onChange={setLogoUrl}
              folder="site-config"
            />
          </Field>
        </div>
      </Section>

      {/* ── Contact Info ── */}
      <Section title="Contact Info">
        <Field label="Email Address" hint="Shown in footer">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@amritainterior.com"
            className={inputCls}
          />
        </Field>

        <Field label="Address" hint="Shown in footer">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Delhi, India"
            className={inputCls}
          />
        </Field>

        <Field
          label="Call Number"
          hint="Used for the Call button on every product page. Include country code."
        >
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputCls}
          />
        </Field>

        <Field
          label="WhatsApp Number"
          hint="Used for the WhatsApp button on every product page. Include country code, no spaces."
        >
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+916299811965"
            className={inputCls}
          />
        </Field>
      </Section>

      {/* ── Social Links ── */}
      <Section title="Social Links">
        <Field label="Instagram URL">
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://www.instagram.com/yourhandle"
            className={inputCls}
          />
        </Field>

        <Field label="LinkedIn URL">
          <input
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/company/yourcompany"
            className={inputCls}
          />
        </Field>

        <Field label="Twitter / X URL">
          <input
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="https://twitter.com/yourhandle"
            className={inputCls}
          />
        </Field>
      </Section>

      {/* ── Save button ── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60
                     text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          {saving
            ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</>
            : <><Check  className="w-4 h-4" /> Save Changes</>
          }
        </button>
      </div>
    </div>
  );
}
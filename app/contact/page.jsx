import { getSiteConfig } from "@/lib/fetchers/siteConfig";
import { Mail, Phone, MapPin } from "lucide-react";

export const revalidate = 3600;

export default async function ContactPage() {
  const config = await getSiteConfig();

  const {
    companyName = "Interio97",
    tagline = "",
    email = "",
    phone = "",
    whatsapp = "",
    address = "",
  } = config;

  return (
    <div className="w-full">

      {/* ── HERO ── */}
      <div className="bg-orange-50 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Contact {companyName}
          </h1>
          <p className="text-gray-600 text-sm">
            {tagline || "We’re here to help you with your interior needs"}
          </p>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── LEFT: INFO ── */}
        <div className="space-y-6">

          <h2 className="text-xl font-semibold text-gray-900">
            Get in touch
          </h2>

          <p className="text-sm text-gray-600">
            Have questions about products, pricing, or bulk orders? Reach out directly—we respond faster on call or WhatsApp.
          </p>

          {/* Email */}
          {email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Email</p>
                <a href={`mailto:${email}`} className="text-sm text-gray-600 hover:text-orange-600">
                  {email}
                </a>
              </div>
            </div>
          )}

          {/* Phone */}
          {phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Phone</p>
                <a href={`tel:${phone}`} className="text-sm text-gray-600 hover:text-orange-600">
                  {phone}
                </a>
              </div>
            </div>
          )}

          {/* Address */}
          {address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Address</p>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </div>
          )}

          {/* ── STRONG CTA ── */}
          <div className="pt-4 space-y-3">

            {phone && (
              <a
                href={`tel:${phone}`}
                className="block w-full text-center px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium"
              >
                Call Now
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                className="block w-full text-center px-4 py-3 border border-green-500 text-green-600 rounded-md hover:bg-green-50 font-medium"
              >
                Chat on WhatsApp
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Send Email
              </a>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
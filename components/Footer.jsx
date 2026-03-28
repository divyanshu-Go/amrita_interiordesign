// components/Footer.jsx
//
// Accepts a `config` prop (fetched by ClientLayout) instead of hardcoded SITE constant.
// Falls back gracefully to empty strings if any field is missing.
// No "use client" — remains a server component (zero JS cost).

import Link from "next/link";
import { Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "Home",       href: "/" },
  { label: "Categories", href: "/category" },
  { label: "About Us",   href: "/about" },
  { label: "Contact",    href: "/contact" },
];

const accountLinks = [
  { label: "My Account", href: "/account" },
  { label: "My Orders",  href: "/account?tab=orders" },
  { label: "Cart",       href: "/account?tab=cart" },
  { label: "Login",      href: "/login" },
];

export default function Footer({ config = {} }) {
  const {
    companyName = "Interio97",
    tagline     = "",
    logoUrl     = "",
    email       = "",
    phone       = "",
    address     = "",
    instagram   = "",
    linkedin    = "",
    twitter     = "",
  } = config;

  const socials = [
    { href: instagram, Icon: Instagram, label: "Instagram" },
    { href: linkedin,  Icon: Linkedin,  label: "LinkedIn"  },
    { href: twitter,   Icon: Twitter,   label: "Twitter"   },
  ].filter((s) => s.href); // hide social icons with no URL set

  return (
    <footer className="bg-white border-t-2 border-orange-200 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${companyName} logo`}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              ) : (
                // Fallback to static SVG if no logo uploaded yet
                <img
                  src="/logo.svg"
                  alt={`${companyName} logo`}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              )}
              <div className="flex flex-col items-start text-orange-700 leading-tight">
                <span className="text-[16px] font-bold tracking-widest">{companyName}</span>
                <span className="text-[7.5px] tracking-wide text-orange-700 font-bold">{tagline}</span>
              </div>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed">
              Transforming homes and spaces with elegant, modern, and custom interior designs.
            </p>

            {/* Social links — only rendered if URLs are set */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socials.map(({ href, Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-500 border border-orange-200 hover:border-orange-500 flex items-center justify-center text-orange-500 hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Account Links ── */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">My Account</h3>
            <ul className="space-y-2">
              {accountLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Us</h3>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {address}
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />
                  <a href={`tel:${phone}`} className="hover:text-orange-600 transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />
                  <a href={`mailto:${email}`} className="hover:text-orange-600 transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://divyanshu-portfolio-zeta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Divyanshu Sharma
            </a>
            {" "}🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
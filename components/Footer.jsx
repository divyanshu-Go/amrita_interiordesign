// components/Footer.jsx
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// BEFORE: "use client" — completely unnecessary.
//   No hooks, no state, no effects, no browser APIs.
//   Link, icons, and static JSX all work in server components.
//
// AFTER: No "use client" = server component.
//   Footer renders on EVERY page of the site. With "use client", all
//   lucide icons (Twitter, Instagram, Linkedin, MapPin, Phone, Mail),
//   all footer links, and all footer text were being bundled into the
//   client JavaScript sent to every user's phone.
//   As a server component, this renders as plain HTML — zero JS cost.
// ─────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const SITE = {
  email:     "info@amritainterior.com",
  phone:     "+91 98765 43210",
  address:   "Delhi, India",
  instagram: "https://www.instagram.com/amritainterior",
  linkedin:  "https://www.linkedin.com/company/amritainterior",
  twitter:   "https://twitter.com/amritainterior",
};

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

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-orange-200 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              {/* Use logo.svg instead of logo.png — SVG is vector (no blur at any size)
                  and ~3KB vs 21KB for the PNG. Saves bandwidth on every page. */}
              <img
                src="/logo.svg"
                alt="Amrita Interior Design logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div className="flex flex-col items-start text-orange-700 leading-tight">
                <span className="text-[16px] font-bold tracking-widest">Amrita</span>
                <span className="text-[7.5px] tracking-wide text-orange-700 font-bold">Interior & Design</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Transforming homes and spaces with elegant, modern, and custom interior designs.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              {[
                { href: SITE.instagram, Icon: Instagram, label: "Instagram" },
                { href: SITE.linkedin,  Icon: Linkedin,  label: "LinkedIn"  },
                { href: SITE.twitter,   Icon: Twitter,   label: "Twitter"   },
              ].map(({ href, Icon, label }) => (
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
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
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
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
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
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${SITE.phone}`} className="hover:text-orange-600 transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`} className="hover:text-orange-600 transition-colors">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Amrita Interior Design. All rights reserved.</p>
          <p>Designed &amp; developed with care in Delhi, India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
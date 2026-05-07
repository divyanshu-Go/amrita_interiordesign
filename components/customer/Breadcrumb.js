// components/customer/Breadcrumb.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// BEFORE: "use client" — had zero justification.
//   No hooks. No state. No effects. No browser APIs.
//   Link and ChevronRight both work in server components.
//   truncate() from lib/utils is a plain string function, not a hook.
//
// AFTER: No "use client" = server component.
//   Breadcrumb appears on EVERY product page, category page, search page,
//   and application page. Removing "use client" means the nav HTML is
//   server-rendered on all those pages. The lucide ChevronRight icon and
//   all nav links are no longer shipped in the client JS bundle.
//
// BONUS SEO: Breadcrumb is now server-rendered HTML that Google can read
// directly without executing JavaScript. Combined with the BreadcrumbList
// JSON-LD we added to product/category pages, this gives Google two
// signals about your site structure.
// ─────────────────────────────────────────────────────────────────────────

import Link          from "next/link";
import { ChevronRight } from "lucide-react";
import { truncate }  from "@/lib/utils";

export default function Breadcrumb({ items }) {
  return (
    <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
      <div className="px-3 py-1.5">
        <ol className="flex items-center space-x-1 text-xs text-gray-500">

          {/* Home */}
          <li>
            <Link href="/" className="hover:text-orange-800/80 transition-colors">
              Home
            </Link>
          </li>

          {/* Dynamic items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-1">
              <ChevronRight size={14} className="text-gray-400" aria-hidden="true" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-orange-800/80 transition-colors"
                >
                  {truncate(item.label)}
                </Link>
              ) : (
                <span
                  className="text-gray-500 bg-neutral-100 rounded-xs px-2 py-0.5 font-medium"
                  aria-current="page"   // ← accessibility: marks current page
                >
                  {truncate(item.label)}
                </span>
              )}
            </li>
          ))}

        </ol>
      </div>
    </nav>
  );
}
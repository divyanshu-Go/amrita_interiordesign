// app/(customer)/page.js
export const revalidate = 1800;

import { Suspense } from "react";
import HeroSection                from "@/components/HomePage/HeroSection";
import PopularCategoriesSection   from "@/components/HomePage/PopularCategoriesSection";
import ProductByApplicationSection from "@/components/HomePage/ProductByApplicationSection";
import GetInspiredCarousel        from "@/components/customer/GetInspiredCarousel";
import TrendingCollections        from "@/components/customer/TrendingCollections";
import PopularProducts            from "@/components/customer/PopularProducts";
import { getTrendingCategories }    from "@/lib/fetchers/serverCategories";
import { getInspiredCarousel }      from "@/lib/fetchers/inspiredCarousel";
import { getProductsByApplication } from "@/lib/fetchers/productsByApplication";
import { getPopularProducts }       from "@/lib/fetchers/serverProducts";

// ── Homepage Metadata ─────────────────────────────────────────────────────
// WHY: Homepage had no metadata — inherited root fallback title unchanged.
// Google needs a unique, keyword-rich title on the most important page.
// OG image enables proper previews when shared on WhatsApp/social.
export const metadata = {
  title: "Interior Design Materials & Flooring in Delhi NCR | Interio97",
  description:
    "Shop premium flooring, tiles, wallpapers & interior design materials online. Best prices, 500+ products, fast delivery across Delhi NCR. Retail & enterprise pricing.",
  keywords:
    "interior design materials Delhi, flooring tiles Delhi NCR, buy wallpaper online India, wooden flooring Delhi, interior products Interio97",
  openGraph: {
    title:       "Interior Design Materials & Flooring in Delhi NCR | Interio97",
    description: "500+ premium flooring, tiles & wallpapers. Best prices with fast delivery across Delhi NCR.",
    url:         "https://www.interio97.in",
    type:        "website",
    images: [
      {
        // Upload a 1200x630 brand image to Cloudinary and replace this URL
        url:    "https://res.cloudinary.com/dewuaka1a/image/upload/v1774163106/interio97logo_xcxzs0.png",
        width:  1200,
        height: 630,
        alt:    "Interio97 — Premium Interior Design Materials",
      },
    ],
  },
  alternates: { canonical: "https://www.interio97.in" },
};

// ── Organization JSON-LD ──────────────────────────────────────────────────
// Tells Google what Interio97 is as a business entity.
// Enables Knowledge Graph entry + branded search sitelinks.
function OrganizationJsonLd() {
  const schema = {
    "@context":    "https://schema.org",
    "@type":       "Organization",
    name:          "Interio97",
    alternateName: "Amrita Interior Design",
    url:           "https://www.interio97.in",
    logo:          "https://www.interio97.in/logo.png",
    description:   "Premium interior design materials — flooring, tiles, wallpapers and more. Serving Delhi NCR with retail and enterprise pricing.",
    address: {
      "@type":         "PostalAddress",
      addressLocality: "Delhi",
      addressRegion:   "Delhi",
      addressCountry:  "IN",
    },
    contactPoint: {
      "@type":             "ContactPoint",
      contactType:         "customer service",
      availableLanguage:   ["English", "Hindi"],
    },
    sameAs: [
      // Add social URLs here: "https://www.instagram.com/interio97"
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── WebSite JSON-LD with SearchAction ─────────────────────────────────────
// Enables Google Sitelinks Searchbox — users can search your site
// directly from the Google results page on branded searches.
function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    name:       "Interio97",
    url:        "https://www.interio97.in",
    potentialAction: {
      "@type":  "SearchAction",
      target: {
        "@type":       "EntryPoint",
        urlTemplate:   "https://www.interio97.in/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const [
    { applications, map },
    carousel,
    trendingCategories,
    popularProducts,
  ] = await Promise.all([
    getProductsByApplication(),
    getInspiredCarousel(),
    getTrendingCategories(),
    getPopularProducts(),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      <div className="bg-white space-y-4">
        <div className="w-full mx-auto ">
          <HeroSection />
        </div>

        <Suspense fallback={<SectionSkeleton />}>
          <PopularCategoriesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ProductByApplicationSection applications={applications} map={map} />
        </Suspense>

        {carousel?.isActive && carousel.slides?.length > 0 && (
          <Suspense fallback={<SectionSkeleton />}>
            <GetInspiredCarousel
              slides={carousel.slides}
              autoplayMs={carousel.autoplayMs}
              title={carousel.title}
            />
          </Suspense>
        )}

        {trendingCategories.length > 0 && (
          <Suspense fallback={<SectionSkeleton />}>
            <TrendingCollections categories={trendingCategories} />
          </Suspense>
        )}

        {popularProducts.length > 0 && (
          <Suspense fallback={<SectionSkeleton />}>
            <PopularProducts products={popularProducts} />
          </Suspense>
        )}
      </div>
    </>
  );
}

function SectionSkeleton() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="flex flex-col items-center gap-2 mb-10">
        <div className="h-7 w-64 bg-gray-200 rounded-md" />
        <div className="h-4 w-40 bg-gray-100 rounded-md" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
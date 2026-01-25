// app/(customer)/page.js

export const revalidate = 1800; // 30 minutes ISR

import GetInspiredCarousel from "@/components/customer/GetInspiredCarousel";
import PopularProducts from "@/components/customer/PopularProducts";
import TrendingCollections from "@/components/customer/TrendingCollections";
import PopularCategoriesSection from "@/components/HomePage/PopularCategoriesSection";
import ProductByApplicationSection from "@/components/HomePage/ProductByApplicationSection";
import HeroSection from "@/components/HomePage/HeroSection";

import {
  getAllCategories,
  getTrendingCategories,
} from "@/lib/fetchers/serverCategories";
import { getInspiredCarousel } from "@/lib/fetchers/inspiredCarousel";
import { getProductsByApplication } from "@/lib/fetchers/productsByApplication";
import { getPopularProducts } from "@/lib/fetchers/serverProducts";

import { Suspense } from "react";
import { getAuthenticatedUser } from "@/lib/actions/cart";

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
    <div className="bg-white">
      {/* --------- Hero (Above the fold) --------- */}
      <div className="-mt-8 -mx-3">
        <HeroSection />
      </div>

      {/* --------- Popular Categories --------- */}
      <Suspense fallback={<SectionSkeleton />}>
        <div className="pt-8 pb-10">
          <PopularCategoriesSection />
        </div>
      </Suspense>

      {/* --------- Products by Application --------- */}
      <Suspense fallback={<SectionSkeleton />}>
        <div className="pt-4 pb-16">
          <ProductByApplicationSection applications={applications} map={map} />
        </div>
      </Suspense>

      {/* --------- Inspiration Carousel --------- */}
      {carousel?.isActive && carousel.slides?.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <div className="pt-4 pb-16">
            <GetInspiredCarousel
              slides={carousel.slides}
              autoplayMs={carousel.autoplayMs}
              title={carousel.title}
            />
          </div>
        </Suspense>
      )}

      {/* --------- Trending Collections --------- */}
      {trendingCategories.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <div className="pt-4 pb-16">
            <TrendingCollections categories={trendingCategories} />
          </div>
        </Suspense>
      )}

      {/* --------- Popular Products --------- */}
      {popularProducts.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <div className="pt-4 pb-16">
            <PopularProducts products={popularProducts} />
          </div>
        </Suspense>
      )}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 rounded-md"
          />
        ))}
      </div>
    </div>
  );
}

// components/ShopByCategorySection.jsx
import Link from "next/link";
import Image from "next/image";
import { Heart, ShieldCheck, Droplet, Wrench, Leaf, ChevronRight } from "lucide-react";
import { getCategories } from "@/lib/serversideFetchers/categories";

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "Premium Quality", subtitle: "Long lasting & durable" },
  { icon: Droplet, title: "Waterproof", subtitle: "Moisture & Termite Proof" },
  { icon: Wrench, title: "Easy Installation", subtitle: "DIY Friendly" },
  { icon: Leaf, title: "Eco Friendly", subtitle: "Sustainable Materials" },
];

export default async function ShopByCategorySection() {
  const categories = await getCategories();
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-12 sm:py-20 font-sans text-neutral-900">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="w-6 sm:w-8 h-[1px] bg-primary-300" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary-600">
              Best Sellers
            </span>
            <span className="w-6 sm:w-8 h-[1px] bg-primary-300" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-2">
            Shop by Category
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto px-2">
            Premium interior materials for every space. Handpicked bestsellers loved by our customers.
          </p>
        </div>

        {/* Trust Badges — 2 cols on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-8 sm:mb-16">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title} className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-neutral-900 leading-tight">{badge.title}</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 leading-tight mt-0.5">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Grid — 2 cols on mobile (`grid-cols-2`) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => {
            const hasPrice = Boolean(cat.startingPrice && cat.startingPrice > 0);
            const unit = cat.priceUnit || "/sq.ft.";

            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group bg-white rounded-lg sm:rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={cat.image || "/placeholder.jpg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Best Seller Ribbon */}
                  {cat.isTrending && (
                    <span className="absolute top-0 left-0 bg-primary-500 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-br-md sm:rounded-br-lg shadow-sm">
                      Best Seller
                    </span>
                  )}

                  {/* Heart Icon Button */}
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-900/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-neutral-900/40 transition-colors">
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {cat.trendingTagline && (
                      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5 line-clamp-1">
                        {cat.trendingTagline}
                      </p>
                    )}

                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 mb-0.5 sm:mb-1 line-clamp-1">
                      {cat.name}
                    </h3>

                    {cat.description && (
                      <p className="text-[11px] sm:text-xs text-neutral-500 line-clamp-1 mb-2 sm:mb-4">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1.5 sm:pt-2 border-t border-neutral-50 sm:border-none">
                    <div>
                      {hasPrice ? (
                        <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
                          <span className="text-[10px] sm:text-xs text-neutral-500">From</span>
                          <span className="text-xs sm:text-base font-extrabold text-neutral-900">
                            ₹{cat.startingPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[9px] sm:text-[11px] text-neutral-500 font-normal">{unit}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-medium text-neutral-500">Explore Range</span>
                      )}
                    </div>

                    <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium text-primary-800 bg-primary-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md group-hover:bg-primary-100 transition-colors">
                      View <span className="hidden sm:inline">Collection</span> <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-600" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
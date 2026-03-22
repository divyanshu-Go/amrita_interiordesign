// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {

  // ── Image Optimisation ─────────────────────────────────────────────────
  images: {
    // BEFORE: hostname: '**' — allowed every domain. Security risk + open proxy.
    // AFTER: explicit allowlist. Add domains here when you add new image sources.
    remotePatterns: [
      // Cloudinary — primary image host (all new uploads go here)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // PostImg — legacy URLs still in DB. Remove once fully migrated to Cloudinary.
      { protocol: "https", hostname: "i.postimg.cc" },
      // Unsplash — used in GetInspiredCarousel slides
      { protocol: "https", hostname: "images.unsplash.com" },
      // HR Johnson — category/product images seen in Lighthouse
      { protocol: "https", hostname: "www.hrjohnsonindia.com" },
      // Google profile pictures (ready for Google OAuth if you add it)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],

    // AVIF first (50% smaller than WebP), WebP fallback.
    // next/image automatically serves the best format the browser supports.
    // Zero code changes needed anywhere — applies to every <Image> on the site.
    formats: ["image/avif", "image/webp"],

    // Fine-tuned breakpoints matching your Tailwind card grid layout.
    deviceSizes: [390, 640, 768, 1024, 1280, 1536],
    imageSizes:  [64, 128, 256, 384, 512],

    contentDispositionType: "attachment",
  },

  // ── Security + Caching Headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents clickjacking (embedding your site in iframes)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stops browser guessing content types
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controls referrer info sent to other sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable unused browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      // Static assets are content-hashed by Next.js — safe to cache forever
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  compress: true,       // gzip/brotli all responses
  poweredByHeader: false, // remove X-Powered-By: Next.js header
  trailingSlash: false, // /category/tiles not /category/tiles/
};

export default nextConfig;

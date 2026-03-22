// components/HomePage/HeroSection.jsx
"use client";


// ─────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import Link from "next/link";

// Simple fade-up — used for all entry animations
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "320px",
          background:
            "linear-gradient(135deg, #92400e 0%, #ea580c 33%, #c2410c 66%, #7c2d12 100%)",
        }}
      >
        {/* ── Content ── */}
        <div
          className="relative z-10 flex items-center justify-center px-6 text-center"
          style={{ minHeight: "320px" }}
        >
          <div className="max-w-3xl mx-auto">

            {/* Badge */}
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/15 border border-orange-300/40 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span className="text-sm font-medium text-orange-100">
                New Collection 2025
              </span>
            </motion.div>

            {/* Heading — single element, one animation instead of 32 */}
            <motion.h1
              {...fadeUp(0.15)}
              className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight flex items-center justify-center flex-wrap gap-x-2"
            >
              Transform Your Space Instantly
              <Flame className="w-6 h-6 text-orange-300 flex-shrink-0" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.28)}
              className="text-orange-100 text-sm md:text-base mb-6 max-w-2xl mx-auto"
            >
              Premium flooring, wallpaper &amp; decor handpicked for modern living
            </motion.p>

            {/* CTA */}
            <motion.div {...fadeUp(0.38)}>
              <Link href="/category/all">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-700 via-orange-600 to-yellow-600 text-white font-semibold rounded-lg transition-all group"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* ── Static CSS wave — replaces 3 morphing framer-motion SVG paths ──
            Looks virtually identical, uses zero JS, renders instantly.        ── */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-none"
          style={{ height: "80px" }}
        >
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 0,40 Q 300,10 600,40 T 1200,40 L 1200,80 L 0,80 Z"
              fill="rgba(234,88,12,0.18)"
            />
            <path
              d="M 0,55 Q 300,25 600,55 T 1200,55 L 1200,80 L 0,80 Z"
              fill="rgba(249,115,22,0.12)"
            />
            <path
              d="M 0,65 Q 300,45 600,65 T 1200,65 L 1200,80 L 0,80 Z"
              fill="rgba(245,158,11,0.08)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
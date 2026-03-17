// components/HomePage/HeroSection.jsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame  } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Text drawing animation for each character
  const headingText = "Transform Your Space Instantly";
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Hero Background Section */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "320px",
          background:
            "linear-gradient(135deg, #92400e 0%, #ea580c 33%, #c2410c 66%, #7c2d12 100%)",
        }}
      >
        {/* Particle System with Curved Paths */}
        {[...Array(15)].map((_, i) => {
          const seedTop = (i * 7) % 80;
          const seedLeft = (i * 13) % 100;
          const seedDuration = 8 + ((i * 3) % 4);

          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-orange-300 opacity-60"
              style={{
                top: `${seedTop}%`,
                left: `${seedLeft}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 80, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: seedDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          );
        })}

        {/* Content */}
        <div
          className="relative z-10 h-full flex items-center justify-center px-6 text-center"
          style={{ minHeight: "320px" }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/15 border border-orange-300/40 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span className="text-sm font-medium text-orange-100">
                New Collection 2025
              </span>
            </motion.div>

            {/* Main Heading - Animated Text Drawing */}
            <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight flex items-center justify-center flex-wrap">
              {headingText.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className={char === " " ? "w-2" : ""}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <Flame className="w-6 h-6 text-orange-300 ml-2" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-orange-100 text-sm md:text-base mb-6 max-w-2xl mx-auto"
            >
              Premium flooring, wallpaper & decor handpicked for modern living
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Link href="/category/all">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-700 via-orange-600 to-yellow-600 text-white font-semibold rounded-lg transition-all group"
                >
                  Explore Products
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated SVG Waves - 3 Layers */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{ minHeight: "120px" }}
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(234, 88, 12, 0.3)" />
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0.1)" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.2)" />
              <stop offset="100%" stopColor="rgba(253, 224, 71, 0.05)" />
            </linearGradient>
            <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.15)" />
              <stop offset="100%" stopColor="rgba(254, 243, 199, 0)" />
            </linearGradient>
          </defs>

          {/* Wave 1 */}
          <motion.path
            d="M 0,80 Q 300,40 600,80 T 1200,80 L 1200,200 L 0,200 Z"
            fill="url(#waveGrad1)"
            animate={{
              d: [
                "M 0,80 Q 300,40 600,80 T 1200,80 L 1200,200 L 0,200 Z",
                "M 0,100 Q 300,60 600,100 T 1200,100 L 1200,200 L 0,200 Z",
                "M 0,80 Q 300,40 600,80 T 1200,80 L 1200,200 L 0,200 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Wave 2 */}
          <motion.path
            d="M 0,100 Q 300,70 600,100 T 1200,100 L 1200,200 L 0,200 Z"
            fill="url(#waveGrad2)"
            animate={{
              d: [
                "M 0,100 Q 300,70 600,100 T 1200,100 L 1200,200 L 0,200 Z",
                "M 0,110 Q 300,50 600,110 T 1200,110 L 1200,200 L 0,200 Z",
                "M 0,100 Q 300,70 600,100 T 1200,100 L 1200,200 L 0,200 Z",
              ],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />

          {/* Wave 3 */}
          <motion.path
            d="M 0,120 Q 300,90 600,120 T 1200,120 L 1200,200 L 0,200 Z"
            fill="url(#waveGrad3)"
            animate={{
              d: [
                "M 0,120 Q 300,90 600,120 T 1200,120 L 1200,200 L 0,200 Z",
                "M 0,100 Q 300,80 600,100 T 1200,100 L 1200,200 L 0,200 Z",
                "M 0,120 Q 300,90 600,120 T 1200,120 L 1200,200 L 0,200 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
        </svg>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  ShieldCheck,
  Truck,
  Award,
  Layers,
  Palette,
  Sofa,
  Headphones,
} from "lucide-react";

const slides = [
  {
    badge: "NEW COLLECTION 2025",
    heading: "Transform Your Space",
    highlight: "Instantly",
    description:
      "Marble, PVC, WPC & louvers — every premium interior material under one roof.",
    primaryCta: { label: "Explore Products", href: "/category/interior-design" },
    secondaryCta: { label: "View Collections", href: "/collections" },
    desktopImage: "/hero/interior-design.jpg",
    mobileImage: "/hero/interior-design-mobile.jpg",
  },
  {
    badge: "WATERPROOF & LOW MAINTENANCE",
    heading: "PVC Panels That",
    highlight: "Just Work",
    description:
      "Sleek, waterproof wall panels built for modern homes — zero upkeep, maximum style.",
    primaryCta: { label: "Shop PVC Panels", href: "/category/pvc-panels" },
    secondaryCta: { label: "See Designs", href: "/category/pvc-panels#designs" },
    desktopImage: "/hero/pvc-panels.jpg",
    mobileImage: "/hero/pvc-panels-mobile.jpg",
  },
  {
    badge: "DURABLE WOOD-LIKE FINISH",
    heading: "WPC, Elegantly",
    highlight: "Engineered",
    description:
      "The warmth of wood with the strength of composite — built to last, styled to impress.",
    primaryCta: { label: "Shop WPC Panels", href: "/category/wpc-panels" },
    secondaryCta: { label: "View Collections", href: "/collections" },
    desktopImage: "/hero/wpc-panels.jpg",
    mobileImage: "/hero/wpc-panels-mobile.jpg",
  },
  {
    badge: "PREMIUM WALL DÉCOR",
    heading: "Louvers With A",
    highlight: "Modern Edge",
    description:
      "Sleek, contemporary louvers that add depth and character to any space.",
    primaryCta: { label: "Shop Louvers", href: "/category/louvers" },
    secondaryCta: { label: "Explore Designs", href: "/category/louvers#designs" },
    desktopImage: "/hero/louvers.jpg",
    mobileImage: "/hero/louvers-mobile.jpg",
  },
];

const featureItems = [
  { icon: Droplet, title: "Waterproof", subtitle: "Built to Last" },
  { icon: ShieldCheck, title: "Premium Quality", subtitle: "Superior Materials" },
  { icon: Truck, title: "Fast Delivery", subtitle: "Across Delhi" },
  { icon: Award, title: "Best Prices", subtitle: "Direct from Factory" },
];

const statItems = [
  { icon: Layers, title: "1000+", subtitle: "Premium Products" },
  { icon: Palette, title: "500+", subtitle: "Unique Designs" },
  { icon: Sofa, title: "Trending", subtitle: "Latest Collection" },
  { icon: Truck, title: "Across Delhi", subtitle: "Delivery Available" },
  { icon: Headphones, title: "Expert Support", subtitle: "7 Days Assistance" },
];

const AUTO_SLIDE_INTERVAL = 6000;

export default function HeroSection() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback((index) => {
    setActive(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[active];

  return (
    <section className="relative w-full aspect-[4/3] md:aspect-[16/9] min-h-[460px] md:min-h-0 overflow-hidden bg-neutral-900 font-sans">
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
          key={s.heading}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === active ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
        >
          {/* Mobile Image (4:3) - Stuck to Top */}
          <div className="block md:hidden absolute top-0 left-0 w-full h-full">
            <Image
              src={s.mobileImage}
              alt={s.heading}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-top" /* Stuck to the top edge */
            />
          </div>

          {/* Desktop Image (16:9) - Stuck to Top */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-full">
            <Image
              src={s.desktopImage}
              alt={s.heading}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-top" /* Stuck to the top edge */
            />
          </div>

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 via-neutral-900/75 to-neutral-900/95 md:bg-gradient-to-r md:from-neutral-900/95 md:via-neutral-900/75 md:to-transparent" />
        </div>
      ))}

      {/* Main Content Overlay */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col justify-center pt-2 pb-16 sm:pb-28">
        <div className="max-w-xl">
          {/* Badge */}
          <span className="inline-block border border-primary-500/60 bg-primary-500/10 backdrop-blur-sm text-primary-300 text-[9px] sm:text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full mb-1.5 sm:mb-4">
            {slide.badge}
          </span>

          {/* Heading */}
          <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-1 sm:mb-3">
            {slide.heading}{" "}
            <span className="text-primary-500">{slide.highlight}</span>
          </h1>
          <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-primary-500 rounded-full mb-2 sm:mb-4" />

          {/* Description */}
          <p className="text-[11px] sm:text-sm md:text-base text-neutral-200 mb-3 sm:mb-6 max-w-md leading-snug sm:leading-relaxed">
            {slide.description}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-6">
            {featureItems.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex flex-col gap-0.5">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" strokeWidth={2.2} />
                <span className="text-[9px] sm:text-[11px] font-bold text-white uppercase tracking-wide mt-0.5">
                  {title}
                </span>
                <span className="text-[8px] sm:text-[10px] text-neutral-300">{subtitle}</span>
              </div>
            ))}
          </div>

          {/* Left-Aligned Buttons */}
          <div className="flex flex-row items-center justify-start gap-2 sm:gap-3">
            <Link
              href={slide.primaryCta.href}
              className="inline-flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-[11px] sm:text-sm font-semibold px-3.5 py-2 sm:px-6 sm:py-3 rounded-md transition-colors shadow-md flex-shrink-0"
            >
              {slide.primaryCta.label}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center justify-center bg-black/20 backdrop-blur-sm border border-white/30 hover:border-white text-white text-[11px] sm:text-sm font-semibold px-3.5 py-2 sm:px-6 sm:py-3 rounded-md transition-colors flex-shrink-0"
            >
              {slide.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-[44px] sm:bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
        {slides.map((s, index) => (
          <button
            key={s.heading}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="p-1"
          >
            <span
              className={`block h-1 rounded-full transition-all ${index === active ? "w-5 sm:w-6 bg-primary-500" : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
                }`}
            />
          </button>
        ))}
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-6 sm:right-6 z-20">
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-1.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {statItems.map(({ icon: Icon, title, subtitle }, index) => (
            <div
              key={title}
              className={`flex-shrink-0 items-center gap-2 ${index >= 3 ? "hidden sm:flex" : "flex"
                }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" strokeWidth={2} />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] sm:text-xs font-bold text-white">{title}</span>
                <span className="text-[8px] sm:text-[10px] text-neutral-400 mt-0.5">{subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
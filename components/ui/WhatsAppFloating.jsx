// components/ui/WhatsAppFloating.jsx

"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useMemo } from "react";

export default function WhatsAppFloating({ phone }) {
  const cleanedPhone = useMemo(() => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  }, [phone]);

  if (!cleanedPhone) return null;

  const message = "Hi, I need help with your products";
  const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex flex-col items-center gap-1"
    >
      {/* Online Badge */}
      <span className="text-xs font-medium text-white bg-green-500 px-2 py-0.5 rounded-full shadow-md">
        We are Online
      </span>

      {/* Outer Glow Ring */}
      <div className="absolute bottom-0 left-0 right-0 h-14 rounded-full bg-green-500 opacity-20 blur-md group-hover:opacity-30 transition" />

      {/* Main Button */}
      <div
        className="
          relative
          flex items-center justify-center
          w-14 h-14
          rounded-full
          bg-green-500
          text-white
          shadow-lg
          transition-all duration-200
          group-hover:scale-110
          group-active:scale-95
        "
      >
        <FaWhatsapp className="w-7 h-7" />
      </div>
    </a>
  );
}
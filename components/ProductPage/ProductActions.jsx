// components/customer/ProductActions.jsx
"use client";

// The ONLY reason this file exists as a Client Component: it touches
// navigator.clipboard, window.location, and window.open. Nothing here
// depends on auth or userRole, so no useAuth() import at all.

import { useState } from "react";
import { Share2, Phone, MessageCircle, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ }) {
  const [shareState, setShareState] = useState("idle");

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
      toast.success("Link copied to clipboard!");
      setTimeout(() => setShareState("idle"), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors text-[11px] font-medium ml-auto"
    >
      {shareState === "copied" ? (
        <>
          <Check className="w-3 h-3" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}

export function ContactButtons({ product, phone = "", whatsapp = "" }) {
  const [copyState, setCopyState] = useState("idle");

  if (!phone && !whatsapp) return null;

  async function handleCopyNumber() {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setCopyState("copied");
      toast.success("Phone number copied!");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      toast.error("Could not copy number");
    }
  }

  function handleWhatsApp() {
    if (!whatsapp) return;
    const msg = `Hi, I'm interested in ${product.name}. Link: ${window.location.href}`;
    window.open(
      `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  function handleCall() {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  return (
    <div className="grid grid-cols-12 gap-1.5">
      {whatsapp && (
        <button
          onClick={handleWhatsApp}
          className="col-span-5 flex items-center justify-center gap-1.5
                     bg-green-600 hover:bg-green-700 text-white
                     px-2 py-2.5 rounded-lg font-semibold transition-colors text-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </button>
      )}

      {phone && (
        <button
          onClick={handleCall}
          className={`${whatsapp ? "col-span-5" : "col-span-10"} flex items-center justify-center gap-1.5
                     bg-blue-600 hover:bg-blue-700 text-white
                     px-2 py-2.5 rounded-lg font-semibold transition-colors text-xs`}
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </button>
      )}

      {phone && (
        <button
          onClick={handleCopyNumber}
          title="Copy phone number"
          className="col-span-2 flex items-center justify-center
                     bg-gray-600 hover:bg-gray-700 text-white
                     py-2.5 rounded-lg transition-colors"
        >
          {copyState === "copied" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}
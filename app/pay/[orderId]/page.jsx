// app/pay/[orderId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { initiatePayment } from "@/lib/actions/payment";

export default function PayPage() {
  const router = useRouter();
  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function startPayment() {
      try {
        // 1) Load Razorpay
        const ok = await loadRazorpayScript();
        if (!ok) throw new Error("Failed to load Razorpay");

        // 2) Initiate payment (backend)
        const {
          razorpayOrderId,
          amount,
          currency,
          orderNumber,
        } = await initiatePayment(orderId);

        // 3) Open Razorpay UI
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: "Your Store Name",
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,

          handler: function () {
            // IMPORTANT: Do NOT mark paid here
            // Just redirect; webhook will confirm
            router.replace("/account");
          },

          modal: {
            ondismiss: function () {
              // User closed popup → order still pending
              router.replace("/account");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        setError(err.message || "Payment failed to start");
      } finally {
        setLoading(false);
      }
    }

    startPayment();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 text-sm text-gray-600">
        Initializing payment…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return null;
}



function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

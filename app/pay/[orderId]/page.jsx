// app/pay/[orderId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader, AlertCircle } from "lucide-react";
import { initiatePayment } from "@/lib/actions/payment";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PayPage() {
  const router           = useRouter();
  const { orderId }      = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function startPayment() {
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error("Could not load Razorpay. Check your connection.");

        const { razorpayOrderId, amount, currency, orderNumber } =
          await initiatePayment(orderId);

        const options = {
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency,
          name:        "interio97",
          description: `Order #${orderNumber}`,
          order_id:    razorpayOrderId,

          handler: function (response) {
            // Payment succeeded on client side.
            // NOTE: Do NOT trust this alone for fulfillment —
            // the webhook (payment.captured) is the source of truth.
            // Redirect to a "pending confirmation" page.
            router.replace(
              `/checkout/confirmation?orderId=${orderId}&orderNumber=${orderNumber}&status=pending`
            );
          },

          modal: {
            ondismiss: function () {
              // User closed the popup — send them back to their orders
              router.replace("/account?tab=orders");
            },
          },

          theme: { color: "#f97316" }, // orange-500 to match your brand
        };

        const rzp = new window.Razorpay(options);

        // Handle payment errors surfaced by Razorpay's own UI
        rzp.on("payment.failed", function (response) {
          setError(
            response.error?.description ||
            response.error?.reason ||
            "Payment failed. Please try again."
          );
        });

        rzp.open();
      } catch (err) {
        setError(err.message || "Failed to start payment");
      }
    }

    startPayment();
  }, [orderId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-sm text-red-700 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setError(null); window.location.reload(); }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Retry Payment
            </button>
            <button
              onClick={() => router.replace("/account?tab=orders")}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-3" />
        <p className="text-sm text-gray-600">Opening payment window…</p>
        <p className="text-xs text-gray-400 mt-1">Please do not close this tab</p>
      </div>
    </div>
  );
}
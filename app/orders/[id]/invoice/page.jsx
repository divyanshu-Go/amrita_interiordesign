// app/(customer)/orders/[id]/invoice/page.jsx
// A clean print-ready invoice page.
// User hits "Invoice" button → opens this page → browser print → Save as PDF.
// No dependencies needed beyond what you already have.

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Printer, ArrowLeft, Loader } from "lucide-react";

const fmt = (n) =>
  (n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function InvoicePage() {
  const router  = useRouter();
  const params  = useParams();
  const orderId = params.id;

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then((d) => setOrder(d.order))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-orange-500 h-8 w-8" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || "Order not found"}</p>
          <button onClick={() => router.back()} className="text-orange-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const { mrp, discount, subtotal, deliveryCharge, grandTotal } = order.totals;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex-1" />
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Printer size={15} /> Print / Save PDF
        </button>
      </div>

      {/* Invoice — this is what gets printed */}
      <div
        ref={printRef}
        className="max-w-2xl mx-auto my-8 px-4 print:my-0 print:px-0 print:max-w-none"
      >
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden print:border-0 print:rounded-none shadow-sm print:shadow-none">

          {/* Header */}
          <div className="bg-orange-500 px-8 py-8 text-white print:bg-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">interio97</h1>
                <p className="text-orange-100 text-sm mt-1">Tax Invoice</p>
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-xs">Invoice Date</p>
                <p className="font-semibold text-sm mt-0.5">{invoiceDate}</p>
                <p className="text-orange-100 text-xs mt-2">Order Number</p>
                <p className="font-bold tracking-widest text-sm mt-0.5">#{order.orderNumber}</p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-6 px-8 py-6 border-b border-gray-200">
            {/* From */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From</p>
              <p className="text-sm font-bold text-gray-900">interio97</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                India<br />
                GSTIN: (if applicable)<br />
                support@interio97.in
              </p>
            </div>
            {/* Bill to */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="text-sm font-bold text-gray-900">{order.addressSnapshot.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {order.addressSnapshot.addressLine1}
                {order.addressSnapshot.addressLine2 && <><br />{order.addressSnapshot.addressLine2}</>}
                <br />
                {order.addressSnapshot.city}, {order.addressSnapshot.state} – {order.addressSnapshot.pincode}
                <br />
                {order.addressSnapshot.phone}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="px-8 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">#</th>
                  <th className="text-left py-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Product</th>
                  <th className="text-center py-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Qty</th>
                  <th className="text-right py-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Unit Price</th>
                  <th className="text-right py-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-3">
                      <p className="font-semibold text-gray-900">{item.productSnapshot.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">SKU: {item.productSnapshot.sku} · per {item.sellBy}</p>
                    </td>
                    <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-700">₹{fmt(item.pricingSnapshot.unitFinalPrice)}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">₹{fmt(item.pricingSnapshot.lineFinalTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 pb-8">
            <div className="ml-auto w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal (MRP)</span>
                <span>₹{fmt(mrp)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>−₹{fmt(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? "FREE" : `₹${fmt(deliveryCharge)}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t-2 border-gray-900 pt-3 mt-2">
                <span>Grand Total</span>
                <span className="text-orange-600">₹{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-5">
            <div className="flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Payment Method</p>
                <p className="text-gray-800 font-semibold">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Payment Status</p>
                <p className="text-gray-800 font-semibold">
                  {order.paymentStatus === "paid"         ? "✅ Paid"
                   : order.paymentStatus === "not_required" ? "Pay on Delivery"
                   : "Pending"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order Status</p>
                <p className="text-gray-800 font-semibold capitalize">
                  {order.orderStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              Thank you for shopping with interio97. For queries, contact support@interio97.in
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:my-0 { margin-top: 0 !important; margin-bottom: 0 !important; }
          .print\\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </>
  );
}
"use client";

import { useState } from "react";
import AddressSection from "./AddressSection";
import { createOrder } from "@/lib/actions/checkout";

export default function CheckoutSection({ onBack }) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function placeOrder() {
    if (!selectedAddress) {
      setError("Please select an address");
      return;
    }

    try {
      setLoading(true);
      await createOrder({
        addressId: selectedAddress._id,
        paymentMethod: "COD",
      });

      // success → reset
      alert("Order placed successfully!");
      onBack();
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-sm text-gray-500"
      >
        ← Back to Cart
      </button>

      <h2 className="text-lg font-medium">Select Shipping Address</h2>

      <AddressSection
        selectable
        onSelect={(addr) => setSelectedAddress(addr)}
      />

      {selectedAddress && (
        <div className="border p-4 rounded bg-gray-50">
          <p className="text-sm text-gray-600">Deliver to:</p>
          <p className="font-medium">{selectedAddress.name}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={loading}
        className="bg-orange-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Placing Order..." : "Place Order (COD)"}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createOrder } from "@/lib/actions/checkout";

export default function CheckoutPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  // Fetch addresses + cart
  useEffect(() => {
    async function fetchData() {
      try {
        const [addrRes, cartRes] = await Promise.all([
          fetch("/api/addresses"),
          fetch("/api/cart"),
        ]);

        if (!addrRes.ok || !cartRes.ok) {
          throw new Error("Failed to load checkout data");
        }

        const addrData = await addrRes.json();
        const cartData = await cartRes.json();

        setAddresses(addrData.addresses || []);
        setCart(cartData.cart);

        // auto-select default address
        const defaultAddr = addrData.addresses?.find(
          (a) => a.isDefault
        );
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    try {
      setPlacingOrder(true);

      console.log("doing..")

      const result = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      });

            console.log("doing..")


      // COD → order done
      if (paymentMethod === "COD") {
        router.push("/account");
      } else {
        // prepaid flow will be added later
        router.push(`/pay/${result.orderId}`);
      }
    } catch (err) {
      alert(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500">Loading checkout…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-600">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        {/* Address */}
        <div className="bg-white border rounded p-6">
          <h2 className="text-lg font-semibold mb-4">
            Shipping Address
          </h2>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block border rounded p-4 cursor-pointer ${
                  selectedAddressId === addr._id
                    ? "border-orange-500"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddressId === addr._id}
                  onChange={() =>
                    setSelectedAddressId(addr._id)
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">
                  {addr.name}
                </span>
                <p className="text-sm text-gray-600">
                  {addr.addressLine1},{" "}
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border rounded p-6">
          <h2 className="text-lg font-semibold mb-4">
            Payment Method
          </h2>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="radio"
              value="PREPAID"
              checked={paymentMethod === "PREPAID"}
              onChange={() => setPaymentMethod("PREPAID")}
            />
            Online Payment (Razorpay)
          </label>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white border rounded p-6 space-y-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {cart.items.map(({ product, quantity, pricing }) => (
          <div
            key={product._id}
            className="flex justify-between text-sm"
          >
            <span>
              {product.name} × {quantity}
            </span>
            <span>₹{pricing.lineTotal}</span>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{cart.subtotal}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded text-sm font-semibold"
        >
          {placingOrder ? "Placing Order…" : "Place Order"}
        </button>
      </div>
    </div>
  );
}

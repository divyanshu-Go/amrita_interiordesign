"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/checkout";
import AddressSelector from "./AddressSelector";
import PaymentSelector from "./PaymentSelector";
import OrderReview from "./OrderReview";
import OrderCheckoutSummary from "./OrderCheckoutSummary";
import { AlertCircle, Loader } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: Address & Payment, 2: Review, 3: Placing
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Fetch cart and addresses on mount
  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [cartRes, addrRes] = await Promise.all([
          fetch("/api/cart"),
          fetch("/api/addresses"),
        ]);

        if (cartRes.status === 401 || addrRes.status === 401) {
          router.push("/login");
          return;
        }

        if (!cartRes.ok || !addrRes.ok) {
          throw new Error("Failed to load checkout data");
        }

        const cartData = await cartRes.json();
        const addrData = await addrRes.json();

        // Validate cart is not empty
        if (!cartData.cart || cartData.cart.items.length === 0) {
          throw new Error("Your cart is empty");
        }

        setCart(cartData.cart);
        setAddresses(addrData.addresses || []);

        // Auto-select default address
        const defaultAddr = addrData.addresses?.find(
          (a) => a.isDefault
        );
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (addrData.addresses?.length > 0) {
          setSelectedAddressId(addrData.addresses[0]._id);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load checkout");
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);
      setError(null);

      const result = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      });

      // Redirect to confirmation page
      router.push(
        `/checkout/confirmation?orderId=${result.orderId}&orderNumber=${result.orderNumber}`
      );
    } catch (err) {
      setError(err.message || "Failed to place order");
      setPlacingOrder(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Loader className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-3" />
            <p className="text-gray-500">Loading checkout…</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Error
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center border border-dashed border-gray-300">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Please add items to your cart before checkout
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">
            Step {step} of {step === 2 ? "2" : "2"}: {step === 1 ? "Shipping & Payment" : "Review Order"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <>
              <AddressSelector
                addresses={addresses}
                selected={selectedAddressId}
                onSelect={setSelectedAddressId}
                onAddNew={() => setShowAddressModal(true)}
              />

              <PaymentSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
              />

              {/* Continue Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Review Order
              </button>
            </>
          ) : (
            <>
              <OrderReview
                cart={cart}
                address={addresses.find((a) => a._id === selectedAddressId)}
                paymentMethod={paymentMethod}
              />

              {/* Back & Place Order Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={placingOrder}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddressId}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {placingOrder ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      Placing Order…
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <OrderCheckoutSummary cart={cart} />
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onAddSuccess={(newAddr) => {
            setAddresses([...addresses, newAddr]);
            setSelectedAddressId(newAddr._id);
            setShowAddressModal(false);
          }}
        />
      )}
    </div>
  );
}

// Simple inline modal for adding address during checkout
function AddressModal({ onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add address");

      const { address } = await res.json();
      onAddSuccess(address);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900">Add New Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Pincode *
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Set as default address
            </span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-lg font-medium"
            >
              {saving ? "Adding…" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
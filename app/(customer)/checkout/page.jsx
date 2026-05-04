// app/(customer)/checkout/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/checkout";
import AddressSelector from "./AddressSelector";
import PaymentSelector from "./PaymentSelector";
import OrderReview from "./OrderReview";
import OrderCheckoutSummary from "./OrderCheckoutSummary";
import { AlertCircle, Loader, ShoppingBag } from "lucide-react";
import AccountLoader from "@/components/Loaders/AccountLoader";
import AddressModal from "./AddressModal";

export default function CheckoutPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
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
        const defaultAddr = addrData.addresses?.find((a) => a.isDefault);
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

      if (result.paymentMethod === "PREPAID") {
        router.push(`/pay/${result.orderId}`);
      } else {
        router.push(
          `/checkout/confirmation?orderId=${result.orderId}&orderNumber=${result.orderNumber}`,
        );
      }
    } catch (err) {
      setError(err.message || "Failed to place order");
      setPlacingOrder(false);
    }
  };

  // Loading State
  if (loading) {
    return <AccountLoader />;
  }

  // Empty Cart Error
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Please add items to your cart before checkout
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="bg-white border-b shadow-sm mb-8">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100">
            <ShoppingBag size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {step} of 2:{" "}
              {step === 1 ? "Shipping & Payment" : "Review Order"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle
              size={18}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-semibold text-red-800 text-sm">Error</p>
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
          <OrderCheckoutSummary
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
            cart={cart}
          />
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

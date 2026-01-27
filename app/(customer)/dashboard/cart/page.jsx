// app/dashboard/cart/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { resolvePrice } from '@/lib/pricing/resolvePrice';
import { createOrder } from '@/lib/actions/checkout';
import { useAuth } from '@/app/providers/AuthProvider';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch cart and addresses
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [cartRes, addressRes] = await Promise.all([
          fetch('/api/cart'),
          fetch('/api/addresses'),
        ]);

        if (!cartRes.ok || !addressRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const cartData = await cartRes.json();
        const addressData = await addressRes.json();

        setCart(cartData.cart);
        setAddresses(addressData.addresses || []);

        // Auto-select default address if exists
        const defaultAddr = addressData.addresses?.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    setIsCheckingOut(true);
    setError('');

    try {
      const result = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      });

      // Redirect to order confirmation
      router.push(`/dashboard/orders/${result.orderId}`);
    } catch (err) {
      setError(err.message || 'Failed to place order');
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  if (error && !cart?.items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const cartEmpty = !cart || !cart.items || cart.items.length === 0;

  if (cartEmpty) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items - Left Side */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Cart Items ({cart.items.length})
            </h2>

            <div className="space-y-4">
              {cart.items.map((item, index) => {
                const pricing = resolvePrice({
                  product: item.product,
                  role: user.role,
                  quantity: item.quantity,
                });

                return (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {item.product?.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          SKU: {item.product?.sku}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} {item.sellBy}(s)
                        </p>

                        {/* Price Info */}
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-600">
                            ₹{pricing.finalUnitPrice?.toFixed(2)}/unit
                          </p>
                          {pricing.discountApplied > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              Save ₹{pricing.discountApplied?.toFixed(2)}/unit
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{pricing.lineTotal?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout - Right Side */}
        <div className="space-y-4">
          {/* Price Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{cart.subtotal?.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{cart.subtotal?.toFixed(2)}</span>
              </div>

              {/* User Role Info */}
              <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-4">
                <p className="text-xs text-blue-800">
                  📌 Pricing calculated for: <strong>{user.role}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Address Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Address
            </h3>

            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 text-sm mb-3">No addresses saved</p>
                <Link
                  href="/dashboard/addresses/add"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Add Address
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      checked={selectedAddressId === addr._id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {addr.name}
                        {addr.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr.city}, {addr.state} {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-600">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-600">Pay when you receive the order</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="PREPAID"
                  disabled
                  checked={paymentMethod === 'PREPAID'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Prepaid</p>
                  <p className="text-xs text-gray-600">Coming soon</p>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isCheckingOut || !selectedAddressId}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isCheckingOut ? 'Placing Order...' : 'Place Order'}
          </button>

          {/* Continue Shopping */}
          <Link
            href="/products"
            className="block text-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
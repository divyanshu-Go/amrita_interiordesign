// account/AccountDataProvider.js
"use client";

import { createContext, useContext, useState } from "react";

const AccountContext = createContext(null);

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error("useAccount must be used inside AccountDataProvider");
  }
  return ctx;
}

export default function AccountDataProvider({ children }) {
  // ----- shared state -----
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState(null);
const [orderDetails, setOrderDetails] = useState({});



  // ----- loading flags (per resource) -----
  const [loading, setLoading] = useState({
    user: false,
    addresses: false,
    cart: false,
    orders: false,
  });

  // ----- fetchers (lazy, cached) -----

  async function loadUser() {
    if (user || loading.user) return;

    setLoading((l) => ({ ...l, user: true }));
    const res = await fetch("/api/user/profile");

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setUser(data.user);
    setLoading((l) => ({ ...l, user: false }));
  }

  async function loadAddresses() {
    if (addresses || loading.addresses) return;

    setLoading((l) => ({ ...l, addresses: true }));
    const res = await fetch("/api/addresses");
    const data = await res.json();
    setAddresses(data.addresses);
    setLoading((l) => ({ ...l, addresses: false }));
  }

  async function loadCart() {
    if (cart || loading.cart) return;

    setLoading((l) => ({ ...l, cart: true }));
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.cart);
    setLoading((l) => ({ ...l, cart: false }));
  }

  async function loadOrders() {
    if (orders || loading.orders) return;

    setLoading((l) => ({ ...l, orders: true }));
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders);
    setLoading((l) => ({ ...l, orders: false }));
  }

async function loadOrderDetail(orderId) {
  if (orderDetails[orderId]) return;

  setLoading((l) => ({ ...l, orders: true }));

  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) {
    setLoading((l) => ({ ...l, orders: false }));
    throw new Error("Failed to fetch order details");
  }

  const data = await res.json();

  setOrderDetails((prev) => ({
    ...prev,
    [orderId]: data.order,
  }));

  setLoading((l) => ({ ...l, orders: false }));
}



  return (
    <AccountContext.Provider
      value={{
        // data
        user,
        addresses,
        cart,
        orders,
        orderDetails,

        // setters (used after mutations)
        setUser,
        setAddresses,
        setCart,
        setOrders,

        // loaders
        loadUser,
        loadAddresses,
        loadCart,
        loadOrders,
        loadOrderDetail,

        // loading flags
        loading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAccount } from "./AccountDataProvider";

import ProfileView from "./sections/ProfileView.jsx";
import AddressView from "./sections/AddressView";
import CartView from "./sections/CartView";
import OrdersView from "./sections/OrdersView";

const TABS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "addresses", label: "Addresses", icon: "📍" },
  { id: "cart", label: "Cart", icon: "🛒" },
  { id: "orders", label: "Orders", icon: "📦" },
];

export default function AccountShell() {
  const [activeTab, setActiveTab] = useState("profile");
  const account = useAccount();

  useEffect(() => {
    if (activeTab === "profile") account.loadUser();
    if (activeTab === "addresses") account.loadAddresses();
    if (activeTab === "cart") account.loadCart();
    if (activeTab === "orders") account.loadOrders();
  }, [activeTab, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, addresses, cart, and orders</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-20 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600 bg-orange-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "addresses" && <AddressView />}
        {activeTab === "cart" && <CartView />}
        {activeTab === "orders" && <OrdersView />}
      </div>
    </div>
  );
}
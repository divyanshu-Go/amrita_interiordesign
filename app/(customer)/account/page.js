"use client";

import { useState } from "react";

import ProfileSection from "./sections/ProfileSection";
import AddressSection from "./sections/AddressSection";
import CartSection from "./sections/CartSection";
import OrdersSection from "./sections/OrdersSection";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "address", label: "Address" },
  { key: "cart", label: "Cart" },
  { key: "orders", label: "Orders" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Top Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 h-14 items-center">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-sm font-medium pb-1 border-b-2 transition ${
                  activeTab === tab.key
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "address" && <AddressSection />}
        {activeTab === "cart" && <CartSection />}
        {activeTab === "orders" && <OrdersSection />}
      </div>
    </div>
  );
}

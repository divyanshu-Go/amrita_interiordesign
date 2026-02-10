"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccount } from "./AccountDataProvider";

import ProfileView from "./sections/ProfileView.jsx";
import AddressView from "./sections/AddressView";
import CartView from "./sections/CartView";
import OrdersView from "./sections/OrdersView";

import {
  User,
  MapPin,
  ShoppingCart,
  Package,
} from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "orders", label: "Orders", icon: Package },
];

export default function AccountShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const account = useAccount();

  const tabFromUrl = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    if (activeTab === "profile") account.loadUser();
    if (activeTab === "addresses") account.loadAddresses();
    if (activeTab === "cart") account.loadCart();
    if (activeTab === "orders") account.loadOrders();
  }, [activeTab, account]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    router.push(`/account?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
      {/* Compact Header with Icon Badge */}
      <div className="bg-white shadow-sm ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {/* Icon Badge */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200">
              <User size={24} className="text-orange-600" />
            </div>

            {/* Text */}
            <div>
              <h1 className="text-lg font-bold text-gray-900">My Account</h1>
              <p className="text-xs text-gray-500">
                Manage your profile, orders & addresses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation - Pill Style */}
      <div className="sticky top-0 shadow-sm z-20 bg-orange-50 rounded-sm border border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    px-4 py-2.5 rounded-lg font-medium text-sm 
                    whitespace-nowrap transition-all duration-200 
                    flex items-center gap-2 flex-shrink-0
                    ${
                      isActive
                        ? "bg-orange-100 text-orange-700 border border-orange-300 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-orange-50 border border-transparent"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isActive ? "text-orange-600" : "text-gray-500"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
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
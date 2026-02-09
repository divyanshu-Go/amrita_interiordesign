"use client";

import { MapPin, Plus, Check } from "lucide-react";

export default function AddressSelector({
  addresses,
  selected,
  onSelect,
  onAddNew,
}) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select where you want your order delivered
            </p>
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors border border-blue-200"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="p-6 space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No addresses found</p>
            <button
              onClick={onAddNew}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Add an address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <label
              key={addr._id}
              className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selected === addr._id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex gap-4">
                <input
                  type="radio"
                  checked={selected === addr._id}
                  onChange={() => onSelect(addr._id)}
                  className="mt-1 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  {/* Name & Default Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">
                      {addr.name}
                    </p>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        <Check size={12} />
                        Default
                      </span>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && (
                      <p>{addr.addressLine2}</p>
                    )}
                    <p>
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="flex items-center gap-2 mt-2 text-gray-700">
                      <span>📞</span>
                      {addr.phone}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
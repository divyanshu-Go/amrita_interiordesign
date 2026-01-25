"use client";

import { useEffect, useState } from "react";

export default function AddressSection({ selectable = false, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAddresses() {
    setLoading(true);
    const res = await fetch("/api/address", { cache: "no-store" });
    const data = await res.json();
    setAddresses(data.addresses || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading addresses...</div>;
  }

  if (addresses.length === 0) {
    return <div className="text-gray-500">No addresses added.</div>;
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className="border p-4 rounded flex justify-between items-start"
        >
          <div>
            <p className="font-medium">{addr.name}</p>
            <p className="text-sm text-gray-600">
              {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <p className="text-sm text-gray-600">{addr.phone}</p>
          </div>

          {selectable && (
            <button
              onClick={() => onSelect(addr)}
              className="text-orange-600 text-sm"
            >
              Select
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

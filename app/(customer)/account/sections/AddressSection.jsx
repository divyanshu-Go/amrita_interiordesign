"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressSection() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function fetchAddresses() {
    try {
      setLoading(true);
      const res = await fetch("/api/addresses");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data.addresses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  function openAddForm() {
    setEditingAddress(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEditForm(address) {
    setEditingAddress(address);
    setForm({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(
        editingAddress
          ? `/api/addresses/${editingAddress._id}`
          : "/api/addresses",
        {
          method: editingAddress ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to save address");

      setShowForm(false);
      await fetchAddresses();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id) {
    if (!confirm("Delete this address?")) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete address");
      await fetchAddresses();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border rounded p-6">
        <p className="text-sm text-gray-500">Loading addresses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button
          onClick={openAddForm}
          className="text-sm bg-orange-500 text-white px-4 py-2 rounded"
        >
          Add Address
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="bg-white border rounded p-6 text-sm text-gray-600">
          No addresses added yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`border rounded p-4 bg-white ${
                addr.isDefault ? "border-orange-500" : ""
              }`}
            >
              <div className="flex justify-between gap-4">
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {addr.name}{" "}
                    {addr.isDefault && (
                      <span className="text-orange-600 text-xs">
                        (Default)
                      </span>
                    )}
                  </p>
                  <p>{addr.phone}</p>
                  <p>
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>
                  <p>
                    {addr.city}, {addr.state} – {addr.pincode}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => openEditForm(addr)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(addr._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h3>

            {[
              ["name", "Name"],
              ["phone", "Phone"],
              ["addressLine1", "Address Line 1"],
              ["addressLine2", "Address Line 2"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  required={key !== "addressLine2"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            ))}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
              />
              Set as default address
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-orange-500 text-white rounded text-sm"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

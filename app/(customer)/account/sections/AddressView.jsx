"use client";

import { useAccount } from "../AccountDataProvider";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/actions/address";
import { useState } from "react";

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

export default function AddressView() {
  const {
    addresses,
    setAddresses,
    loading,
  } = useAccount();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  if (loading.addresses || !addresses) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading addresses…
      </div>
    );
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(addr) {
    setEditing(addr);
    setForm({ ...addr });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      let updated;
      if (editing) {
        updated = await updateAddress(editing._id, form);
        setAddresses((prev) =>
          prev.map((a) => (a._id === updated._id ? updated : a))
        );
      } else {
        updated = await createAddress(form);
        setAddresses((prev) => [...prev, updated]);
      }

      if (form.isDefault) {
        setAddresses((prev) =>
          prev.map((a) =>
            a._id === updated._id
              ? { ...a, isDefault: true }
              : { ...a, isDefault: false }
          )
        );
      }

      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this address?")) return;
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a._id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button
          onClick={openAdd}
          className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
        >
          Add Address
        </button>
      </div>

      {/* List */}
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
              <div className="flex justify-between">
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {addr.name}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs text-orange-600">
                        Default
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
                    onClick={() => openEdit(addr)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
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
            onSubmit={handleSave}
            className="bg-white rounded-lg w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {editing ? "Edit Address" : "Add Address"}
            </h3>

            {Object.entries({
              name: "Name",
              phone: "Phone",
              addressLine1: "Address Line 1",
              addressLine2: "Address Line 2",
              city: "City",
              state: "State",
              pincode: "Pincode",
            }).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  value={form[key] || ""}
                  required={key !== "addressLine2"}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            ))}

            <label className="flex gap-2 text-sm">
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
                className="border px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
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

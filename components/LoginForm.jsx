// components/LoginForm.jsx
"use client";

import { useRouter } from "next/navigation";
import { AuthButton, FormInput } from "./AuthUtils/AuthFunctions";
import { useState } from "react";
import Link from "next/link";
import { getGuestCart, clearGuestCart } from "@/lib/guestCart";
import { mergeGuestCart } from "@/lib/actions/mergeGuestCart";

const ROLE_LINKS = [
  { role: "user", label: "User", href: "/login/user" },
  { role: "admin", label: "Admin", href: "/login/admin" },
  { role: "enterprise", label: "Enterprise", href: "/login/enterprise" },
];

export const LoginForm = ({ defaultRole = "user" }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", role: defaultRole });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.startsWith("Your enterprise")) {
          setMessage(data.error);
          router.push("/login/notice");
        } else {
          setErrors({ submit: data.error || "Login failed" });
        }
        return;
      }

      // ── Cart merge: runs before redirect, after cookie is set ──────────
      // auth_token cookie is already set by the API response at this point
      const guestCart = getGuestCart();
      console.log("[LoginForm] ENTRY", guestCart);
      if (guestCart.items.length > 0) {
        try {
          console.log("[LoginForm] ENTRY Merging guest cart");
          await mergeGuestCart(guestCart.items);
          console.log("[LoginForm] ENTRY Clearing guest cart from localStorage");
          clearGuestCart();
        } catch (mergeErr) {
          // Non-fatal: log and continue — user still gets logged in
          console.warn("Cart merge failed:", mergeErr);
        }
      }
      // ───────────────────────────────────────────────────────────────────

      setMessage("Login successful! Redirecting...");
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "enterprise_active") {
        router.push("/account");
      } else {
        router.push("/cart"); // important: go to cart after login
      }

      // 🔑 Force revalidation (CRITICAL)
      router.refresh();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const currentLabel = ROLE_LINKS.find((r) => r.role === defaultRole)?.label;
  const otherRoles = ROLE_LINKS.filter((r) => r.role !== defaultRole);

  return (
    <div className="mx-auto my-12 w-full max-w-lg p-6 rounded-lg border border-gray-200 shadow-sm bg-white">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-1">Welcome Back</h2>
      <p className="text-center text-sm text-gray-500 mb-6">{currentLabel} Login</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />

        <Link href="/forgot-password" className="text-xs text-orange-700 hover:underline">
          Forgot Password?
        </Link>

        {errors.submit && (
          <div className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {errors.submit}
          </div>
        )}
        {message && (
          <div className={`text-sm px-3 py-2 rounded ${message.includes("pending") ? "bg-yellow-100 text-yellow-700" :
              message.includes("rejected") ? "bg-red-100 text-red-700" :
                "bg-green-100 text-green-700"
            }`}>
            {message}
          </div>
        )}

        <AuthButton isLoading={isLoading}>Log In</AuthButton>

        <p className="text-sm text-center text-gray-600 mt-1">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-600 hover:underline">Sign up</Link>
        </p>

        {/* Other role links */}
        <div className="flex justify-center items-center gap-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Login as:</span>
          {otherRoles.map(({ role, label, href }) => (
            <Link key={role} href={href} className="text-xs text-orange-600 hover:underline">
              {label}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
};
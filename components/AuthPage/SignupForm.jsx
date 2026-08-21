// components/SignupForm.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthButton, FormInput } from "./AuthField";
import { getGuestCart, clearGuestCart } from "@/lib/guestCart";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";

const ROLE_LINKS = [
  { role: "user", label: "User", href: "/signup/user" },
  { role: "enterprise", label: "Enterprise", href: "/signup/enterprise" },
];

export const SignupForm = ({ defaultRole = "user" }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    gstNumber: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const isEnterprise = defaultRole === "enterprise";

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Min 8 characters required";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (isEnterprise) {
      if (!formData.businessName) newErrors.businessName = "Business name is required";
      if (!formData.gstNumber) newErrors.gstNumber = "GST number is required";
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = "Enter a valid 10-digit phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 1. Extract guest cart items
      const guestCart = getGuestCart();
      const guestItems = !isEnterprise ? guestCart?.items || [] : [];

      // 2. Pass guestItems in request body
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: defaultRole,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          guestItems,
          ...(isEnterprise && {
            businessName: formData.businessName,
            gstNumber: formData.gstNumber,
            phone: formData.phone,
          }),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      // 3. Clear guest cart if items were merged
      if (guestItems.length > 0) {
        clearGuestCart();
      }

      // 4. Update Auth Context for regular users
      if (!isEnterprise && data.user) {
        login(data.user);
      }

      // 5. Handle redirects
      if (isEnterprise) {
        toast.success("Account created. Awaiting admin approval.");
        router.push(
          `/login/notice?msg=${encodeURIComponent(
            "Your enterprise account has been created successfully. An admin needs to verify your account before you can access enterprise-level features."
          )}`
        );
        return;
      }

      toast.success("Account created successfully");
      router.push("/");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
    error: errors[key],
  });

  const currentLabel = ROLE_LINKS.find((r) => r.role === defaultRole)?.label;
  const otherRoles = ROLE_LINKS.filter((r) => r.role !== defaultRole);

  return (
    <div className="mx-auto my-12 w-full max-w-lg p-6 rounded-lg border border-gray-200 shadow-sm bg-white">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-1">
        Create an Account
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">{currentLabel} Signup</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`flex gap-6 ${isEnterprise ? "flex-row" : "flex-col"}`}>
          {/* Common fields */}
          <div className="w-full space-y-3">
            <FormInput label="Name" type="text" {...field("name")} />
            <FormInput label="Email" type="email" {...field("email")} />
            <FormInput label="Password" type="password" {...field("password")} />
            <FormInput label="Confirm Password" type="password" {...field("confirmPassword")} />
            <p className="text-xs text-gray-500">Password must be at least 8 characters.</p>
          </div>

          {/* Enterprise-only fields */}
          {isEnterprise && (
            <div className="w-full space-y-3">
              <FormInput label="Business Name" type="text" {...field("businessName")} />
              <FormInput label="GST Number" type="text" {...field("gstNumber")} />
              <FormInput label="Phone Number" type="text" {...field("phone")} />
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {errors.submit}
          </div>
        )}

        <AuthButton isLoading={isLoading}>Sign Up</AuthButton>

        <p className="text-sm text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:underline">Log in</Link>
        </p>

        <div className="flex justify-center items-center gap-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Sign up as:</span>
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
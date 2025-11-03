"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthButton, FormInput } from "./AuthUtils/AuthFunctions";

export const SignupForm = () => {
  const router = useRouter();

  // 👇 Role state
  const [role, setRole] = useState("user");

  // 👇 Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    gstNo: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Validation
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

    // 👇 Additional validation for enterprise
    if (role === "enterprise") {
      if (!formData.businessName)
        newErrors.businessName = "Business name is required";
      if (!formData.gstNo)
        newErrors.gstNo = "GST number is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!/^[0-9]{10}$/.test(formData.phone))
        newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
// ✅ Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(role === "enterprise" && {
          businessName: formData.businessName,
          gstNo: formData.gstNo,
          phone: formData.phone,
        }),
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Signup failed");

    // ✅ If enterprise account, redirect to notice page
    if (role == "enterprise") {
      router.push(
        `/login/notice?msg=${encodeURIComponent(
          "Your enterprise account has been created successfully. An admin needs to verify your account before you can access enterprise-level features."
        )}`
      );
      return;
    }

   // ✅ Normal user or admin → go to homepage
    router.push("/"); // use router.push here too
  } catch (error) {
    setErrors({ submit: error.message });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="mx-auto my-12 w-full max-w-lg p-6 rounded-lg border border-gray-200 shadow-sm bg-white">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
        Create an Account
      </h2>

      {/* ✅ Role Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex w-full max-w-xs rounded-lg overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-center font-medium ${
              role === "user"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("enterprise")}
            className={`flex-1 py-2 text-center font-medium ${
              role === "enterprise"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Enterprise
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className="flex space-x-6">
        <div className="w-full space-y-3">
        {/* Common fields */}
        <FormInput
          label="Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
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
        <FormInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
        />
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters.
        </p>

        </div>


        {/* 👇 Conditional Enterprise fields */}
        {role === "enterprise" && (
        <div className="w-full space-y-3">
            <FormInput
              label="Business Name"
              type="text"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              error={errors.businessName}
            />
            <FormInput
              label="GST Number"
              type="text"
              value={formData.gstNo}
              onChange={(e) =>
                setFormData({ ...formData, gstNo: e.target.value })
              }
              error={errors.gstNo}
            />
            <FormInput
              label="Phone Number"
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              error={errors.phone}
            />
        </div>
        )}

        </div>


        {errors.submit && (
          <div className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {errors.submit}
          </div>
        )}

        <AuthButton isLoading={isLoading}>Sign Up</AuthButton>

        <p className=" text-sm text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

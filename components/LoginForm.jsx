"use client";

import { useRouter } from "next/navigation";
import { AuthButton, FormInput } from "./AuthUtils/AuthFunctions";
import { useState } from "react";
import Link from "next/link";

export const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // default
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // ✅ For backend message like pending verification
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Please select a role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle submit
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
        // backend sends enterprise verification status as error too
        if (
          data.error?.startsWith("Your enterprise")
        ) {
          setMessage(data.error); // ✅ show below form
          router.push(`/login/notice`);
        } else {
          setErrors({ submit: data.error || "Login failed" });
        }
        return;
      }

      // ✅ If login successful2
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "enterprise_active") {
          router.push("/enterprise/dashboard");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-12 w-full max-w-lg p-6 rounded-lg border border-gray-200 shadow-sm bg-white">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
        Welcome Back
      </h2>

      {/* ✅ Role Selector (Buttons like signup) */}
      <div className="flex justify-center mb-6">
        <div className="flex w-full max-w-xs rounded-lg overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "user" })}
            className={`flex-1 py-2 text-center font-medium ${
              formData.role === "user"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "admin" })}
            className={`flex-1 py-2 text-center font-medium ${
              formData.role === "admin"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "enterprise" })}
            className={`flex-1 py-2 text-center font-medium ${
              formData.role === "enterprise"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Enterprise
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Input */}
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          error={errors.email}
        />

        {/* Password Input */}
        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
        />

        <Link href="/forgot-password" className="text-xs hover:underline text-orange-700 hover:cursor-pointer">Forgot Password ?</Link>

        {/* ❌ Error */}
        {errors.submit && (
          <div className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {errors.submit}
          </div>
        )}

        {/* ⚠️ Message (for pending/rejected/success) */}
        {message && (
          <div
            className={`text-sm px-3 py-2 rounded ${
              message.includes("pending")
                ? "bg-yellow-100 text-yellow-700"
                : message.includes("rejected")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit Button */}
        <AuthButton isLoading={isLoading}>Log In</AuthButton>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-gray-600 mt-3">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

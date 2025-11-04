"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthButton, FormInput } from "@/components/AuthUtils/AuthFunctions";
import { isValidEmail } from "@/lib/validators/emailValidator";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "sent" | "error"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError("");
    setMessage("");
    if (!email) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Please enter a valid email address");


    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ❌ If backend says user not found
        if (res.status === 404) {
          setMessage(data.error || "This email is not registered. Please sign up first.");
        } else {
          setMessage(data.error || "Failed to send reset link.");
        }
        setStatus("error");
        return;
      }

      // ✅ Success
      setStatus("sent");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Reset your password</h2>

        {status === "sent" ? (
          <div className="bg-green-50 text-green-800 p-4 rounded">
            We’ve sent a password reset link to your email. Please check your inbox.
            <div className="mt-3">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <AuthButton isLoading={loading}>Send reset link</AuthButton>

            {status=="error" && (
              message && (
          <div
            className={`text-xs px-3 py-2 rounded bg-red-100 text-red-700 
            }`}
          >
            {message}<Link href="/signup" className="text-blue-600 hover:underline">Signup</Link>
          </div>
        )
            )}

            <div className="text-sm text-center">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

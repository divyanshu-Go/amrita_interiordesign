// app/reset-password/page.jsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthButton, FormInput } from "@/components/AuthUtils/AuthFunctions";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [valid, setValid] = useState(null); // null | true | false
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  console.log("token : ", token);
  console.log("email : ", email);



  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }
    // Optional: pre-validate token
    (async () => {
      try {
        const res = await fetch(
          `/api/auth/validate-reset-token?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        setValid(!!data.valid);
      } catch (err) {
        setValid(false);
      }
    })();
  }, [token, email]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword || newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (newPassword !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }
      setSuccessMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (valid === null) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="bg-white p-6 rounded shadow">Validating link...</div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="mb-4">This reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Set a new password</h2>

        {successMsg ? (
          <div className="bg-green-50 text-green-700 p-3 rounded">{successMsg}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={error && error.toLowerCase().includes("password") ? error : ""}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={error && error.toLowerCase().includes("match") ? error : ""}
            />

            <p className="text-xs text-gray-500">
              Password must be at least 8 characters.
            </p>


            {error && !error.toLowerCase().includes("password") && (
              <div className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded">{error}</div>
            )}

            <AuthButton isLoading={loading}>Save new password</AuthButton>


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

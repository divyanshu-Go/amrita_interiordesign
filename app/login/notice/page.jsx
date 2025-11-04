"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function EnterpriseNoticePage() {
  const params = useSearchParams();
  const router = useRouter();
  const message =
    params.get("msg") ||
    "Your enterprise account is pending admin verification.";

  return (
    <div className=" flex items-center justify-center p-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-yellow-500" />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Enterprise Verification Required
        </h1>

        <p className="text-gray-600 text-sm mb-4">{message}</p>

        <div className="text-sm text-gray-700 mb-4 space-y-1">
          <p>
            <strong>Admin Email:</strong> admin@123.com
          </p>
          <p>
            <strong>Contact Info:</strong> 1234567890
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          View Website with Retail Prices
        </Link>

        <button
          onClick={() => router.push("/login")}
          className="block w-full mt-4 text-sm text-gray-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

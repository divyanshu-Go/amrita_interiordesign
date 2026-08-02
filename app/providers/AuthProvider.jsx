// app/providers/AuthProvider.jsx
"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  // Called from LoginForm / SignupForm after successful auth API response
  const login = (userData) => {
    setUser(userData);
    router.refresh(); // Refreshes Next.js Server Component cache & headers
  };

  // Called when user clicks logout button
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      setUser(null);
      router.refresh();
      router.push("/login");
    }
  };

  const value = {
    user,
    userRole: user?.role || "user",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
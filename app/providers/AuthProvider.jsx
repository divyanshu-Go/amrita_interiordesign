"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const json = await res.json();
      setUser(json.user || null);
    } catch (err) {
      console.error("AuthProvider: failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    userRole: user?.role || "user",
    loading,
    refreshUser: fetchUser, // call after login/logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

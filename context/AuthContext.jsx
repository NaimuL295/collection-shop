"use client";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load current user from /api/me
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

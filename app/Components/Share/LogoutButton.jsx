"use client";

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";


export default function LogoutButton() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Clear user from context
      setUser(null);

      // Redirect to login
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to logout. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: "8px 16px",
        backgroundColor: "#ff4d4f",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

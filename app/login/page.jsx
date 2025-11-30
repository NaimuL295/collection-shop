
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // ✅ Always defined (empty string)
  const [password, setPassword] = useState(""); // ✅ Always defined (empty string)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Sending login request:", { email, password });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data });

      if (data.success) {
        console.log("Login successful, refreshing and redirecting...");
        router.refresh();
        router.push("/");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email} // ✅ Always a string (never undefined)
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password} // ✅ Always a string (never undefined)
          required
          onChange={(e) => setPassword(e.target.value)} // ✅ Fixed: was e.target.value
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don t have an account?{" "}
        <a href="/register" className="text-black font-medium hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
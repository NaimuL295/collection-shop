"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setUser(data.user); // save user globally
      router.push("/");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

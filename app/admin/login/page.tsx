"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
<<<<<<< HEAD

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
=======
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
>>>>>>> 064116b1b0f1dfcec6025e2a4da8db125afa814b
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
<<<<<<< HEAD
      setError("Something went wrong. Please try again.");
=======
      setError("Unable to connect to the server. Please try again.");
>>>>>>> 064116b1b0f1dfcec6025e2a4da8db125afa814b
    } finally {
      setLoading(false);
    }
  }

  return (
<<<<<<< HEAD
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm text-orange-400 font-medium">
            THE ROYAL BEAUTY
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Sign in to manage your beauty booking platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theroyalbeauty.in"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-orange-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
=======
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        background:
          "linear-gradient(135deg, #fff8fa 0%, #ffffff 55%, #fdf1f5 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#fff",
          border: "1px solid #f0dce2",
          borderRadius: 24,
          padding: 34,
          boxShadow: "0 20px 60px rgba(80, 25, 45, 0.10)",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: "#c45b78",
            color: "#fff",
            fontWeight: 800,
            fontSize: 22,
            marginBottom: 20,
          }}
        >
          R
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "#c45b78",
            marginBottom: 8,
          }}
        >
          The Royal Beauty
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 32 }}>
          Admin Login
        </h1>

        <p style={{ margin: "0 0 26px", color: "#6d6266" }}>
          Sign in to manage bookings, services, staff and your beauty
          platform.
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theroyalbeauty.in"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                border: "1px solid #dfd4d8",
                borderRadius: 12,
                outline: "none",
                fontSize: 15,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                border: "1px solid #dfd4d8",
                borderRadius: 12,
                outline: "none",
                fontSize: 15,
              }}
            />
          </label>

          {error && (
            <div
              role="alert"
              style={{
                padding: "11px 13px",
                borderRadius: 10,
                background: "#fff1f2",
                color: "#b4233c",
                border: "1px solid #ffd1d8",
                fontSize: 14,
              }}
            >
>>>>>>> 064116b1b0f1dfcec6025e2a4da8db125afa814b
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
=======
            style={{
              border: 0,
              borderRadius: 12,
              padding: "14px 18px",
              background: loading ? "#d9a7b6" : "#c45b78",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in to Admin"}
>>>>>>> 064116b1b0f1dfcec6025e2a4da8db125afa814b
          </button>
        </form>
      </div>
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 064116b1b0f1dfcec6025e2a4da8db125afa814b

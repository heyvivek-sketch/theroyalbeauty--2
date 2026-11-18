"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
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
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
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
          </button>
        </form>
      </div>
    </main>
  );
}

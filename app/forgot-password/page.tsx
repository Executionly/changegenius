"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 48,
            maxWidth: 450,
            width: "100%",
            textAlign: "center",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 12,
              color: "#0a1628",
            }}
          >
            Check your email
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
            We've sent a password reset link to <strong>{email}</strong>. The
            link will expire in 1 hour.
          </p>
          <Link
            href="/login"
            style={{
              color: "#4d8ef8",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 48,
          maxWidth: 450,
          width: "100%",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link
            href="/"
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0a1628",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 24,
            }}
          >
            ChangeGenius™
          </Link>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0a1628",
              marginBottom: 8,
            }}
          >
            Forgot password?
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
              color: "#dc2626",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: "#0a1628",
              }}
            >
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4d8ef8",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Sending..." : "Send reset link →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            href="/login"
            style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

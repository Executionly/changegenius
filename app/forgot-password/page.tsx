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
      <div className="auth-container-new">
        <div className="auth-card-new">
          <div className="auth-header">
            <div className="logo">
              <div className="logo-icon"></div>
              <span>ChangeGenius™</span>
            </div>
            <h1>Check your email</h1>
            <p>
              If an account exists for <strong>{email}</strong>, we sent a
              password reset link.
            </p>
          </div>
          <div className="auth-footer"
          style={{
            marginTop: 24,
          }}>
            <Link href="/login"
            style={{ color: 'blue'}}>← Back to login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container-new">
      <div className="auth-card-new">
        <div className="auth-header">
          <div className="logo">
              <div className="logo-icon"></div>
              <span>ChangeGenius™</span>
            </div>
          <h1>Reset password</h1>
          <p className="subtitle">Enter your email and we'll send a reset link.</p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-box">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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

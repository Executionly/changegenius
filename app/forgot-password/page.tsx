"use client";
import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await forgotPassword(email);
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              ChangeGenius™
            </Link>
            <h1>Check your email</h1>
            <p>
              If an account exists for <strong>{email}</strong>, we sent a
              password reset link.
            </p>
          </div>
          <div className="auth-footer">
            <Link href="/login">← Back to login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            ChangeGenius™
          </Link>
          <h1>Reset password</h1>
          <p>Enter your email and we'll send a reset link.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
        <div className="auth-footer">
          <Link href="/login">← Back to login</Link>
        </div>
      </div>
    </div>
  );
}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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

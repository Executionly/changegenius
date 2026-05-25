"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link.",
      );
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 12,
              color: "#0a1628",
            }}
          >
            No reset token found
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            Please use the link from your email to reset your password.
          </p>
          <Link
            href="/forgot-password"
            style={{
              color: "#4d8ef8",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Request new reset link →
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 12,
              color: "#0a1628",
            }}
          >
            Password reset successfully!
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            You can now log in with your new password.
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
    <div className="auth-container-new">
      <div className="auth-card-new">
        <div className="auth-header">
          <div className="logo">
              <div className="logo-icon"></div>
              <span>ChangeGenius™</span>
            </div>
          <h1>Set new password</h1>
          <p>Choose a strong password for your account.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form"
        style={{
          marginTop: '20px'
        }}>
          <div className="input-box">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
            />
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
              Must be at least 6 characters
            </p>
          </div>
          <div className="input-box">
            <input
              type="password"
              required
              placeholder="Confirm New Password"
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
            {loading ? "Resetting..." : "Reset password →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

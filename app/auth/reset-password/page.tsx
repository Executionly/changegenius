"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(password);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New Password"
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm New Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Updating…" : "Update Password →"}
          </button>
        </form>
      </div>
    </div>
  );
}

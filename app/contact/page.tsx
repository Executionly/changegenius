"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
    inquiryType: "team_workshop",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          organization: "",
          message: "",
          inquiryType: "team_workshop",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ background: "#0a1628", padding: "0 24px" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "white",
                textDecoration: "none",
              }}
            >
              ChangeGenius™
            </Link>
            <Link
              href="/"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
        <div
          style={{
            maxWidth: 600,
            margin: "80px auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Message Sent!
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            We'll get back to you within 2 business days.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              padding: "12px 24px",
              background: "#4d8ef8",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Nav */}
      <div style={{ background: "#0a1628", padding: "0 24px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "white",
              textDecoration: "none",
            }}
          >
            ChangeGenius™
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "60px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0a1628",
              marginBottom: 12,
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: 18, color: "#64748b" }}>
            Team Workshops, Custom Training & Support
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 40,
            border: "1px solid #e2e8f0",
          }}
        >
          {error && (
            <div
              style={{
                background: "#fee2e2",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#0a1628",
                }}
              >
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#0a1628",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#0a1628",
                }}
              >
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#0a1628",
                }}
              >
                Inquiry Type *
              </label>
              <select
                value={formData.inquiryType}
                onChange={(e) =>
                  setFormData({ ...formData, inquiryType: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "white",
                }}
              >
                <option value="team_workshop">Team Workshop</option>
                <option value="customized_training">Customized Training</option>
                <option value="support">Support Team</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#0a1628",
                }}
              >
                Message *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                background: "#4d8ef8",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {submitting ? "Sending..." : "Send Message →"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#0a1628",
          padding: "40px 24px",
          textAlign: "center",
          color: "#64748b",
          fontSize: 14,
          marginTop: 60,
        }}
      >
        <p>&copy; 2026 ChangeGenius™. All rights reserved.</p>
      </footer>
    </div>
  );
}

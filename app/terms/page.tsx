"use client";

import Link from "next/link";

export default function TermsPage() {
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

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "48px 56px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0a1628",
              marginBottom: 12,
            }}
          >
            Terms of Use
          </h1>
          <p
            style={{
              color: "#64748b",
              marginBottom: 40,
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: 20,
            }}
          >
            Last updated: May 2026
          </p>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a1628",
                marginBottom: 16,
              }}
            >
              1. Acceptance of Terms
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              By using the Change Genius™ Assessment platform ("the Platform"),
              you agree to use the platform responsibly and ethically. The
              assessment is designed to provide leadership, productivity,
              communication, and execution insights for personal growth, team
              development, workplace performance, entrepreneurship, and
              organizational alignment.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a1628",
                marginBottom: 16,
              }}
            >
              2. Purpose & Limitations
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              Your results are intended for educational, professional, and
              developmental purposes only. The assessment does not provide
              medical, psychological, legal, financial, or clinical advice, and
              it should not be used as a substitute for licensed professional
              services.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a1628",
                marginBottom: 16,
              }}
            >
              3. User Responsibility
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              Users are responsible for how they apply the insights,
              recommendations, and reports generated from the platform. Change
              Genius™ and its partners are not liable for decisions, outcomes,
              or actions taken based on assessment results or interpretations.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a1628",
                marginBottom: 16,
              }}
            >
              4. Intellectual Property
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              All Change Genius™ content, frameworks, models, terminology,
              reports, designs, methodologies, and intellectual property are
              protected and may not be copied, resold, reproduced, modified,
              distributed, or commercially used without written permission.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a1628",
                marginBottom: 16,
              }}
            >
              5. Platform Improvements
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              By continuing to use the platform, you agree to these terms and
              acknowledge that Change Genius™ may improve, update, or refine
              features, reports, and recommendations over time to improve user
              experience and platform quality.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a1628",
                marginBottom: 16,
              }}
            >
              6. Governing Law
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              These terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which Change Genius™ operates,
              without regard to its conflict of law provisions.
            </p>
          </div>

          <div
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#4d8ef8",
                textDecoration: "none",
                marginRight: 24,
              }}
            >
              ← Back to Home
            </Link>
            <Link
              href="/privacy"
              style={{ color: "#4d8ef8", textDecoration: "none" }}
            >
              Privacy Policy →
            </Link>
          </div>
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

"use client";

import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
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
              1. Our Commitment
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              Your privacy matters to us. Change Genius™ is committed to
              protecting your personal information and assessment data
              responsibly.
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
              2. Information We Collect
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              Information collected through the platform may include your name,
              email address, organization information, assessment responses, and
              generated report insights. This information is used to:
            </p>
            <ul
              style={{
                color: "#334155",
                lineHeight: 1.6,
                marginLeft: 24,
                marginTop: 8,
              }}
            >
              <li>Generate personalized reports</li>
              <li>Improve user experience</li>
              <li>Strengthen platform performance</li>
              <li>Provide customer support</li>
              <li>Deliver requested resources, updates, or services</li>
            </ul>
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
              3. Data Sharing & Security
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              Your assessment data will not be sold to third parties. Change
              Genius™ may use secure third-party tools and infrastructure
              providers to support platform operations, analytics, payments,
              communication, and report generation. Reasonable security measures
              are used to help protect your information and maintain
              confidentiality.
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
              4. Research & Benchmarking
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              Aggregated and anonymized assessment insights may occasionally be
              used for research, benchmarking, product improvement, leadership
              intelligence, or organizational development purposes without
              identifying individual users personally.
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
              5. Your Rights
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              You may request account updates or data removal by contacting the
              Change Genius™ support team. By using the platform, you consent to
              the collection and use of information in accordance with this
              privacy policy.
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
              6. Contact Us
            </h2>
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:info@changegenius.ai"
                style={{ color: "#4d8ef8", textDecoration: "none" }}
              >
                info@changegenius.ai
              </a>
              .
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
              href="/terms"
              style={{ color: "#4d8ef8", textDecoration: "none" }}
            >
              Terms of Use →
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

"use client";

import Link from "next/link";

const resources = [
  {
    title: "All about teams: A new approach to organizational transformation",
    url: "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/all-about-teams-a-new-approach-to-organizational-transformation",
    source: "McKinsey",
  },
  {
    title:
      "How to capture the elusive performance edge in true transformations",
    url: "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/how-to-capture-the-elusive-performance-edge-in-true-transformations",
    source: "McKinsey",
  },
  {
    title: "Why You Can't Scale A Business Without Scaling Its Leaders First",
    url: "https://www.forbes.com/councils/forbescoachescouncil/2025/12/17/why-you-cant-scale-a-business-without-scaling-its-leaders-first/",
    source: "Forbes",
  },
  {
    title: "What Leaders Get Wrong About Strategic Alignment",
    url: "https://hbr.org/2026/01/what-leaders-get-wrong-about-strategic-alignment",
    source: "Harvard Business Review",
  },
  {
    title: "Build a Corporate Culture That Works",
    url: "https://hbr.org/2024/07/build-a-corporate-culture-that-works",
    source: "Harvard Business Review",
  },
  {
    title: "Why Change Efforts Still Fail And What Leaders Can Do Differently",
    url: "https://www.forbes.com/councils/forbescoachescouncil/2026/04/30/why-change-efforts-still-fail-and-what-leaders-can-do-differently/",
    source: "Forbes",
  },
];

export default function ResourcesPage() {
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0a1628",
              marginBottom: 12,
            }}
          >
            Change Intelligence Resources
          </h1>
          <p style={{ fontSize: 18, color: "#64748b" }}>
            Curated insights to help you lead transformation with confidence
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {resources.map((resource, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#4d8ef8",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {resource.source}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0a1628",
                  marginBottom: 16,
                  lineHeight: 1.4,
                }}
              >
                {resource.title}
              </h3>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4d8ef8",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Read article →
              </a>
            </div>
          ))}
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
        }}
      >
        <p>&copy; 2026 ChangeGenius™. All rights reserved.</p>
      </footer>
    </div>
  );
}

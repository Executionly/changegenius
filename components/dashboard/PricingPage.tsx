"use client";

import Link from "next/link";

export default function PricingPage() {
  const individualFeatures = [
    "Full 72-question assessment",
    "Primary & secondary Change Genius™ role",
    "Complete ADAPTS stage profile",
    "Personal narrative interpretation",
    "30-day action plan",
    "Productivity Energy",
    "Downloadable PDF report",
    "Share card generation",
    "Invite teammates",
  ];

  const teamFeatures = [
    "Everything in Individual",
    "Team role distribution map",
    "ADAPTS stage coverage analysis",
    "Friction pattern detection",
    "Change pod recommendations",
    "90-day team rollout plan",
    "Team PDF report export",
  ];

  return (
    <div className="pricing-container">
      <div className="pricing-grid">
        {/* Individual Card */}
        <div className="card">
          <div
            className="card-header"
            style={{ background: "var(--brand-light)" }}
          >
            <span className="card-title" style={{ color: "var(--brand)" }}>
              Individual
            </span>
          </div>
          <div className="card-body">
            <div
              style={{ fontSize: 30, fontWeight: 700, color: "var(--text)" }}
            >
              $24
              <span
                style={{ fontSize: 14, fontWeight: 400, color: "var(--muted)" }}
              >
                {" "}
                one-time
              </span>
            </div>
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "14px 0",
              }}
            ></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {individualFeatures.map((feature) => (
                <div
                  key={feature}
                  style={{ fontSize: 12, display: "flex", gap: 7 }}
                >
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>
            <Link
              href="/payment?plan=individual"
              className="btn btn-primary"
              style={{ marginTop: 18, width: "100%", textAlign: "center" }}
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Team Card */}
        <div className="card" style={{ borderColor: "var(--brand)" }}>
          <div
            className="card-header"
            style={{ background: "var(--brand-light)" }}
          >
            <span className="card-title" style={{ color: "var(--brand)" }}>
              Team
            </span>
            <span className="badge badge-blue">Most popular</span>
          </div>
          <div className="card-body">
            <div
              style={{ fontSize: 30, fontWeight: 700, color: "var(--text)" }}
            >
              $24
              <span
                style={{ fontSize: 14, fontWeight: 400, color: "var(--muted)" }}
              >
                {" "}
                / person
              </span>
            </div>
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "14px 0",
              }}
            ></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {teamFeatures.map((feature) => (
                <div
                  key={feature}
                  style={{ fontSize: 12, display: "flex", gap: 7 }}
                >
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>
            <Link
              href="/teams/create"
              className="btn btn-primary"
              style={{ marginTop: 18, width: "100%", textAlign: "center" }}
            >
              Start a Team
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-container {
          width: 100%;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

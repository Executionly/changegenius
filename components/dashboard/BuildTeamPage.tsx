"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuildTeamPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [memberCount, setMemberCount] = useState(3);
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    if (memberCount < 3) {
      setError("Minimum 3 members required");
      return;
    }
    const params = new URLSearchParams({
      plan: "team",
      teamName: teamName.trim(),
      teamSize: String(memberCount),
      organization: organization.trim(),
    });
    router.push(`/payment?${params.toString()}`);
  };

  const total = memberCount * 24;

  return (
    <div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="card-header">
        <span className="card-title">Create a Team</span>
      </div>
      <div className="card-body">
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
          You pay once for all members. They get free access.
        </p>

        {error && (
          <div
            className="error-message"
            style={{
              background: "var(--red-bg)",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: 10,
              marginBottom: 16,
              color: "var(--red)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Team Name *
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Leadership Team Q3"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Number of Members (min. 3)
          </label>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {[3, 5, 8, 10, 15, 20].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMemberCount(n)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 40,
                  border: `1.5px solid ${memberCount === n ? "var(--brand)" : "var(--border)"}`,
                  background: memberCount === n ? "var(--brand)" : "white",
                  color: memberCount === n ? "white" : "var(--text)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {n}
              </button>
            ))}
            <input
              type="number"
              min={3}
              value={memberCount}
              onChange={(e) =>
                setMemberCount(Math.max(3, parseInt(e.target.value) || 3))
              }
              style={{
                width: 80,
                padding: 8,
                border: "1px solid var(--border)",
                borderRadius: 8,
                textAlign: "center",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Organization (optional)
          </label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="e.g. Acme Corp"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          Continue to Payment – ${total}
        </button>
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          One-time payment · No subscription
        </p>
      </div>
    </div>
  );
}

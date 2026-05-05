"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface Member {
  userId: string;
  fullName: string;
  status: string;
  role: string | null;
}

interface TeamDetail {
  id: string;
  name: string;
  organization: string | null;
  inviteCode: string;
  inviteLink: string;
  isOwner: boolean;
  totalMembers: number;
  completedCount: number;
  unlocked: boolean;
  fullUnlocked: boolean;
  members: Member[];
  diagnostic: {
    riskScore: number;
    riskLevel: string;
    frictionPatterns: string[];
  } | null;
}

export default function TeamDetailPage() {
  const { teamId } = useParams() as { teamId: string };
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadTeam() {
      try {
        const res = await fetch(`/api/teams/report?teamId=${teamId}`);
        if (!res.ok) {
          if (res.status === 404) router.push("/teams");
          return;
        }
        const data = await res.json();
        // Flatten the response
        const flattened: TeamDetail = {
          id: data.team?.id,
          name: data.team?.name || "Unnamed Team",
          organization: data.team?.organization || null,
          inviteCode: data.team?.inviteCode,
          inviteLink: data.team?.inviteLink,
          isOwner: data.team?.isOwner || false,
          totalMembers: data.totalMembers ?? 0,
          completedCount: data.completedCount ?? 0,
          unlocked: data.unlocked ?? false,
          fullUnlocked: data.fullUnlocked ?? false,
          members: data.members || [],
          diagnostic: data.diagnostic || null,
        };
        setTeam(flattened);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, [teamId, isAuthenticated, router]);

  const copyInviteLink = () => {
    if (team?.inviteLink) {
      navigator.clipboard.writeText(team.inviteLink);
      alert("Invite link copied!");
    }
  };

  const sendInvite = async () => {
    if (!team) return;
    const emails = inviteEmail
      .split(/[\s,;]+/)
      .filter((e) => e.trim() && e.includes("@"));
    if (emails.length === 0) {
      alert("Please enter at least one valid email address.");
      return;
    }

    setInviting(true);
    setInviteMessage("");
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, emails }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteMessage(`Invited ${emails.length} member(s).`);
        setInviteEmail("");
        setTimeout(() => setInviteMessage(""), 3000);
      } else {
        setInviteMessage(data.error || "Failed to send invites");
      }
    } catch (err) {
      setInviteMessage("Network error");
    } finally {
      setInviting(false);
    }
  };

  if (authLoading || loading) {
    return <DashboardLayout title="Team Details">Loading...</DashboardLayout>;
  }

  if (!team) {
    return (
      <DashboardLayout title="Team Details">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p>Team not found.</p>
          <button
            onClick={() => router.push("/teams")}
            className="btn btn-primary"
            style={{ marginTop: 16 }}
          >
            Back to Teams
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const neededToUnlock = 3 - team.completedCount;
  const unlockMessage =
    neededToUnlock > 0
      ? `Need ${neededToUnlock} more completed member${neededToUnlock !== 1 ? "s" : ""} to unlock team insights.`
      : "Team insights unlocked!";

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    setPdfError("");
    try {
      const res = await fetch(`/api/pdf/team?teamId=${team.id}`);

      if (!res.ok) {
        const result = await res.json();
        setPdfError(result.error || "Failed to generate PDF");
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/pdf")) {
        const text = await res.text();
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "change-genius-team-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <DashboardLayout title={`Team: ${team.name}`}>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title" style={{ fontSize: 20 }}>
              {team.name}
            </h2>
            {team.organization && (
              <div style={{ color: "var(--muted)" }}>{team.organization}</div>
            )}
          </div>
          <div className="badge badge-gray">
            {team.completedCount}/{team.totalMembers} completed
          </div>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            Download Team Report
          </button>
        </div>
        {pdfError && (
          <div style={{ padding: 12, background: "var(--red)", color: "#fff", borderRadius: 8, margin: 16 }}>
            {pdfError}
          </div>
        )}
        <div className="card-body">
          {/* Invite link */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Invite link</div>
            <div
              style={{
                background: "var(--surface)",
                padding: "8px 12px",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <code style={{ fontSize: 12, overflow: "auto" }}>
                {team.inviteLink}
              </code>
              <button onClick={copyInviteLink} className="btn btn-ghost btn-sm">
                Copy
              </button>
            </div>
          </div>

          {/* Invite by email */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Invite by email
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com, another@example.com"
                autoComplete="off"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <button
                onClick={sendInvite}
                disabled={inviting}
                className="btn btn-primary btn-sm"
              >
                {inviting ? "Sending..." : "Send invites"}
              </button>
            </div>
            {inviteMessage && (
              <div
                style={{
                  fontSize: 12,
                  marginTop: 6,
                  color: inviteMessage.includes("Failed")
                    ? "var(--red)"
                    : "var(--green)",
                }}
              >
                {inviteMessage}
              </div>
            )}
          </div>

          {/* Members list */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>
              Members ({team.totalMembers})
            </div>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%" }}>
                <thead style={{ background: "var(--surface)" }}>
                  <tr>
                    <th style={{ padding: "10px 12px", textAlign: "left" }}>
                      Name
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "left" }}>
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member) => (
                    <tr key={member.userId}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        {member.fullName}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        <span
                          className={`badge ${member.status === "completed" ? "badge-green" : "badge-gray"}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        {member.role || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diagnostic / Unlock message */}
          {team.diagnostic && team.unlocked ? (
            <div
              style={{
                padding: 16,
                background: "var(--surface)",
                borderRadius: 8,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 12 }}>
                Team Risk Score: {team.diagnostic.riskScore} (
                {team.diagnostic.riskLevel})
              </div>
              {team.diagnostic.frictionPatterns &&
                team.diagnostic.frictionPatterns.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--amber)",
                        marginBottom: 8,
                      }}
                    >
                      Friction Patterns:
                    </div>
                    <ul style={{ marginLeft: 20, fontSize: 13 }}>
                      {team.diagnostic.frictionPatterns.map((pattern, idx) => (
                        <li key={idx}>{pattern}</li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
          ) : (
            <div
              style={{
                padding: 16,
                background: "var(--surface)",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <p>{unlockMessage}</p>
            </div>
          )}
        </div>
      </div>

      {pdfLoading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--card-bg, #1a1a1a)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "48px 52px",
            textAlign: "center", maxWidth: 340,
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}>
            {/* Animated ring */}
            <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 24px" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ animation: "spin 1.2s linear infinite" }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#12A74C" strokeWidth="4"
                  strokeDasharray="40 124" strokeLinecap="round" />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>📄</div>
            </div>

            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: "var(--text, #fff)" }}>
              Generating your team report
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary, #9ca3af)", lineHeight: 1.6 }}>
              Building your team Change Genius™ PDF.<br />
              This usually takes 10–20 seconds.
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#12A74C",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";

interface Team {
  id: string;
  name: string;
  organization: string | null;
  inviteLink: string;
  totalMembers: number;
  completedCount: number;
  unlocked: boolean;
  fullUnlocked: boolean;
  members: {
    userId: string;
    fullName: string;
    status: string;
    role: string | null;
  }[];
  diagnostic: {
    riskScore: number;
    riskLevel: string;
    frictionPatterns: string[];
  } | null;
}

interface TeamsPageProps {
  teams: Team[];
  onCreateTeam: () => void;
}

export default function TeamsPage({ teams, onCreateTeam }: TeamsPageProps) {
  const [inviteEmails, setInviteEmails] = useState<Record<string, string>>({});
  const [inviteStatus, setInviteStatus] = useState<
    Record<string, { loading: boolean; message: string }>
  >({});

  const copyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Invite link copied!");
  };

  const handleInvite = async (teamId: string) => {
    const emailsText = inviteEmails[teamId] || "";
    const emails = emailsText
      .split(/[\s,;]+/)
      .filter((e) => e.trim() && e.includes("@"));
    if (emails.length === 0) {
      alert("Please enter at least one valid email address.");
      return;
    }

    setInviteStatus((prev) => ({
      ...prev,
      [teamId]: { loading: true, message: "" },
    }));

    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, emails }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteStatus((prev) => ({
          ...prev,
          [teamId]: {
            loading: false,
            message: `Invited ${emails.length} member(s)`,
          },
        }));
        setInviteEmails((prev) => ({ ...prev, [teamId]: "" }));
        setTimeout(() => {
          setInviteStatus((prev) => ({
            ...prev,
            [teamId]: { loading: false, message: "" },
          }));
        }, 3000);
      } else {
        setInviteStatus((prev) => ({
          ...prev,
          [teamId]: {
            loading: false,
            message: data.error || "Failed to send invites",
          },
        }));
      }
    } catch (err) {
      setInviteStatus((prev) => ({
        ...prev,
        [teamId]: { loading: false, message: "Network error" },
      }));
    }
  };

  if (teams.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
        <h3>No teams yet</h3>
        <p>
          Create your first team to invite colleagues and build your Team Change
          Map™.
        </p>
        <button
          onClick={onCreateTeam}
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Create Team →
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {teams.map((team) => (
        <div key={team.id} className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{team.name}</div>
              {team.organization && (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {team.organization}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="badge badge-gray">
                {team.completedCount}/{team.totalMembers} completed
              </span>
              <span
                className={`badge ${team.fullUnlocked ? "badge-green" : team.unlocked ? "badge-blue" : "badge-gray"}`}
              >
                {team.fullUnlocked
                  ? "Full Report"
                  : team.unlocked
                    ? "Basic View"
                    : "Locked"}
              </span>
            </div>
          </div>
          <div className="card-body">
            {/* Invite link + copy */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Invite link
              </div>
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
                <code style={{ fontSize: 12 }}>{team.inviteLink}</code>
                <button
                  onClick={() => copyInviteLink(team.inviteLink)}
                  className="btn btn-ghost btn-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Invite by email – with unique name/id and autocomplete off */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Invite by email
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  name={`invite_${team.id}`}
                  id={`invite_${team.id}`}
                  value={inviteEmails[team.id] || ""}
                  onChange={(e) =>
                    setInviteEmails((prev) => ({
                      ...prev,
                      [team.id]: e.target.value,
                    }))
                  }
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
                  onClick={() => handleInvite(team.id)}
                  disabled={inviteStatus[team.id]?.loading}
                  className="btn btn-primary btn-sm"
                >
                  {inviteStatus[team.id]?.loading
                    ? "Sending..."
                    : "Send invites"}
                </button>
              </div>
              {inviteStatus[team.id]?.message && (
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    color: inviteStatus[team.id].message.includes("Failed")
                      ? "var(--red)"
                      : "var(--green)",
                  }}
                >
                  {inviteStatus[team.id].message}
                </div>
              )}
            </div>

            {/* Members list */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Members</div>
              {team.members.map((member, idx) => (
                <div
                  key={member.userId || `member-${team.id}-${idx}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span>{member.fullName}</span>
                  <span
                    className={`badge ${member.status === "completed" ? "badge-green" : "badge-gray"}`}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Team diagnostic (if unlocked) */}
            {team.diagnostic && team.unlocked && (
              <div
                style={{
                  marginTop: 24,
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
                    <div>
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
                        {team.diagnostic.frictionPatterns.map(
                          (pattern, idx) => (
                            <li key={`${team.id}-pattern-${idx}`}>{pattern}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout, { authFetch } from "../../components/AdminLayout";

interface TeamDetail {
  team: {
    id: string;
    name: string;
    organization: string | null;
    created_at: string;
    owner: { id: string; email: string; full_name: string | null };
  };
  members: Array<{
    id: string;
    status: string;
    joined_at: string;
    profile: {
      id: string;
      email: string;
      full_name: string | null;
      change_genius_role: string | null;
      primary_energy: string | null;
    };
  }>;
  report: {
    report_json: Record<string, unknown>;
    risk_score: number;
    member_count: number;
  } | null;
  pulseWeeks: Array<{
    week: number;
    dialogue: number;
    alignment: number;
    execution: number;
  }>;
}

export default function AdminTeamDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTeam = async () => {
    const res = await authFetch(`/api/admin/teams/${id}`);
    const data = await res.json();
    setTeam(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTeam();
  }, [id]);

  const removeMember = async (userId: string) => {
    if (!confirm("Remove this member from the team?")) return;
    await authFetch(`/api/admin/teams/${id}/members/${userId}`, {
      method: "DELETE",
    });
    loadTeam();
  };

  const deleteTeam = async () => {
    if (!confirm(`Delete team "${team?.team.name}"? This cannot be undone.`))
      return;
    await authFetch(`/api/admin/teams/${id}`, { method: "DELETE" });
    router.push("/admin/teams");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            padding: 48,
          }}
        >
          Loading team data...
        </div>
      </AdminLayout>
    );
  }

  if (!team) {
    return (
      <AdminLayout>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            padding: 48,
          }}
        >
          Team not found
        </div>
      </AdminLayout>
    );
  }

  const riskLevel = team.report?.risk_score ?? 0;
  const riskColor =
    riskLevel > 70 ? "#EF4444" : riskLevel > 40 ? "#F4C842" : "#10B981";

  return (
    <AdminLayout>
      <div>
        {/* Back + header */}
        <button
          onClick={() => router.back()}
          style={{
            marginBottom: 20,
            background: "none",
            border: "none",
            color: "#6C3FC5",
            cursor: "pointer",
            fontSize: 13,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to Teams
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              {team.team.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              {team.team.organization || "No organization"} · Created{" "}
              {new Date(team.team.created_at).toLocaleDateString()}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Owner:{" "}
              {team.team.owner?.full_name || team.team.owner?.email || "—"}
            </p>
          </div>
          <button
            onClick={deleteTeam}
            style={{
              padding: "8px 16px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 6,
              color: "#EF4444",
              cursor: "pointer",
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            Delete Team
          </button>
        </div>

        {/* Risk Assessment Card */}
        {team.report && (
          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.07)",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                marginBottom: 16,
              }}
            >
              Team Risk Assessment
            </h2>
            <div
              style={{
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: riskColor,
                    lineHeight: 1,
                  }}
                >
                  {riskLevel}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 4,
                  }}
                >
                  Risk Score
                </div>
              </div>
              <div
                style={{
                  width: 1,
                  height: 40,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {team.report.member_count}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 4,
                  }}
                >
                  Total Members
                </div>
              </div>
              <div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      riskLevel > 70
                        ? "rgba(239,68,68,0.15)"
                        : riskLevel > 40
                          ? "rgba(244,200,66,0.15)"
                          : "rgba(16,185,129,0.15)",
                    color: riskColor,
                  }}
                >
                  {riskLevel > 70
                    ? "High Risk"
                    : riskLevel > 40
                      ? "Moderate Risk"
                      : "Low Risk"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div
          style={{
            background: "#131F38",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
              Members ({team.members.length})
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 500,
              }}
            >
              <thead
                style={{
                  background: "#0D1628",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <tr>
                  {["Member", "Role", "Energy", "Status", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: ["Status", ""].includes(h)
                          ? "center"
                          : "left",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: 32,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      No members
                    </td>
                  </tr>
                ) : (
                  team.members.map((member) => (
                    <tr
                      key={member.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            fontWeight: 500,
                            color: "white",
                            fontSize: 13,
                          }}
                        >
                          {member.profile.full_name || "—"}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {member.profile.email}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "rgba(255,255,255,0.7)",
                          fontSize: 13,
                        }}
                      >
                        {member.profile.change_genius_role || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "rgba(255,255,255,0.7)",
                          fontSize: 13,
                        }}
                      >
                        {member.profile.primary_energy || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontSize: 10,
                            fontWeight: 600,
                            background:
                              member.status === "completed"
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(244,200,66,0.15)",
                            color:
                              member.status === "completed"
                                ? "#10B981"
                                : "#F4C842",
                          }}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          onClick={() => removeMember(member.profile.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Pulse */}
        {team.pulseWeeks.length > 0 && (
          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                marginBottom: 16,
              }}
            >
              Weekly Pulse
            </h2>
            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              {[
                ["#10B981", "Dialogue"],
                ["#F4C842", "Alignment"],
                ["#6C3FC5", "Execution"],
              ].map(([color, label]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                    }}
                  />
                  {label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {team.pulseWeeks.slice(-8).map((week) => (
                <div
                  key={week.week}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    padding: "12px 16px",
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Wk {week.week}
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {[
                      ["#10B981", week.dialogue],
                      ["#F4C842", week.alignment],
                      ["#6C3FC5", week.execution],
                    ].map(([color, val], i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: color as string,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

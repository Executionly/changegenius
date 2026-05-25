"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout, { authFetch } from "../components/AdminLayout";

interface Team {
  id: string;
  name: string;
  organization: string | null;
  created_at: string;
  owner: { email: string; full_name: string } | null;
  team_reports: Array<{ member_count: number; risk_score: number }>;
}

export default function AdminTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeams();
  }, [page, search]);

  const fetchTeams = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (search) params.set("search", search);

    const res = await authFetch(`/api/admin/teams?${params}`);
    const data = await res.json();
    setTeams(data.data || []);
    setTotal(data.meta?.total || 0);
    setLoading(false);
  };

  const handleViewTeam = (id: string) => {
    router.push(`/admin/teams/${id}`);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              Teams
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Monitor team activity and diagnostics
            </p>
          </div>
          <input
            type="text"
            placeholder="Search by team name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              width: 250,
              background: "#131F38",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "white",
            }}
          />
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading teams...
          </div>
        ) : (
          <>
            <div
              style={{
                background: "#131F38",
                borderRadius: 12,
                overflow: "auto",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 600,
                }}
              >
                <thead
                  style={{
                    background: "#0D1628",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <tr>
                    {[
                      "Team",
                      "Owner",
                      "Members",
                      "Risk Score",
                      "Created",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "16px",
                          textAlign: ["Members", "Risk Score", ""].includes(h)
                            ? "center"
                            : "left",
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 32,
                          textAlign: "center",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        No teams found
                      </td>
                    </tr>
                  ) : (
                    teams.map((team) => {
                      const riskScore = team.team_reports?.[0]?.risk_score || 0;
                      const riskColor =
                        riskScore > 70
                          ? "#EF4444"
                          : riskScore > 40
                            ? "#F4C842"
                            : "#10B981";
                      const riskBg =
                        riskScore > 70
                          ? "rgba(239,68,68,0.15)"
                          : riskScore > 40
                            ? "rgba(244,200,66,0.15)"
                            : "rgba(16,185,129,0.15)";
                      return (
                        <tr
                          key={team.id}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <td style={{ padding: "16px" }}>
                            <div style={{ fontWeight: 500, color: "white" }}>
                              {team.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {team.organization || "No organization"}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "16px",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            {team.owner?.full_name || team.owner?.email || "—"}
                          </td>
                          <td
                            style={{
                              padding: "16px",
                              textAlign: "center",
                              color: "white",
                            }}
                          >
                            {team.team_reports?.[0]?.member_count || 0}
                          </td>
                          <td style={{ padding: "16px", textAlign: "center" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 600,
                                background: riskBg,
                                color: riskColor,
                              }}
                            >
                              {team.team_reports?.[0]?.risk_score ?? "—"}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "16px",
                              color: "rgba(255,255,255,0.5)",
                              fontSize: 13,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {new Date(team.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "16px", textAlign: "center" }}>
                            <button
                              onClick={() => handleViewTeam(team.id)}
                              style={{
                                padding: "6px 12px",
                                background: "#6C3FC5",
                                border: "none",
                                borderRadius: 6,
                                color: "white",
                                cursor: "pointer",
                                fontSize: 12,
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 24,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 12px",
                    background: "#131F38",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "white",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: "8px 12px", color: "white" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 12px",
                    background: "#131F38",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "white",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

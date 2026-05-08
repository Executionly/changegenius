// app/teams/teams-im-in/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface Team {
  id: string;
  name: string;
  organization: string | null;
  memberCount: number;
  completedCount: number;
  isOwner: boolean;
}

export default function TeamsImInPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/auth");
      return;
    }
    if (user) {
      fetchTeams();
    }
  }, [user, authLoading]);

  async function fetchTeams() {
    try {
      const res = await fetch("/api/teams/list");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      // Only show teams where user is NOT the owner (member only)
      const memberOnlyTeams = data.memberOf || [];
      setTeams(memberOnlyTeams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function goToTeam(teamId: string) {
    router.push(`/teams/${teamId}`);
  }

  function startAssessment(teamId: string) {
    router.push(`/assessment/take?teamId=${teamId}`);
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout title="Teams I'm In">
        <div style={{ textAlign: "center", padding: 48 }}>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teams I'm In">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Teams I'm In</h2>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Teams where you are a member (not the owner)
            </p>
          </div>
        </div>
        <div className="card-body">
          {teams.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
              <p>You haven't joined any teams yet.</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
                Ask a team owner to share an invite link with you.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "var(--surface)" }}>
                  <tr>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Team Name
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Organization
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Members
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Completed
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr
                      key={team.id}
                      style={{
                        borderTop: "1px solid var(--border)",
                        cursor: "pointer",
                      }}
                      onClick={() => goToTeam(team.id)}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                        {team.name}
                      </td>
                      <td
                        style={{ padding: "12px 16px", color: "var(--muted)" }}
                      >
                        {team.organization || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        {team.memberCount}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          className={`badge ${team.completedCount > 0 ? "badge-green" : "badge-gray"}`}
                        >
                          {team.completedCount}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startAssessment(team.id);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: 12 }}
                        >
                          Take Assessment →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-body">
          <div
            style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}
          >
            💡 Team assessments are separate from your individual assessment.
            Each team assessment costs $27 per person, one-time.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

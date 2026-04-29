"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  name: string;
  organization: string | null;
  totalMembers: number;
  completedCount: number;
  unlocked: boolean;
  fullUnlocked: boolean;
}

export default function TeamsListPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadTeams() {
      try {
        const res = await fetch("/api/teams/list");
        const data = await res.json();
        const owned = data.owned ?? [];
        const simplified = owned.map((item: any) => {
          const teamBase = item.team || item;
          return {
            id: teamBase.id,
            name: teamBase.name,
            organization: teamBase.organization,
            totalMembers: item.totalMembers ?? teamBase.totalMembers ?? 0,
            completedCount: item.completedCount ?? teamBase.completedCount ?? 0,
            unlocked: item.unlocked ?? teamBase.unlocked ?? false,
            fullUnlocked: item.fullUnlocked ?? teamBase.fullUnlocked ?? false,
          };
        });
        setTeams(simplified);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTeams(false);
      }
    }
    loadTeams();
  }, [isAuthenticated]);

  const handleCreateTeam = () => {
    router.push("/teams/create");
  };

  if (loading || loadingTeams) {
    return <DashboardLayout title="Teams">Loading...</DashboardLayout>;
  }

  if (teams.length === 0) {
    return (
      <DashboardLayout title="Teams">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h3>No teams yet</h3>
          <p>
            Create your first team to invite colleagues and build your Team
            Change Map™.
          </p>
          <button
            onClick={handleCreateTeam}
            className="btn btn-primary"
            style={{ marginTop: 24 }}
          >
            Create Team →
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teams">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {teams.map((team) => (
          <div
            key={team.id}
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/teams/${team.id}`)}
          >
            <div className="card-header">
              <div className="card-title">{team.name}</div>
              {team.organization && (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {team.organization}
                </div>
              )}
            </div>
            <div className="card-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span>Members</span>
                <span className="badge badge-gray">
                  {team.completedCount}/{team.totalMembers} completed
                </span>
              </div>
              <div
                className={`badge ${team.fullUnlocked ? "badge-green" : team.unlocked ? "badge-blue" : "badge-gray"}`}
              >
                {team.fullUnlocked
                  ? "Full Report Unlocked"
                  : team.unlocked
                    ? "Basic Insights"
                    : "Locked"}
              </div>
            </div>
          </div>
        ))}
        <div
          className="card"
          style={{ cursor: "pointer", borderColor: "var(--brand)" }}
          onClick={handleCreateTeam}
        >
          <div className="card-header">
            <div className="card-title">+ Create New Team</div>
          </div>
          <div
            className="card-body"
            style={{ textAlign: "center", color: "var(--brand)" }}
          >
            Start a new team
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

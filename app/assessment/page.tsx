"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface AssessmentEntry {
  id: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  isTeam: boolean;
  team: { id: string; name: string } | null;
}

export default function AssessmentRoute() {
  const { profile, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [inProgress, setInProgress] = useState<AssessmentEntry[]>([]);
  const [completed, setCompleted] = useState<AssessmentEntry[]>([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [teamNotStarted, setTeamNotStarted] = useState<{ teamId: string; teamName: string }[]>([]);


  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/assessment/status")
      .then((res) => res.json())
      .then((data) => {
        setInProgress(data.inProgress ?? []);
        setCompleted(data.completed ?? []);
        setTeamNotStarted(data.teamNotStarted ?? []);
      })
      .catch(() => {})
      .finally(() => setStatusLoading(false));
  }, [isAuthenticated]);

  if (loading || statusLoading) {
    return <DashboardLayout title="Assessment">Loading...</DashboardLayout>;
  }

  const hasPaid = profile?.has_paid ?? false;

  // Separate personal vs team in-progress
  const personalInProgress = inProgress.find((a) => !a.isTeam) ?? null;
  const teamInProgress     = inProgress.filter((a) => a.isTeam);
  const teamCompleted      = completed.filter((a) => a.isTeam);
  const personalCompleted  = completed.find((a) => !a.isTeam) ?? null;

  return (
    <DashboardLayout title="Assessment">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Personal Assessment ── */}
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3>Change Genius™ Assessment</h3>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>
            72 questions · 8–10 minutes
          </p>

          {!hasPaid ? (
            <>
              <p>A one‑time payment of $24 unlocks your personal assessment.</p>
              <button
                onClick={() => router.push("/payment?plan=individual")}
                className="btn btn-primary"
                style={{ marginTop: 24 }}
              >
                Unlock Assessment →
              </button>
            </>
          ) : personalCompleted ? (
            <>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Completed{" "}
                {new Date(personalCompleted.completedAt!).toLocaleDateString()}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
                <button
                  onClick={() => router.push("/results")}
                  className="btn btn-primary"
                >
                  View Results →
                </button>
                <button
                  onClick={() => router.push("/assessment/take?fresh=true")}
                  className="btn btn-secondary"
                >
                  Retake Assessment
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() =>
                router.push(
                  personalInProgress
                    ? "/assessment/take?resume=true"
                    : "/assessment/take",
                )
              }
              className="btn btn-primary"
              style={{ marginTop: 24 }}
            >
              {personalInProgress ? "Resume Assessment →" : "Begin Assessment →"}
            </button>
          )}
        </div>

        {/* ── Team Assessments ── */}
        {(teamInProgress.length > 0 || teamCompleted.length > 0 || teamNotStarted.length > 0) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h4 style={{ margin: 0 }}>Team Assessments</h4>

            {/* Not started */}
            {teamNotStarted.map((t) => (
              <div
                key={t.teamId}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>{t.teamName}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
                    Not started · Team assessment pending
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/assessment/take?teamId=${t.teamId}`)}
                  className="btn btn-primary"
                >
                  Begin →
                </button>
              </div>
            ))}

            {teamInProgress.map((a) => (
              <div
                key={a.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>{a.team?.name}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
                    In progress · Started {new Date(a.startedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      `/assessment/take?resume=true&teamId=${a.team?.id}`,
                    )
                  }
                  className="btn btn-primary"
                >
                  Resume →
                </button>
              </div>
            ))}

            {teamCompleted.map((a) => (
              <div
                key={a.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>{a.team?.name}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
                    Completed · {new Date(a.completedAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

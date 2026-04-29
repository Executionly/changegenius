"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AssessmentRoute() {
  const { profile, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hasInProgress, setHasInProgress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !profile?.has_paid) return;
    fetch("/api/assessment/status")
      .then((res) => res.json())
      .then((data) => setHasInProgress(data.hasInProgress))
      .catch(() => setHasInProgress(false));
  }, [isAuthenticated, profile?.has_paid]);

  if (loading) {
    return <DashboardLayout title="Assessment">Loading...</DashboardLayout>;
  }

  const hasPaid = profile?.has_paid ?? false;

  if (!hasPaid) {
    return (
      <DashboardLayout title="Assessment">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h3>Assessment locked</h3>
          <p>A one‑time payment of $24 unlocks your assessment.</p>
          <button
            onClick={() => router.push("/payment?plan=individual")}
            className="btn btn-primary"
            style={{ marginTop: 24 }}
          >
            Unlock Assessment →
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Assessment">
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h3>Change Genius™ Assessment</h3>
        <p>72 questions · 8–10 minutes</p>
        <button
          onClick={() =>
            router.push(
              hasInProgress
                ? "/assessment/take?resume=true"
                : "/assessment/take",
            )
          }
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          {hasInProgress ? "Resume Assessment →" : "Begin Assessment →"}
        </button>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResultsPage from "@/components/dashboard/ResultsPage";

export default function ResultsRoute() {
  const { profile, loading, isAuthenticated } = useAuth();
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !profile?.has_paid) return;
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => {
        if (!("error" in data)) setResults(data);
        setLoadingResults(false);
      })
      .catch(() => setLoadingResults(false));
  }, [isAuthenticated, profile?.has_paid]);

  if (loading || loadingResults) {
    return <DashboardLayout title="Results">Loading...</DashboardLayout>;
  }

  const hasPaid = profile?.has_paid ?? false;
  const onboarded = profile?.onboarded ?? false;

  return (
    <DashboardLayout title="Last Report Overview">
      <ResultsPage hasPaid={hasPaid} onboarded={onboarded} results={results} />
    </DashboardLayout>
  );
}

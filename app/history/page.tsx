"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HistoryPage from "@/components/dashboard/HistoryPage";

export default function HistoryRoute() {
  const { loading } = useAuth();

  if (loading) {
    return <DashboardLayout title="History">Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout title="History">
      <HistoryPage />
    </DashboardLayout>
  );
}

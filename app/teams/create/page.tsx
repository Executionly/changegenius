"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BuildTeamPage from "@/components/dashboard/BuildTeamPage";

export default function CreateTeamRoute() {
  const { loading } = useAuth();

  if (loading) {
    return <DashboardLayout title="Create Team">Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout title="Create Team">
      <BuildTeamPage />
    </DashboardLayout>
  );
}

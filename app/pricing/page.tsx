"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PricingPage from "@/components/dashboard/PricingPage";

export default function PricingRoute() {
  const { loading } = useAuth();

  if (loading) {
    return <DashboardLayout title="Pricing">Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout title="Pricing">
      <PricingPage />
    </DashboardLayout>
  );
}

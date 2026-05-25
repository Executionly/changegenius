"use client";

import { useState, useEffect } from "react";
import AdminLayout, { authFetch } from "./components/AdminLayout";
import Link from "next/link";

interface OverviewStats {
  users: {
    total: number;
    paid: number;
    unpaid: number;
    thisWeek: number;
    lastWeek: number;
  };
  teams: { total: number; withNoCompletion: number };
  assessments: { total: number; thisWeek: number };
  payments: { failed: number; revenueByCurrency: Record<string, number> };
}

export default function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/overview")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ color: "white", textAlign: "center", padding: 48 }}>
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div style={{ color: "white", textAlign: "center", padding: 48 }}>
          Failed to load dashboard data. Please refresh the page.
        </div>
      </AdminLayout>
    );
  }

  const totalUsers = stats.users?.total ?? 0;
  const paidUsers = stats.users?.paid ?? 0;
  const thisWeekUsers = stats.users?.thisWeek ?? 0;
  const lastWeekUsers = stats.users?.lastWeek ?? 0;
  const totalTeams = stats.teams?.total ?? 0;
  const teamsWithNoCompletion = stats.teams?.withNoCompletion ?? 0;
  const totalAssessments = stats.assessments?.total ?? 0;
  const assessmentsThisWeek = stats.assessments?.thisWeek ?? 0;
  const failedPayments = stats.payments?.failed ?? 0;
  const revenueByCurrency = stats.payments?.revenueByCurrency ?? {};

  let userGrowth = 0;
  let userGrowthColor = "#10B981";
  if (lastWeekUsers > 0) {
    userGrowth = Number(
      (((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100).toFixed(0),
    );
    userGrowthColor = userGrowth < 0 ? "#EF4444" : "#10B981";
  }

  const conversionRate =
    totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";

  return (
    <AdminLayout>
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "white",
            marginBottom: 8,
          }}
        >
          Overview
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>
          Real-time platform intelligence
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Total Users
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>
              {totalUsers.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: userGrowthColor, marginTop: 8 }}>
              {userGrowth > 0 ? `+${userGrowth}%` : `${userGrowth}%`} from last
              week
            </div>
          </div>

          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Paid Users
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#F4C842" }}>
              {paidUsers.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                marginTop: 8,
              }}
            >
              {conversionRate}% conversion
            </div>
          </div>

          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Teams Created
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>
              {totalTeams.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                marginTop: 8,
              }}
            >
              {teamsWithNoCompletion} teams with 0 completions
            </div>
          </div>

          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Completed Assessments
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>
              {totalAssessments.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "#10B981", marginTop: 8 }}>
              +{assessmentsThisWeek} this week
            </div>
          </div>
        </div>

        {/* Revenue Section */}
        <div
          style={{
            background: "#131F38",
            borderRadius: 12,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "white",
              marginBottom: 20,
            }}
          >
            Revenue
          </h2>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {Object.entries(revenueByCurrency).length > 0 ? (
              Object.entries(revenueByCurrency).map(([currency, amount]) => (
                <div key={currency}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    {currency}
                  </div>
                  <div
                    style={{ fontSize: 28, fontWeight: 700, color: "#F4C842" }}
                  >
                    {currency === "NGN"
                      ? `₦${(amount / 100).toLocaleString()}`
                      : `$${(amount / 100).toLocaleString()}`}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "rgba(255,255,255,0.4)" }}>
                No revenue data
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Failed payments: {failedPayments}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
          }}
        >
          <QuickActionCard title="Recent Users" icon="👥" href="/admin/users" />
          <QuickActionCard
            title="Team Diagnostics"
            icon="🏢"
            href="/admin/teams"
          />
          <QuickActionCard
            title="Audit Logs"
            icon="📜"
            href="/admin/audit-logs"
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function QuickActionCard({
  title,
  icon,
  href,
}: {
  title: string;
  icon: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#131F38",
          borderRadius: 12,
          padding: 20,
          border: "1px solid rgba(255,255,255,0.07)",
          transition: "border-color 0.2s",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "white",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: "#6C3FC5" }}>View all →</div>
      </div>
    </Link>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { formatPrice, PRICING } from "@/lib/config/pricing";

export default function AssessmentSelectPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  useEffect(() => {
    if (!user) {
      router.push("/login?returnUrl=/assessment/take");
      return;
    }
  }, [loading, user, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--sage)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 40,
          maxWidth: 500,
          width: "90%",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          Take the Assessment
        </h2>
        <p style={{ marginBottom: 24 }}>Choose how you want to start:</p>
        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
          <button
            onClick={() => router.push("/payment?plan=individual")}
            style={{
              padding: 16,
              border: "2px solid var(--blue)",
              borderRadius: 16,
              background: "white",
              textAlign: "left",
            }}
          >
            <strong>For Individuals</strong>
            <br />
            <span style={{ fontSize: 14 }}>
              Discover your Change Genius role –{" "}
              {formatPrice(PRICING.INDIVIDUAL)} one-time
            </span>
          </button>
          <button
            onClick={() => router.push("/teams/create")}
            style={{
              padding: 16,
              border: "2px solid var(--blue)",
              borderRadius: 16,
              background: "white",
              textAlign: "left",
            }}
          >
            <strong>For Teams</strong>
            <br />
            <span style={{ fontSize: 14 }}>
              Build your Team Change Map™ –{" "}
              {formatPrice(PRICING.TEAM_PER_PERSON)} per person (min.{" "}
              {PRICING.TEAM_MIN_MEMBERS})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

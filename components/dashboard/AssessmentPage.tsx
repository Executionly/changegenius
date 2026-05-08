"use client";

import { formatPrice, PRICING } from "@/lib/config/pricing";
import Link from "next/link";

interface AssessmentPageProps {
  hasPaid: boolean;
  hasInProgress: boolean;
}

export default function AssessmentPage({
  hasPaid,
  hasInProgress,
}: AssessmentPageProps) {
  if (!hasPaid) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h3>Assessment locked</h3>
        <p>
          A one-time payment of {formatPrice(PRICING.INDIVIDUAL)} unlocks your
          assessment.
        </p>
        <Link
          href="/payment?plan=individual"
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Unlock Assessment →
        </Link>
      </div>
    );
  }

  if (hasInProgress) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <h3>Resume your assessment</h3>
        <p>You left off – continue where you stopped.</p>
        <Link
          href="/assessment/take"
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Resume Assessment →
        </Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "center", padding: 48 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h3>Change Genius™ Assessment</h3>
      <p>60 questions · 8–10 minutes</p>
      <Link
        href="/assessment/take"
        className="btn btn-primary"
        style={{ marginTop: 24 }}
      >
        Begin Assessment →
      </Link>
    </div>
  );
}

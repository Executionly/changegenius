"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AssessmentHistory {
  id: string;
  completed_at: string;
  derived: {
    primary_role: string;
    secondary_role: string;
    role_pair_title: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AssessmentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessment/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.assessments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div>Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h3>No past assessments found</h3>
        <Link
          href="/assessment"
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Take your first assessment →
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Assessment History</span>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Primary Role
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Secondary Role
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Pairing
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}></th>
            </tr>
          </thead>
          <tbody>
            {history.map((assessment) => (
              <tr key={assessment.id}>
                <td
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {new Date(assessment.completed_at).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border)",
                    fontWeight: 600,
                  }}
                >
                  {assessment.derived.primary_role}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {assessment.derived.secondary_role}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {assessment.derived.role_pair_title}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <Link
                    href={`/results/${assessment.id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    Download →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

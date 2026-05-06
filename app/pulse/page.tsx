"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
}

interface WeekData {
  week: number;
  dialogue: number;
  alignment: number;
  execution: number;
  momentum: number;
  respondents: number;
}

interface FeedItem {
  type: string;
  title: string;
  content: string;
  cta: string | null;
  tone: string;
  priority: number;
}

const CURRENT_WEEK = Math.ceil(
  (Date.now() - new Date("2024-01-01").getTime()) / (7 * 864e5),
);

export default function PulsePage() {
  const { isAuthenticated, loading: authLoading, profile } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Form state
  const [dialogue, setDialogue] = useState(0);
  const [alignment, setAlignment] = useState(0);
  const [execution, setExecution] = useState(0);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Fetch teams owned by user
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/teams/list")
      .then((r) => r.json())
      .then((data: { owned: Team[] }) => {
        const all = data.owned ?? [];
        setTeams(all);
        if (all.length > 0) setSelectedTeam(all[0].id);
        else setSelectedTeam(""); // no teams
      })
      .catch(console.error);
  }, [isAuthenticated]);

  // Fetch pulse data for selected team
  useEffect(() => {
    if (!selectedTeam) return;
    setLoadingData(true);
    fetch(`/api/pulse?teamId=${selectedTeam}`)
      .then((r) => r.json())
      .then(
        (d: {
          analytics?: WeekData[];
          feeds?: FeedItem[];
          latestPulse?: { week_number: number };
        }) => {
          setWeeks(d.analytics ?? []);
          setFeeds(d.feeds ?? []);
          setAlreadySubmitted(d.latestPulse?.week_number === CURRENT_WEEK);
          setLoadingData(false);
        },
      )
      .catch(() => setLoadingData(false));
  }, [selectedTeam]);

  async function submitPulse() {
    if (!selectedTeam || !dialogue || !alignment || !execution) return;
    setSubmitting(true);
    const res = await fetch("/api/pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: selectedTeam,
        weekNumber: CURRENT_WEEK,
        dialogueScore: dialogue,
        alignmentScore: alignment,
        executionScore: execution,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
      // Refresh data
      const updated = await fetch(`/api/pulse?teamId=${selectedTeam}`).then(
        (r) => r.json(),
      );
      setWeeks(updated.analytics ?? []);
      setFeeds(updated.feeds ?? []);
      setAlreadySubmitted(updated.latestPulse?.week_number === CURRENT_WEEK);
      setTimeout(() => setSubmitted(false), 3000);
    }
    setSubmitting(false);
  }

  const LABELS = ["Very Low", "Low", "Moderate", "High", "Very High"];
  const SCORE_COLORS = ["#dc2626", "#f97316", "#d97706", "#2563eb", "#16a34a"];

  function ScaleSelector({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
  }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          {label}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => onChange(v)}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 8,
                border: `2px solid ${value === v ? SCORE_COLORS[v - 1] : "var(--border)"}`,
                background: value === v ? `${SCORE_COLORS[v - 1]}18` : "white",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: value === v ? SCORE_COLORS[v - 1] : "var(--text-3)",
                }}
              >
                {v}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: value === v ? SCORE_COLORS[v - 1] : "var(--text-4)",
                }}
              >
                {LABELS[v - 1]}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <DashboardLayout title="Weekly Pulse">Loading...</DashboardLayout>;
  }

  // Individual user with no teams – show placeholder
  const hasTeams = teams.length > 0;

  return (
    <DashboardLayout title="Weekly Pulse">
      <div className="stats-row" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-label">Current Week</div>
          <div className="stat-value">{CURRENT_WEEK}</div>
          <div className="stat-sub">Submit your check-in</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Team Momentum</div>
          <div className="stat-value">
            {weeks.length > 0 ? weeks[weeks.length - 1]?.momentum || 0 : 0}%
          </div>
          <div className="stat-sub">Latest average</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Insights</div>
          <div className="stat-value">{feeds.length}</div>
          <div className="stat-sub">Actionable recommendations</div>
        </div>
      </div>

      {!hasTeams ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
          <h3>No teams yet</h3>
          <p>
            Create a team to start tracking weekly pulse data and receive
            actionable insights.
          </p>
          <Link
            href="/teams/create"
            className="btn btn-primary"
            style={{ marginTop: 24 }}
          >
            Create Team →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Submit pulse form */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Week {CURRENT_WEEK} Check‑in</span>
            </div>
            <div className="card-body">
              {teams.length > 1 && (
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Team
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => {
                      setSelectedTeam(e.target.value);
                      setSubmitted(false);
                      setDialogue(0);
                      setAlignment(0);
                      setExecution(0);
                    }}
                    style={{
                      width: "100%",
                      padding: 9,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {alreadySubmitted ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800 }}>
                    Already submitted
                  </h3>
                  <p style={{ color: "var(--text-3)" }}>
                    You've checked in for week {CURRENT_WEEK}.<br />
                    Come back next week to submit again.
                  </p>
                </div>
              ) : submitted ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800 }}>
                    Pulse submitted!
                  </h3>
                  <p>Thank you for checking in this week.</p>
                </div>
              ) : (
                <>
                  <ScaleSelector
                    value={dialogue}
                    onChange={setDialogue}
                    label="How open and honest is team dialogue right now?"
                  />
                  <ScaleSelector
                    value={alignment}
                    onChange={setAlignment}
                    label="How aligned is the team on goals and priorities?"
                  />
                  <ScaleSelector
                    value={execution}
                    onChange={setExecution}
                    label="How confident are you in the team's execution pace?"
                  />

                  <button
                    onClick={submitPulse}
                    disabled={
                      submitting || !dialogue || !alignment || !execution
                    }
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: 8 }}
                  >
                    {submitting ? "Submitting…" : "Submit Pulse →"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Feeds & Trend */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Actionable Leadership Insights</span>
            </div>
            <div className="card-body">
              {loadingData ? (
                <div>Loading insights...</div>
              ) : feeds.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 24,
                    color: "var(--muted)",
                  }}
                >
                  No insights yet. Submit your first pulse to unlock Actionable
                  recommendations.
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {feeds.map((feed, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 12,
                        background: "var(--surface)",
                        borderRadius: 8,
                        borderLeft: `4px solid ${feed.tone === "positive" ? "var(--green)" : feed.tone === "warning" ? "var(--amber)" : "var(--brand)"}`,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        {feed.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text-2)",
                          marginBottom: 8,
                        }}
                      >
                        {feed.content}
                      </div>
                      {feed.cta && (
                        <a
                          href="#"
                          style={{
                            fontSize: 12,
                            color: "var(--brand)",
                            textDecoration: "underline",
                          }}
                        >
                          {feed.cta}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {weeks.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontWeight: 600, marginBottom: 12 }}>
                    Momentum Trend
                  </div>
                  {weeks.slice(-6).map((w) => (
                    <div key={w.week} style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                        }}
                      >
                        <span>Week {w.week}</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              w.momentum >= 70
                                ? "#16a34a"
                                : w.momentum >= 45
                                  ? "#2563eb"
                                  : "#d97706",
                          }}
                        >
                          {w.momentum}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "var(--border)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${w.momentum}%`,
                            background:
                              w.momentum >= 70
                                ? "#16a34a"
                                : w.momentum >= 45
                                  ? "var(--brand)"
                                  : "#d97706",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

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
  id?: string
  team_id?: string
  week_number: number
  type: 'insight' | 'action' | 'warning' | 'coaching' | 'celebration' | 'trend' | 'leadership_insight'
  title: string
  content: string
  cta: string | null
  tone: 'positive' | 'neutral' | 'warning'
  metadata?: {
    priority?: number
    adaptsStageInFocus?: { stage: string; explanation: string }
    opportunityForGrowth?: string
    potentialRiskIfIgnored?: string
    sustainabilityOrScalingRecommendation?: string
  }
  created_at?: string
}

const TYPE_BADGE: Record<string, { background: string; color: string }> = {
  insight:     { background: '#E6F1FB', color: '#185FA5' },
  action:      { background: '#EEEDFE', color: '#534AB7' },
  warning:     { background: '#FAEEDA', color: '#854F0B' },
  coaching:    { background: '#E1F5EE', color: '#0F6E56' },
  celebration: { background: '#EAF3DE', color: '#3B6D11' },
  trend:       { background: '#F1EFE8', color: '#5F5E5A' },
}

const TONE_BORDER: Record<string, string> = {
  positive: '#639922',
  warning:  '#EF9F27',
  neutral:  '#888780',
}

const BrainIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
)

const PlayIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6,3 20,12 6,21"/>
  </svg>
)

function LeadershipInsightCard({ feed }: { feed: FeedItem }) {
  const m = feed.metadata as any

  return (
    <div style={{
      borderRadius: 12,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: '#3C3489',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
        }}>
          <BrainIcon size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>
            {feed.title}
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>
            Change Genius™ · ADAPTS™ Analysis
          </p>
        </div>

      </div>

      {/* Body */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Flavor summary */}
        <p style={{
          fontSize: 13,
          color: 'var(--text-2)',
          lineHeight: 1.65,
          margin: 0,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border)',
        }}>
          {feed.content}
        </p>

        {/* ADAPTS stage in focus */}
        {m?.adaptsStageInFocus && (
          <div>
            <p style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              margin: '0 0 8px',
            }}>
              ADAPTS™ stage requiring attention
            </p>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#534AB7',
              background: '#EEEDFE',
              borderRadius: 20,
              padding: '4px 12px',
            }}>
              {m.adaptsStageInFocus.stage}
            </span>
            <p style={{
              fontSize: 12,
              color: 'var(--text-2)',
              lineHeight: 1.6,
              margin: '8px 0 0',
            }}>
              {m.adaptsStageInFocus.explanation}
            </p>
          </div>
        )}

        {/* 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {m?.opportunityForGrowth && (
            <div style={{ background: 'var(--surface)', borderRadius: 8, padding: 12 }}>
              <p style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: '#3B6D11', margin: '0 0 6px',
              }}>
                Opportunity
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                {m.opportunityForGrowth}
              </p>
            </div>
          )}
          {m?.potentialRiskIfIgnored && (
            <div style={{ background: 'var(--surface)', borderRadius: 8, padding: 12 }}>
              <p style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: '#854F0B', margin: '0 0 6px',
              }}>
                Risk if ignored
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                {m.potentialRiskIfIgnored}
              </p>
            </div>
          )}
          {m?.sustainabilityOrScalingRecommendation && (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 8, padding: 12,
              gridColumn: '1 / -1',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: '#0F6E56', margin: '0 0 6px',
              }}>
                Sustainability recommendation
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                {m.sustainabilityOrScalingRecommendation}
              </p>
            </div>
          )}
        </div>

        {/* Recommended action */}
        {feed.cta && (
          <div style={{
            background: '#EEEDFE',
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: '#534AB7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              color: '#fff',
            }}>
              <PlayIcon size={11} />
            </div>
            <div>
              <p style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: '#534AB7', margin: '0 0 4px',
              }}>
                Recommended action this week
              </p>
              <p style={{ fontSize: 12, color: '#3C3489', lineHeight: 1.6, margin: 0 }}>
                {feed.cta}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function RegularFeedCard({ feed }: { feed: FeedItem }) {
  const accentColor = TONE_BORDER[feed.tone] ?? TONE_BORDER.neutral
  const badge = TYPE_BADGE[feed.type] ?? TYPE_BADGE.insight

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 8,
      borderTop: '1px solid var(--border)',
      borderRight: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      borderLeft: `3px solid ${accentColor}`,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '3px 9px',
          borderRadius: 20,
          background: badge.background,
          color: badge.color,
          flexShrink: 0,
        }}>
          {feed.type}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>
          {feed.title}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
        {feed.content}
      </p>
      {feed.cta && (
        <p style={{
          fontSize: 12,
          color: '#534AB7',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 2,
          textDecoration: 'none',
        }}>
          {feed.cta} 
        </p>
      )}
    </div>
  )
}

function PulseFeed({ feeds }: { feeds: FeedItem[] }) {
  const leadershipFeed = feeds.find(f => f.type === 'leadership_insight')
  const regularFeeds   = feeds.filter(f => f.type !== 'leadership_insight')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {leadershipFeed && (
        <>
          <p style={{
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-3)', margin: 0,
          }}>
            Weekly Intelligence
          </p>
          <LeadershipInsightCard feed={leadershipFeed} />
        </>
      )}

      {regularFeeds.length > 0 && (
        <>
          <p style={{
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-3)', margin: leadershipFeed ? '8px 0 0' : 0,
          }}>
            Team Feed
          </p>
          {regularFeeds.map((feed, i) => (
            <RegularFeedCard key={feed.id ?? i} feed={feed} />
          ))}
        </>
      )}

    </div>
  )
}

function getCurrentWeekDates() {
  const startDate = new Date("2024-01-01");

  // Current week number
  const currentWeek = Math.ceil(
    (Date.now() - startDate.getTime()) / (7 * 864e5)
  );

  // Start of current week
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (currentWeek - 1) * 7);

  // End of current week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const format = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return {
    week: currentWeek,
    start: weekStart,
    end: weekEnd,
    startFormatted: weekStart.toISOString().split("T")[0],
    endFormatted: weekEnd.toISOString().split("T")[0],
    fullFormatted: `${format(weekStart)} - ${format(weekEnd)}`,
  };
}

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

  const CURRENT_WEEK = getCurrentWeekDates()

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
          setAlreadySubmitted(d.latestPulse?.week_number === CURRENT_WEEK.week);
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
        weekNumber: CURRENT_WEEK.week,
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
      setAlreadySubmitted(updated.latestPulse?.week_number === CURRENT_WEEK.week);
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
          <div className="stat-value">{CURRENT_WEEK.fullFormatted}</div>
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
              <span className="card-title">Week {CURRENT_WEEK.fullFormatted} Check‑in</span>
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
                    You've checked in for week {CURRENT_WEEK.fullFormatted}.<br />
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
                <PulseFeed feeds={feeds}/>
                // <div
                //   style={{ display: "flex", flexDirection: "column", gap: 16 }}
                // >
                //   {feeds.map((feed, i) => (
                //     <div
                //       key={i}
                //       style={{
                //         padding: 12,
                //         background: "var(--surface)",
                //         borderRadius: 8,
                //         borderLeft: `4px solid ${feed.tone === "positive" ? "var(--green)" : feed.tone === "warning" ? "var(--amber)" : "var(--brand)"}`,
                //       }}
                //     >
                //       <div style={{ fontWeight: 700, marginBottom: 6 }}>
                //         {feed.title}
                //       </div>
                //       <div
                //         style={{
                //           fontSize: 13,
                //           color: "var(--text-2)",
                //           marginBottom: 8,
                //         }}
                //       >
                //         {feed.content}
                //       </div>
                //       {feed.cta && (
                //         <a
                //           href="#"
                //           style={{
                //             fontSize: 12,
                //             color: "var(--brand)",
                //             textDecoration: "underline",
                //           }}
                //         >
                //           {feed.cta}
                //         </a>
                //       )}
                //     </div>
                //   ))}
                // </div>
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
                        <span>Week: {CURRENT_WEEK.fullFormatted}</span>
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

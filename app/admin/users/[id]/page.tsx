"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout, { authFetch } from "../../components/AdminLayout";

interface UserDetail {
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    has_paid: boolean;
    onboarded: boolean;
    change_genius_role: string | null;
    change_genius_role_2: string | null;
    primary_energy: string | null;
    top_adapts_stages: string[];
    bottom_adapts_stages: string[];
    created_at: string;
  };
  assessment: {
    id: string;
    status: string;
    completed_at: string;
    scores: {
      role_scores: Record<string, number>;
      stage_scores: Record<string, number>;
      derived: { change_capacity_score: number };
    } | null;
  } | null;
  payments: Array<{
    id: string;
    amount_minor: number;
    currency: string;
    status: string;
    created_at: string;
  }>;
  memberships: Array<{ teams: { id: string; name: string }; status: string }>;
}

const card = {
  background: "#131F38",
  borderRadius: 12,
  padding: 24,
  border: "1px solid rgba(255,255,255,0.07)",
};

const label = {
  fontSize: 11,
  color: "rgba(255,255,255,0.45)",
  marginBottom: 4,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};
const value = { fontSize: 15, color: "white", fontWeight: 500 };

export default function AdminUserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadUser = async () => {
    const res = await authFetch(`/api/admin/users/${id}`);
    const data = await res.json();
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const updateUser = async (field: string, val: boolean | string) => {
    setUpdating(true);
    await authFetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ [field]: val }),
    });
    await loadUser();
    setUpdating(false);
  };

  const deleteUser = async () => {
    if (
      !confirm(
        `Permanently delete user "${user?.profile.email}"? This cannot be undone.`,
      )
    )
      return;
    await authFetch(`/api/admin/users/${id}`, { method: "DELETE" });
    router.push("/admin/users");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            padding: 48,
          }}
        >
          Loading user data...
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            padding: 48,
          }}
        >
          User not found
        </div>
      </AdminLayout>
    );
  }

  const capacityScore =
    user.assessment?.scores?.derived?.change_capacity_score ?? null;

  return (
    <AdminLayout>
      <div>
        <button
          onClick={() => router.back()}
          style={{
            marginBottom: 20,
            background: "none",
            border: "none",
            color: "#6C3FC5",
            cursor: "pointer",
            fontSize: 13,
            padding: 0,
          }}
        >
          ← Back to Users
        </button>

        {/* Title row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              {user.profile.full_name || "Unnamed User"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              {user.profile.email}
            </p>
          </div>
          <button
            onClick={deleteUser}
            style={{
              padding: "8px 16px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 6,
              color: "#EF4444",
              cursor: "pointer",
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            Delete User
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {/* Profile */}
          <div style={card}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                marginBottom: 20,
              }}
            >
              Profile
            </h2>
            {[
              ["Full Name", user.profile.full_name || "—"],
              ["Email", user.profile.email],
              [
                "Joined",
                new Date(user.profile.created_at).toLocaleDateString(),
              ],
              ["Primary Energy", user.profile.primary_energy || "—"],
            ].map(([l, v]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <div style={label}>{l}</div>
                <div style={value}>{v}</div>
              </div>
            ))}
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: updating ? "not-allowed" : "pointer",
                }}
              >
                <div
                  onClick={() =>
                    !updating && updateUser("has_paid", !user.profile.has_paid)
                  }
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: user.profile.has_paid
                      ? "#6C3FC5"
                      : "rgba(255,255,255,0.15)",
                    position: "relative",
                    transition: "background 0.2s",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: user.profile.has_paid ? 21 : 3,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "white",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                  {user.profile.has_paid ? "Paid ✓" : "Not paid"}
                </span>
              </label>
            </div>
          </div>

          {/* Assessment */}
          <div style={card}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                marginBottom: 20,
              }}
            >
              Assessment
            </h2>
            {user.assessment ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={label}>Status</div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        user.assessment.status === "completed"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(244,200,66,0.15)",
                      color:
                        user.assessment.status === "completed"
                          ? "#10B981"
                          : "#F4C842",
                    }}
                  >
                    {user.assessment.status}
                  </span>
                </div>
                {user.assessment.completed_at && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={label}>Completed</div>
                    <div style={value}>
                      {new Date(
                        user.assessment.completed_at,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: 14 }}>
                  <div style={label}>Change Capacity Score</div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#F4C842" }}
                  >
                    {capacityScore ?? "—"}
                    <span
                      style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}
                    >
                      /100
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={label}>Role(s)</div>
                  <div style={value}>
                    {[
                      user.profile.change_genius_role,
                      user.profile.change_genius_role_2,
                    ]
                      .filter(Boolean)
                      .join(" + ") || "Not taken"}
                  </div>
                </div>
                {user.profile.top_adapts_stages?.length > 0 && (
                  <div>
                    <div style={label}>Top Adapt Stages</div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginTop: 4,
                      }}
                    >
                      {user.profile.top_adapts_stages.map((s) => (
                        <span
                          key={s}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontSize: 10,
                            background: "rgba(108,63,197,0.2)",
                            color: "#9B7DE8",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                  padding: "24px 0",
                  fontSize: 13,
                }}
              >
                No assessment taken yet
              </div>
            )}
          </div>

          {/* Teams */}
          <div style={card}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                marginBottom: 20,
              }}
            >
              Team Memberships
            </h2>
            {user.memberships.length > 0 ? (
              user.memberships.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ fontWeight: 500, color: "white", fontSize: 13 }}
                  >
                    {m.teams.name}
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 10,
                      background:
                        m.status === "completed"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(244,200,66,0.15)",
                      color: m.status === "completed" ? "#10B981" : "#F4C842",
                    }}
                  >
                    {m.status}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                  padding: "24px 0",
                  fontSize: 13,
                }}
              >
                No team memberships
              </div>
            )}
          </div>

          {/* Payments */}
          <div style={card}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                marginBottom: 20,
              }}
            >
              Payments
            </h2>
            {user.payments.length > 0 ? (
              user.payments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    marginBottom: 10,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#F4C842",
                        fontSize: 14,
                      }}
                    >
                      {p.currency === "NGN"
                        ? `₦${(p.amount_minor / 100).toLocaleString()}`
                        : `$${(p.amount_minor / 100).toLocaleString()}`}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
                    >
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 10,
                      background:
                        p.status === "completed"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(239,68,68,0.15)",
                      color: p.status === "completed" ? "#10B981" : "#EF4444",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                  padding: "24px 0",
                  fontSize: 13,
                }}
              >
                No payments recorded
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

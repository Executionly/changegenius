"use client";

import { useState, useEffect } from "react";
import AdminLayout, { authFetch } from "../components/AdminLayout";

interface Payment {
  id: string;
  provider: string;
  plan: string;
  amount_minor: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  user: { email: string; full_name: string | null } | null;
  team: { id: string; name: string } | null;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (statusFilter !== "all") params.set("status", statusFilter);

    const res = await authFetch(`/api/admin/payments?${params}`);
    const data = await res.json();
    setPayments(data.data || []);
    setTotal(data.meta?.total || 0);
    setLoading(false);
  };

  const formatAmount = (minor: number, currency: string) => {
    const amount = minor / 100;
    if (currency === "NGN") return `₦${amount.toLocaleString()}`;
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "pending":
        return "#F4C842";
      case "failed":
        return "#EF4444";
      case "refunded":
        return "#6B7280";
      default:
        return "rgba(255,255,255,0.5)";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "rgba(16,185,129,0.15)";
      case "pending":
        return "rgba(244,200,66,0.15)";
      case "failed":
        return "rgba(239,68,68,0.15)";
      case "refunded":
        return "rgba(107,114,128,0.15)";
      default:
        return "rgba(255,255,255,0.1)";
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              Payments
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Transaction history and revenue tracking
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              background: "#131F38",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "white",
            }}
          >
            <option value="all">All status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading payments...
          </div>
        ) : (
          <>
            <div
              style={{
                background: "#131F38",
                borderRadius: 12,
                overflow: "auto",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 600,
                }}
              >
                <thead
                  style={{
                    background: "#0D1628",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <tr>
                    {[
                      { label: "User / Team", align: "left" },
                      { label: "Plan", align: "left" },
                      { label: "Amount", align: "right" },
                      { label: "Status", align: "center" },
                      { label: "Date", align: "left" },
                    ].map(({ label, align }) => (
                      <th
                        key={label}
                        style={{
                          padding: "16px",
                          textAlign: align as "left" | "right" | "center",
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: 32,
                          textAlign: "center",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr
                        key={payment.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td style={{ padding: "16px" }}>
                          {payment.team ? (
                            <div>
                              <div style={{ fontWeight: 500, color: "white" }}>
                                {payment.team.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "rgba(255,255,255,0.4)",
                                }}
                              >
                                Team payment
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontWeight: 500, color: "white" }}>
                                {payment.user?.full_name || "—"}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "rgba(255,255,255,0.4)",
                                }}
                              >
                                {payment.user?.email}
                              </div>
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          {payment.plan === "individual"
                            ? "Individual"
                            : "Team"}
                          <div
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {payment.provider}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "right",
                            fontWeight: 600,
                            color: "#F4C842",
                          }}
                        >
                          {formatAmount(payment.amount_minor, payment.currency)}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                              background: getStatusBg(payment.status),
                              color: getStatusColor(payment.status),
                            }}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 13,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 24,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 12px",
                    background: "#131F38",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "white",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: "8px 12px", color: "white" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 12px",
                    background: "#131F38",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "white",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

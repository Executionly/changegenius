"use client";

import { useState, useEffect } from "react";
import AdminLayout, { authFetch } from "../components/AdminLayout";

interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await authFetch(`/api/admin/audit-logs?page=${page}`);
    const data = await res.json();
    setLogs(data.data || []);
    setTotal(data.meta?.total || 0);
    setLoading(false);
  };

  const totalPages = Math.ceil(total / 20);

  const getActionColor = (action: string) => {
    if (action.includes("delete")) return "#EF4444";
    if (action.includes("create")) return "#10B981";
    if (action.includes("update")) return "#F4C842";
    return "#6C3FC5";
  };

  return (
    <AdminLayout>
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "white",
            marginBottom: 4,
          }}
        >
          Audit Logs
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
          Track all admin actions across the platform
        </p>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading logs...
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
                  minWidth: 560,
                }}
              >
                <thead
                  style={{
                    background: "#0D1628",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <tr>
                    {["Admin", "Action", "Target", "IP", "Time"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: 32,
                          textAlign: "center",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        No logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "white",
                            fontSize: 13,
                          }}
                        >
                          {log.admin_email}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              color: getActionColor(log.action),
                              fontSize: 13,
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 12,
                          }}
                        >
                          {log.target_type
                            ? `${log.target_type}: ${log.target_id?.slice(0, 8) ?? ""}…`
                            : "—"}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 11,
                          }}
                        >
                          {log.ip_address || "—"}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 11,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(log.created_at).toLocaleString()}
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

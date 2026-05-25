"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout, { authFetch } from "../components/AdminLayout";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  has_paid: boolean;
  onboarded: boolean;
  change_genius_role: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filterPaid, setFilterPaid] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, [page, search, filterPaid]);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (search) params.set("search", search);
    if (filterPaid !== "all") params.set("has_paid", filterPaid);

    const res = await authFetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.data || []);
    setTotal(data.meta?.total || 0);
    setLoading(false);
  };

  const handleViewUser = (id: string) => {
    router.push(`/admin/users/${id}`);
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
              Users
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Manage and monitor user accounts
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <select
              value={filterPaid}
              onChange={(e) => setFilterPaid(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#131F38",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "white",
              }}
            >
              <option value="all">All users</option>
              <option value="true">Paid users</option>
              <option value="false">Unpaid users</option>
            </select>
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 12px",
                width: 250,
                background: "#131F38",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "white",
              }}
            />
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading users...
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
                    {["User", "Role", "Status", "Joined", ""].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "16px",
                          textAlign:
                            h === "Status" || h === "" ? "center" : "left",
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: 32,
                          textAlign: "center",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td style={{ padding: "16px" }}>
                          <div>
                            <div style={{ fontWeight: 500, color: "white" }}>
                              {user.full_name || "—"}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          {user.change_genius_role || "Not taken"}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                              background: user.has_paid
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(239,68,68,0.15)",
                              color: user.has_paid ? "#10B981" : "#EF4444",
                            }}
                          >
                            {user.has_paid ? "Paid" : "Unpaid"}
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
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <button
                            onClick={() => handleViewUser(user.id)}
                            style={{
                              padding: "6px 12px",
                              background: "#6C3FC5",
                              border: "none",
                              borderRadius: 6,
                              color: "white",
                              cursor: "pointer",
                              fontSize: 12,
                            }}
                          >
                            View
                          </button>
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

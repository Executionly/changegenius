"use client";

import { useState, useEffect } from "react";
import AdminLayout, { authFetch } from "../components/AdminLayout";

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_active: string | null;
  created_at: string;
}

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "support",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const res = await authFetch("/api/admin/admins");
    const data = await res.json();
    setAdmins(data.data || []);
    setLoading(false);
  };

  const createAdmin = async () => {
    const res = await authFetch("/api/admin/admins", {
      method: "POST",
      body: JSON.stringify(newAdmin),
    });
    if (res.ok) {
      setShowCreate(false);
      setNewAdmin({ email: "", password: "", fullName: "", role: "support" });
      fetchAdmins();
    } else {
      alert("Failed to create admin");
    }
  };

  const toggleAdminStatus = async (id: string, currentStatus: boolean) => {
    await authFetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !currentStatus }),
    });
    fetchAdmins();
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("Delete this admin?")) return;
    await authFetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    fetchAdmins();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "#F4C842";
      case "admin":
        return "#6C3FC5";
      case "support":
        return "#10B981";
      default:
        return "rgba(255,255,255,0.5)";
    }
  };

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
              Administrators
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Manage admin users and permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "10px 20px",
              background: "#6C3FC5",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
            }}
          >
            + Add Admin
          </button>
        </div>

        {showCreate && (
          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                marginBottom: 16,
              }}
            >
              Create New Admin
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              {[
                {
                  placeholder: "Email",
                  value: newAdmin.email,
                  onChange: (v: string) =>
                    setNewAdmin({ ...newAdmin, email: v }),
                  type: "email",
                },
                {
                  placeholder: "Full Name (optional)",
                  value: newAdmin.fullName,
                  onChange: (v: string) =>
                    setNewAdmin({ ...newAdmin, fullName: v }),
                  type: "text",
                },
                {
                  placeholder: "Password",
                  value: newAdmin.password,
                  onChange: (v: string) =>
                    setNewAdmin({ ...newAdmin, password: v }),
                  type: "password",
                },
              ].map(({ placeholder, value, onChange, type }) => (
                <input
                  key={placeholder}
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  style={{
                    padding: "10px",
                    background: "#0D1628",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "white",
                  }}
                />
              ))}
              <select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, role: e.target.value })
                }
                style={{
                  padding: "10px",
                  background: "#0D1628",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "white",
                }}
              >
                <option value="support">Support</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={createAdmin}
                style={{
                  padding: "8px 16px",
                  background: "#6C3FC5",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading admins...
          </div>
        ) : (
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
                  {["Admin", "Role", "Status", "Last Active", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "16px",
                        textAlign: ["Status", ""].includes(h)
                          ? "center"
                          : "left",
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
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: 500, color: "white" }}>
                        {admin.full_name || admin.email.split("@")[0]}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
                      >
                        {admin.email}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          color: getRoleColor(admin.role),
                          textTransform: "capitalize",
                        }}
                      >
                        {admin.role.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 12,
                          fontSize: 10,
                          background: admin.is_active
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(239,68,68,0.15)",
                          color: admin.is_active ? "#10B981" : "#EF4444",
                        }}
                      >
                        {admin.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 13,
                      }}
                    >
                      {admin.last_active
                        ? new Date(admin.last_active).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            toggleAdminStatus(admin.id, admin.is_active)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: admin.is_active ? "#EF4444" : "#10B981",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          {admin.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

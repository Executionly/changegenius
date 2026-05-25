"use client";

import { useState, useEffect } from "react";
import AdminLayout, { authFetch } from "../components/AdminLayout";

interface Question {
  id: string;
  text: string;
  role: string;
  stage: string;
  energy: string;
  reverse: boolean;
  order: number;
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    authFetch("/api/admin?type=questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredQuestions = questions.filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.role.toLowerCase().includes(search.toLowerCase()) ||
      q.stage.toLowerCase().includes(search.toLowerCase()),
  );

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
                fontSize: 26,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              Question Bank
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              Review assessment questions ({questions.length} total)
            </p>
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              width: 240,
              background: "#131F38",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "white",
              fontSize: 13,
            }}
          />
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading questions...
          </div>
        ) : (
          <div
            style={{
              background: "#131F38",
              borderRadius: 12,
              overflow: "auto",
              border: "1px solid rgba(255,255,255,0.07)",
              maxHeight: "calc(100vh - 220px)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 580,
              }}
            >
              <thead
                style={{
                  background: "#0D1628",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <tr>
                  {[
                    { label: "#", w: 48 },
                    { label: "Question", w: undefined },
                    { label: "Role", w: 90 },
                    { label: "Stage", w: 90 },
                    { label: "Energy", w: 80 },
                    { label: "Rev", w: 48 },
                  ].map(({ label, w }) => (
                    <th
                      key={label}
                      style={{
                        padding: "11px 14px",
                        textAlign: label === "Rev" ? "center" : "left",
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 11,
                        width: w,
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: 32,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 13,
                      }}
                    >
                      No questions found
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr
                      key={q.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td
                        style={{
                          padding: "11px 14px",
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 12,
                        }}
                      >
                        {q.order}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 13,
                          lineHeight: 1.4,
                        }}
                      >
                        {q.text}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          color: "#F4C842",
                          fontSize: 12,
                        }}
                      >
                        {q.role}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          color: "#9B7DE8",
                          fontSize: 12,
                        }}
                      >
                        {q.stage}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          color: "#10B981",
                          fontSize: 12,
                        }}
                      >
                        {q.energy}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          textAlign: "center",
                          color: q.reverse
                            ? "#EF4444"
                            : "rgba(255,255,255,0.25)",
                          fontSize: 12,
                        }}
                      >
                        {q.reverse ? "✓" : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

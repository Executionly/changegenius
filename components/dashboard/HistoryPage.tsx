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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/assessment/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.assessments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownloadPDF = async (assessmentId: string) => {
    setDownloadingId(assessmentId);
    try {
      const res = await fetch(`/api/pdf/individual?aid=${assessmentId}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `change-genius-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 13, color: "#64748b" }}>Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          No past assessments found
        </h3>
        <Link
          href="/assessment"
          className="btn btn-primary"
          style={{ marginTop: 20, display: "inline-block" }}
        >
          Take your first assessment →
        </Link>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <span className="history-title">Assessment History</span>
      </div>
      <div className="history-list">
        {history.map((assessment) => (
          <div key={assessment.id} className="history-item">
            <div className="history-info">
              <div className="history-date">
                {new Date(assessment.completed_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="history-roles">
                <span className="history-primary">
                  {assessment.derived.primary_role}
                </span>
                <span className="history-secondary">
                  + {assessment.derived.secondary_role}
                </span>
              </div>
              <div className="history-pairing">
                {assessment.derived.role_pair_title}
              </div>
            </div>
            <button
              onClick={() => handleDownloadPDF(assessment.id)}
              disabled={downloadingId === assessment.id}
              className="history-download-btn"
            >
              {downloadingId === assessment.id ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .history-container {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        .history-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        .history-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }
        .history-list {
          display: flex;
          flex-direction: column;
        }
        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }
        .history-item:hover {
          background: #f8fafc;
        }
        .history-info {
          flex: 1;
        }
        .history-date {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .history-roles {
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 2px;
        }
        .history-primary {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }
        .history-secondary {
          font-size: 12px;
          color: #64748b;
        }
        .history-pairing {
          font-size: 11px;
          color: #94a3b8;
        }
        .history-download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .history-download-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #1e293b;
        }
        .history-download-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid #e2e8f0;
          border-top-color: #0101ee;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .history-item {
            flex-direction: row;
            align-items: flex-start;
            gap: 10px;
          }
          .history-download-btn {
            align-self: flex-start;
          }
          .history-primary {
            font-size: 13px;
          }
          .history-secondary {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

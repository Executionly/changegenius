
"use client";

import { useState } from "react";

export function DownloadPDFButton() {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pdf/individual", { credentials: "include" });

      if (!res.ok) {
        console.error("PDF route error:", res.status);
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/pdf")) {
        console.error("Expected PDF, got:", contentType);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "change-genius-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={loading}
      style={{
        background: "white",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        padding: "28px 24px",
        textDecoration: "none",
        display: "block",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>📄</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--navy)",
          marginBottom: 6,
        }}
      >
        {loading ? "Generating PDF…" : "Download PDF"}
      </div>
      <div
        style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.5 }}
      >
        Download your full individual report as a professional PDF.
      </div>
      
    </button>
  );
}
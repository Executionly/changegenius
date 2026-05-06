
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

      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "change-genius-report.pdf";
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      if (contentType.includes("text/html")) {
        const html = await res.text();

        const { default: html2canvas } = await import("html2canvas");
        const { default: jsPDF } = await import("jspdf");

        const iframe = document.createElement("iframe");
        iframe.style.cssText = "position:fixed;top:0;left:0;width:794px;height:1123px;opacity:0;pointer-events:none;border:none;";
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument!;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        await new Promise(resolve => setTimeout(resolve, 2500));

        const pageEls = iframeDoc.querySelectorAll<HTMLElement>(".page");
        console.log("Found pages:", pageEls.length)

        const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < pageEls.length; i++) {
          const el = pageEls[i];

          iframe.style.width = el.scrollWidth + "px";
          iframe.style.height = el.scrollHeight + "px";

          const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            width: el.scrollWidth,
            height: el.scrollHeight,
            windowWidth: el.scrollWidth,
            windowHeight: el.scrollHeight,
            backgroundColor: "#ffffff",
          });

          const imgData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight > pdfHeight ? pdfHeight : imgHeight);
        }

        document.body.removeChild(iframe);
        pdf.save("change-genius-report.pdf");
      }
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
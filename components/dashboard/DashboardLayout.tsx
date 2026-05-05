"use client";

import { useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Match current path to sidebar item id
  const getActivePage = (): string => {
    if (pathname === "/results") return "results";
    if (pathname === "/assessment") return "assessment";
    if (pathname === "/assessment/take") return "assessment";
    if (pathname === "/teams") return "teams";
    if (pathname === "/teams/create") return "build";
    if (pathname?.startsWith("/teams/")) return "teams"; // any team detail page
    if (pathname === "/pulse") return "pulse";
    if (pathname === "/history") return "history";
    if (pathname === "/pricing") return "pricing";
    return "results";
  };

  const activePage = getActivePage();

  const handleNavigate = (pageId: string, href?: string) => {
    if (href) router.push(href);
    else router.push(`/${pageId}`);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard");
  };

  const handleDownloadPDF = async () => {
    if (pathname !== "/results") return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/pdf/individual");

      if (!res.ok) {
        const text = await res.text();
        console.error("PDF route error:", res.status, text);
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/pdf")) {
        const text = await res.text();
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
      setPdfLoading(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const sidebarClasses = `sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`;

  return (
    <div className="dashboard-app">
      <div
        className={`overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={sidebarClasses}>
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          userName={profile?.full_name}
          userEmail={user?.email}
          userRole={profile?.change_genius_role}
          onSignOut={handleSignOut}
        />
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <button className="toggle-btn" onClick={toggleSidebar}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M1 3h12M1 7h12M1 11h12" />
              </svg>
            </button>
            <span className="breadcrumb">Dashboard /</span>
            <span className="page-title">{title}</span>
          </div>
          <div className="topbar-right">
            <button className="btn btn-ghost" onClick={handleShare}>
              Share
            </button>
            {pathname === "/results" && (
              <button className="btn btn-primary" onClick={handleDownloadPDF}>
                Download Individual PDF
              </button>
            )}
          </div>
        </div>
        <div className="content">
          {children}
          {pdfLoading && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                background: "var(--card-bg, #1a1a1a)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20, padding: "48px 52px",
                textAlign: "center", maxWidth: 340,
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              }}>
                {/* Animated ring */}
                <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 24px" }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ animation: "spin 1.2s linear infinite" }}>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#12A74C" strokeWidth="4"
                      strokeDasharray="40 124" strokeLinecap="round" />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>📄</div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: "var(--text, #fff)" }}>
                  Generating your report
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary, #9ca3af)", lineHeight: 1.6 }}>
                  Building your personalised Change Genius™ PDF.<br />
                  This usually takes 10–20 seconds.
                </div>

                {/* Progress dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#12A74C",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>

              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse {
                  0%, 100% { opacity: 0.2; transform: scale(0.8); }
                  50% { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

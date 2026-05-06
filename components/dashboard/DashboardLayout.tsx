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

  const getActivePage = (): string => {
    if (pathname === "/results") return "results";
    if (pathname === "/assessment") return "assessment";
    if (pathname === "/assessment/take") return "assessment";
    if (pathname === "/teams") return "teams";
    if (pathname === "/teams/create") return "build";
    if (pathname?.startsWith("/teams/")) return "teams";
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
    <>
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
                  Download PDF
                </button>
              )}
            </div>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>

      {pdfLoading && (
        <div className="pdf-overlay">
          <div className="pdf-modal">
            <div className="pdf-spinner">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                style={{ animation: "spin 1.2s linear infinite" }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#12A74C"
                  strokeWidth="4"
                  strokeDasharray="40 124"
                  strokeLinecap="round"
                />
              </svg>
              <div className="pdf-icon">📄</div>
            </div>
            <div className="pdf-title">Generating your report</div>
            <div className="pdf-desc">
              Building your personalised Change Genius™ PDF.
              <br />
              This usually takes 10–20 seconds.
            </div>
            <div className="pdf-dots">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="pdf-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-app {
          display: flex;
          height: 100vh;
          overflow: hidden;
          font-family: "Manrope", system-ui, sans-serif;
          background: #f1f5f9;
        }

        /* Sidebar styles */
        .sidebar {
          width: 220px;
          min-width: 220px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition:
            width 0.22s ease,
            min-width 0.22s ease;
          overflow: hidden;
          z-index: 30;
          flex-shrink: 0;
        }
        .sidebar.collapsed {
          width: 0;
          min-width: 0;
          border-right: none;
        }

        /* Main content */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        /* Topbar */
        .topbar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 20px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle-btn {
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }
        .breadcrumb {
          font-size: 12px;
          color: #64748b;
        }
        .page-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: inherit;
          white-space: nowrap;
        }
        .btn-primary {
          background: #0101ee;
          color: white;
        }
        .btn-ghost {
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        /* Content area - scrollable */
        .content {
          flex: 1;
          overflow-y: auto;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Overlay for mobile */
        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 25;
        }
        .overlay.show {
          display: block;
        }

        /* PDF Loading Modal */
        .pdf-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdf-modal {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 48px 52px;
          text-align: center;
          max-width: 340px;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
        }
        .pdf-spinner {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
        }
        .pdf-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        .pdf-title {
          font-weight: 700;
          font-size: 17px;
          margin-bottom: 8px;
          color: #fff;
        }
        .pdf-desc {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.6;
        }
        .pdf-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
        }
        .pdf-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #12a74c;
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ========== MOBILE RESPONSIVE ========== */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
            width: 220px !important;
            transition: transform 0.22s ease;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .topbar {
            padding: 0 12px;
            height: 48px;
          }
          .breadcrumb {
            font-size: 11px;
          }
          .page-title {
            font-size: 12px;
          }
          .btn {
            padding: 5px 10px;
            font-size: 11px;
          }
          .content {
            padding: 12px;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .topbar-right {
            gap: 6px;
          }
          .btn {
            padding: 4px 8px;
            font-size: 10px;
          }
          .content {
            padding: 10px;
          }
          .pdf-modal {
            padding: 32px 24px;
            margin: 16px;
            max-width: 300px;
          }
        }
      `}</style>
    </>
  );
}

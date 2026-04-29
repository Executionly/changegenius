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

  const handleDownloadPDF = () => {
    if (pathname === "/results") {
      window.open("/api/pdf/individual", "_blank");
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
                Download PDF
              </button>
            )}
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

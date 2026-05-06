"use client";

import Link from "next/link";

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string, href?: string) => void;
  userName?: string | null;
  userEmail?: string;
  userRole?: string | null;
  onSignOut: () => void;
  collapsed?: boolean;
}

// Icons (same as before)
const IconAssessment = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="12" height="12" rx="2" />
    <path d="M5 8h6M5 5h6M5 11h3" />
  </svg>
);
const IconResults = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 12V9M6 12V6M9 12V8M12 12V4" />
  </svg>
);
const IconTeams = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="5" r="2.5" />
    <circle cx="11" cy="6" r="2" />
    <path d="M1 13c0-2 2-3 5-3s5 1 5 3M11 9c2 0 3.5.8 3.5 2.5" />
  </svg>
);
const IconBuild = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v12M2 8h12" />
  </svg>
);
const IconHistory = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3.5l2 2" />
  </svg>
);
const IconPricing = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 4h12v8H2zM6 4V2M10 4V2" />
  </svg>
);
const IconPulse = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 8h2l2-4 2 8 2-6 2 4h2" />
  </svg>
);
export default function Sidebar({
  activePage,
  onNavigate,
  userName,
  userEmail,
  userRole,
  onSignOut,
}: SidebarProps) {
  const navItems = [
    {
      id: "assessment",
      label: "Take Assessment",
      icon: IconAssessment,
      href: "/assessment",
    },
    {
      id: "results",
      label: "Last Report Overview",
      icon: IconResults,
      href: "/results",
    },
    { id: "teams", label: "View Teams", icon: IconTeams, href: "/teams" },
    {
      id: "build",
      label: "Build Team",
      icon: IconBuild,
      href: "/teams/create",
    },
    { id: "pulse", label: "Weekly Pulse", icon: IconPulse, href: "/pulse" },
    { id: "history", label: "History", icon: IconHistory, href: "/history" },
    { id: "pricing", label: "Pricing", icon: IconPricing, href: "/pricing" },
  ];

  const handleClick = (item: any) => {
    onNavigate(item.id, item.href);
  };

  const displayName = userName || userEmail?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="brand">
        <div className="brand-name">
          <Link href="/" style={{ textDecoration: "none", color: "blue" }}>
            Change Genius
          </Link>
        </div>
        <div className="brand-sub">Assessment Platform</div>
      </div>
      <div className="nav">
        <div className="nav-section">Workspace</div>
        {navItems.map((item) => (
          // Inside Sidebar component, when mapping navItems
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className="nav-icon">{item.icon()}</span>
            {item.label}
          </div>
        ))}
        <div className="nav-divider"></div>
        <div className="nav-section">Account</div>
        <div className="nav-item" onClick={onSignOut}>
          <span className="nav-icon">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 5L12 8L10 11M6 8H12M6 13H3V3H6" />
            </svg>
          </span>
          Sign Out
        </div>
      </div>
      <div className="nav-bottom">
        <div className="user-row">
          <div className="avatar">{initial}</div>
          <div>
            <div className="user-name">{displayName}</div>
            <div className="user-role">{userRole || "Change Leader"}</div>
          </div>
        </div>
      </div>
    </>
  );
}

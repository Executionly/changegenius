"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
const IconUserGroup = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12c0-2 2-3 4-3s4 1 4 3M9 9c1.5 0 3 1 3 3M5 5a2 2 0 100-4 2 2 0 000 4zM11 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

interface Team {
  id: string;
  name: string;
  isOwner: boolean;
}

export default function Sidebar({
  activePage,
  onNavigate,
  userName,
  userEmail,
  userRole,
  onSignOut,
}: SidebarProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  // Fetch user's teams
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams/list");
        if (res.ok) {
          const data = await res.json();
          const allTeams = [
            ...(data.owned || []).map((t: any) => ({ ...t, isOwner: true })),
            ...(data.memberOf || []).map((t: any) => ({
              ...t,
              isOwner: false,
            })),
          ];
          setTeams(allTeams);
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setTeamsLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const ownedTeams = teams.filter((t) => t.isOwner);
  const memberTeams = teams.filter((t) => !t.isOwner);

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

      {/* Scrollable nav container */}
      <div className="nav-scrollable">
        <div className="nav">
          <div className="nav-section">Workspace</div>
          {navItems.map((item) => (
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

          {/* Create Team Button */}
          <div
            className={`nav-item ${activePage === "build" ? "active" : ""}`}
            onClick={() => handleClick({ id: "build", href: "/teams/create" })}
          >
            <span className="nav-icon">{IconBuild()}</span>Create Team
          </div>

          {/* My Teams (teams I own) */}
          <div
            className={`nav-item ${activePage === "my-teams" ? "active" : ""}`}
            onClick={() => handleClick({ id: "my-teams", href: "/teams" })}
          >
            <span className="nav-icon">{IconTeams()}</span>
            My Teams
          </div>

          {/* Teams I'm In */}
          <div
            className={`nav-item ${activePage === "teams-im-in" ? "active" : ""}`}
            onClick={() =>
              handleClick({ id: "teams-im-in", href: "/teams/teams-im-in" })
            }
          >
            <span className="nav-icon">{IconUserGroup()}</span>
            Teams I'm In
          </div>

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

      <style jsx>{`
        .nav-scrollable {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Custom scrollbar styling */
        .nav-scrollable::-webkit-scrollbar {
          width: 4px;
        }

        .nav-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-scrollable::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .nav-scrollable::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
}

// app/admin/components/AdminLayout.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Shield,
  ScrollText,
  ClipboardList,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Teams",
    href: "/admin/teams",
    icon: Building2,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Admins",
    href: "/admin/admins",
    icon: Shield,
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ScrollText,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: ClipboardList,
  },
];

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);

  return match ? decodeURIComponent(match[1]) : null;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getTokenFromCookie();

  const isJson = options.body && typeof options.body === "string";

  return fetch(url, {
    ...options,
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

const SIDEBAR_WIDTH = 300;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [admin, setAdmin] = useState<{
    fullName: string;
    email: string;
    role: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = getTokenFromCookie();

    if (!token) {
      router.push("/admin/login");
      setLoading(false);
      return;
    }

    fetch("/api/admin/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return null;
        }

        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setAdmin(data);
        }

        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    const token = getTokenFromCookie();

    if (token) {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }

    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  }

  // SAFE VALUES
  const adminName = admin?.fullName || "Administrator";

  const adminEmail = admin?.email || "admin@example.com";

  const adminRole = admin?.role || "Administrator";

  const adminInitial = (
    admin?.fullName?.[0] ||
    admin?.email?.[0] ||
    "A"
  ).toUpperCase();

  const SidebarContent = () => (
    <>
      {/* TOP */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              background: "linear-gradient(135deg,#7C3AED 0%,#A855F7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 18,
              boxShadow: "0 10px 30px rgba(124,58,237,0.4)",
              flexShrink: 0,
            }}
          >
            CG
          </div>

          <div>
            <div
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Change Genius
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Admin Dashboard
            </div>
          </div>
        </div>

        {/* SEARCH 
        <div
          style={{
            marginTop: 24,
            position: "relative",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              top: "50%",
              left: 14,
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.4)",
            }}
          />

          <input
            placeholder="Search..."
            style={{
              width: "100%",
              height: 48,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              outline: "none",
              paddingLeft: 42,
              paddingRight: 14,
              fontSize: 14,
            }}
          />
        </div>*/}
      </div>

      {/* NAV */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            marginBottom: 14,
            paddingLeft: 12,
          }}
        >
          MAIN MENU
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 18,
                  textDecoration: "none",
                  transition: "0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                  background: active
                    ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(168,85,247,0.08))"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(168,85,247,0.2)"
                    : "1px solid transparent",
                }}
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 10,
                      bottom: 10,
                      width: 4,
                      borderRadius: 20,
                      background: "#A855F7",
                    }}
                  />
                )}

                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: active
                      ? "rgba(168,85,247,0.15)"
                      : "rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active ? "#C084FC" : "rgba(255,255,255,0.65)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>

                <div>
                  <div
                    style={{
                      color: active ? "white" : "rgba(255,255,255,0.8)",
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    Manage {item.title.toLowerCase()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* SYSTEM 
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              marginBottom: 14,
              paddingLeft: 12,
            }}
          >
            SYSTEM
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <button
              style={{
                height: 54,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 16px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={18} />
              </div>
              Notifications
            </button>

            <button
              style={{
                height: 54,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 16px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Settings size={18} />
              </div>
              Settings
            </button>
          </div>
        </div>*/}
      </div>

      {/* USER CARD */}
      <div
        style={{
          padding: 20,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.02), transparent)",
        }}
      >
        <div
          style={{
            padding: 16,
            borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#7C3AED 0%,#A855F7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {adminInitial}
            </div>

            <div
              style={{
                overflow: "hidden",
                flex: 1,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {adminName}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 12,
                  marginTop: 3,
                }}
              >
                {adminRole}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {adminEmail}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 16,
              width: "100%",
              height: 50,
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg,#EF4444 0%,#DC2626 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 200,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className="desktop-sidebar"
        style={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          background: "#0F172A",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside
        className="mobile-sidebar"
        style={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          background: "#0F172A",
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : -SIDEBAR_WIDTH - 20,
          zIndex: 300,
          transition: "0.25s ease",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 16,
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "none",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <SidebarContent />
      </aside>

      {/* MOBILE TOPBAR */}
      <header
        className="mobile-header"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 70,
          background: "#0F172A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 150,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: 17,
          }}
        >
          Change Genius
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: "none",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* MAIN */}
      <main
        className="admin-main"
        style={{
          marginLeft: SIDEBAR_WIDTH,
          minHeight: "100vh",
          background: "#020817",
          transition: "0.2s ease",
        }}
      >
        <div
          style={{
            padding: 32,
          }}
        >
          {children}
        </div>
      </main>

      {/* RESPONSIVE */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }

          .mobile-header {
            display: flex !important;
          }

          .admin-main {
            margin-left: 0 !important;
            padding-top: 70px !important;
          }

          .admin-main > div {
            padding: 20px 16px !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

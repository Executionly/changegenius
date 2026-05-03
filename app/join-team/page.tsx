"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signUpSchema } from "@/lib/schemas";
import Link from "next/link";

function JoinInner() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const code = params.get("code");

  // Join status
  const [status, setStatus] = useState<"idle" | "joining" | "done" | "error" | "verification">("idle");
  const [message, setMessage] = useState("");
  const [teamId, setTeamId] = useState<string | null>(null);

  // Registration form
  const [showRegistration, setShowRegistration] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registrationLoading, setRegistrationLoading] = useState(false);

  const joinTeam = useCallback(async (registrationData?: {
    full_name: string;
    email: string;
    password: string;
  }) => {
    if (status === "joining" || status === "done") return;
    
    setStatus("joining");
    setRegistrationLoading(true);
    
    try {
      const payload = {
        token: token ?? undefined,
        code: code ?? undefined,
        ...registrationData,
      };

      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not join team.");
        setRegistrationError(data.error || "Could not join team.");
        setRegistrationLoading(false);
        return;
      }

      if (data.needsVerification) {
        setStatus("verification");
        setMessage(data.message || "Please check your email to verify your account.");
        setRegistrationLoading(false);
        return;
      }
      
      setTeamId(data.teamId);
      setStatus("done");
      
      if (data.registered) {
        setMessage("Account created and joined team successfully!");
      } else {
        setMessage(
          data.alreadyMember
            ? "You are already a member of this team."
            : "You have joined the team!"
        );
      }
      
      setRegistrationLoading(false);
    } catch (error) {
      console.error('Join team error:', error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      setRegistrationError("Something went wrong. Please try again.");
      setRegistrationLoading(false);
    }
  }, [token, code, status]);

  useEffect(() => {
    
    if (authLoading) return;
    
    if (!token && !code) {
      setStatus("error");
      setMessage("Invalid invite link.");
      return;
    }

    if (!isAuthenticated) {
      setShowRegistration(true);
      return;
    }

    if (status === "idle") {
      joinTeam();
    }
  }, [authLoading, isAuthenticated, token, code, status, joinTeam]);

  async function handleRegistration(e: React.FormEvent) {
    e.preventDefault();
    setRegistrationError("");

    const parsed = signUpSchema.safeParse({
      full_name: fullName,
      email: email,
      password: password,
      confirm_password: confirmPassword,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setRegistrationError(firstIssue?.message || "Please check your input");
      return;
    }

    await joinTeam({
      full_name: fullName,
      email: email,
      password: password,
    });
  }

  // Loading state
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--sage)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: 8,
            }}
          >
            Loading…
          </div>
        </div>
      </div>
    );
  }

  // Registration form for unauthenticated users
  if (showRegistration && status !== "joining" && status !== "done" && status !== "verification") {
    return (
      <div className="auth-container-new">
        <div className="auth-grid">
          <div className="auth-left">
            <div className="auth-card-new">
              <div className="logo">
                <div className="logo-icon"></div>
                <span>changegenius™</span>
              </div>
              <h2>Join Team</h2>
              <p className="subtitle">
                Create your account to join the team
              </p>

              <form onSubmit={handleRegistration} className="form">
                <div className="input-box">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                {registrationError && (
                  <div className="error-msg">{registrationError}</div>
                )}
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={registrationLoading}
                >
                  {registrationLoading ? "Creating Account…" : "Create Account"}
                </button>
              </form>

              <p className="footer-text" style={{ marginTop: "20px" }}>
                Already have an account?{" "}
                <Link 
                  href={`/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                  style={{ color: "var(--blue)", textDecoration: "none" }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          <div className="auth-right"></div>
        </div>
      </div>
    );
  }

  // Joining state
  if (status === "joining") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--sage)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: 8,
            }}
          >
            {showRegistration ? "Creating account…" : "Joining team…"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            Just a moment.
          </div>
        </div>
      </div>
    );
  }

  // Email verification needed
  if (status === "verification") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--sage)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 52,
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 20 }}>📧</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--navy)",
              marginBottom: 10,
            }}
          >
            Check Your Email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-3)",
              lineHeight: 1.65,
              marginBottom: 28,
            }}
          >
            {message}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-3)",
              lineHeight: 1.65,
            }}
          >
            After verifying your email, you'll be automatically redirected back here to complete your team registration.
          </p>
        </div>
      </div>
    );
  }

  // Success or error state
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--sage)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 52,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 20 }}>
          {status === "done" ? "🎉" : "❌"}
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: 10,
          }}
        >
          {status === "done" ? "Welcome to the team!" : "Could not join"}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-3)",
            lineHeight: 1.65,
            marginBottom: 28,
          }}
        >
          {message}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {status === "done" && (
            <>
              <Link
                href="/assessment"
                style={{
                  background: "var(--blue)",
                  color: "white",
                  padding: "11px 24px",
                  borderRadius: 100,
                  textDecoration: "none",
                }}
              >
                Take Assessment →
              </Link>
              <Link
                href={`/teams/${teamId}`}
                style={{
                  background: "white",
                  color: "var(--navy)",
                  padding: "11px 24px",
                  borderRadius: 100,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                View Team
              </Link>
            </>
          )}
          {status === "error" && (
            <Link
              href="/"
              style={{
                background: "var(--blue)",
                color: "white",
                padding: "11px 24px",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              Go Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        background: "var(--sage)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div>Loading...</div>
      </div>
    }>
      <JoinInner />
    </Suspense>
  );
}
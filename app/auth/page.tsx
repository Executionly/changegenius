"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, signInWithGoogle } from "@/lib/auth";
import { signUpSchema } from "@/lib/schemas";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinError, setSigninError] = useState("");
  const [signinLoading, setSigninLoading] = useState(false);

  // Sign Up
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault();
    setSigninError("");
    setSigninLoading(true);
    const res = await signIn({ email: signinEmail, password: signinPassword });
    if (res.error) {
      setSigninError(res.error);
      setSigninLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");
    const parsed = signUpSchema.safeParse({
      full_name: fullName,
      email: signupEmail,
      password: signupPassword,
      confirm_password: confirmPassword,
    });
    if (!parsed.success) {
      setSignupError(parsed.error.errors[0].message);
      return;
    }
    setSignupLoading(true);
    const res = await signUp({
      full_name: fullName,
      email: signupEmail,
      password: signupPassword,
    });
    if (res.error) {
      setSignupError(res.error);
      setSignupLoading(false);
      return;
    }
    router.push("/payment?plan=individual&welcome=1");
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const res = await signInWithGoogle();
    if (res.error) {
      setSignupError(res.error);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="auth-container-new">
      <div className="auth-grid">
        <div className="auth-left">
          <div className="auth-card-new">
            <div className="logo">
              <div className="logo-icon"></div>
              <span>changegenius™</span>
            </div>
            <h2>
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="subtitle">
              {activeTab === "signin"
                ? "Please enter your details"
                : "Please enter your details to get started"}
            </p>

            <div className="tabs">
              <button
                className={`tab ${activeTab === "signin" ? "active" : ""}`}
                onClick={() => setActiveTab("signin")}
              >
                Sign In
              </button>
              <button
                className={`tab ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => setActiveTab("signup")}
              >
                Signup
              </button>
            </div>

            {activeTab === "signin" && (
              <form onSubmit={handleSignin} className="form">
                <div className="input-box">
                  <input
                    type="email"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                {signinError && <div className="error-msg">{signinError}</div>}
                <button type="submit" className="btn" disabled={signinLoading}>
                  {signinLoading ? "Signing in…" : "Continue"}
                </button>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignup} className="form">
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
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
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
                {signupError && <div className="error-msg">{signupError}</div>}
                <button type="submit" className="btn" disabled={signupLoading}>
                  {signupLoading ? "Creating account…" : "Create Account"}
                </button>
              </form>
            )}

            <div className="divider">
              <span>Or Continue With</span>
            </div>
            <div className="socials">
              <button
                className="circle"
                onClick={handleGoogle}
                disabled={googleLoading}
              >
                G
              </button>
              <button className="circle black"></button>
              <button className="circle blue">f</button>
            </div>
            <p className="footer-text">
              Join smart investors and manage your finances with confidence.
            </p>
          </div>
        </div>
        <div className="auth-right"></div>
      </div>
    </div>
  );
}

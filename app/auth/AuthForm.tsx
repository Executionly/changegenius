"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp, signInWithGoogle } from "@/lib/auth";
import { signUpSchema } from "@/lib/schemas";

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams()
  const returnUrl = params.get('returnUrl')
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(returnUrl ? "signup" : "signin");

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
    if(returnUrl){
      router.replace(returnUrl)
    }else{
      router.push("/dashboard");
    }
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
      const firstIssue = parsed.error.issues[0];
      const errorMessage = firstIssue?.message || "Please check your input";
      setSignupError(errorMessage);
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
    if(returnUrl){
      router.replace(returnUrl)
    }else{
      router.replace("/payment?plan=individual&welcome=1");
    }
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
              <span>ChangeGenius™</span>
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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
              </button>
              {/* <button className="circle black"></button>
              <button className="circle blue">f</button> */}
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

"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  getProviderForCountry,
  detectCountryFromIP,
  getPriceConfig,
  type PaymentProvider,
  type PlanType,
} from "@/lib/payment";

const INDIVIDUAL_FEATURES = [
  "Full 72-question assessment",
  "Primary & secondary Change Genius™ role",
  "Complete ADAPTS stage profile",
  "Personal narrative interpretation",
  "Productivity Energy",
  "30-day action plan",
  "Downloadable PDF report",
  "Share card generation",
  "Invite teammates",
];

const TEAM_FEATURES = [
  "Everything in Individual",
  "Team role distribution map",
  "ADAPTS stage coverage analysis",
  "Friction pattern detection",
  "Change pod recommendations",
  "90-day team rollout plan",
  "Team PDF report export",
  "Unlocks at 3 members, full report at 5",
];

export default function PaymentCheckout() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const retake = params.get("retake") === "true";
  const teamNameParam = params.get("teamName") || "";
  const organizationParam = params.get("organization") || "";

  const planParam = (params.get("plan") ?? "individual") as PlanType;
  const teamSizeParam = parseInt(params.get("teamSize") ?? "3", 10);

  const [plan, setPlan] = useState<PlanType>(planParam);
  const [teamSize, setTeamSize] = useState(Math.max(3, teamSizeParam));
  const [teamName, setTeamName] = useState(teamNameParam);
  const [organization, setOrganization] = useState(organizationParam);
  const [provider, setProvider] = useState<PaymentProvider>("stripe");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryDetected, setCountryDetected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?returnUrl=/payment?plan=${plan}`);
    }
  }, [loading, isAuthenticated, router, plan]);

  useEffect(() => {
    detectCountryFromIP().then((code) => {
      setCountryCode(code);
      setProvider(getProviderForCountry(code));
      setCountryDetected(true);
    });
  }, []);

  const priceConfig = getPriceConfig(
    provider,
    plan,
    plan === "team" ? teamSize : 1,
  );
  const perPersonConfig = getPriceConfig(provider, "team", 1);

  async function handlePay() {
    if (!user) return;
    setError("");
    setProcessing(true);
    try {
      const body: any = {
        plan,
        teamSize: plan === "team" ? teamSize : 1,
        provider,
        countryCode,
        retake,
      };
      if (plan === "team") {
        body.teamName = teamName;
        body.organization = organization;
      }
      const res = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="payment-loading">
        <div className="payment-loading-text">Loading…</div>
      </div>
    );
  }

  const isTeam = plan === "team";

  return (
    <div className="payment-page">
      {/* Nav */}
      <div className="payment-nav">
        <div className="payment-nav-container">
          <Link href="/" className="payment-logo">
            ChangeGenius™
          </Link>
          <div className="payment-secure">
            <span>🔒</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <div className="payment-header-badge">
            One-time payment · No subscription
          </div>
          <h1 className="payment-header-title">
            Get Your Change Genius™ Assessment
          </h1>
          <p className="payment-header-subtitle">
            Instant access after payment. Lifetime results. Download your report
            any time.
          </p>
        </div>

        <div className="payment-grid">
          {/* LEFT */}
          <div className="payment-left">
            {/* Plan selector */}
            <div className="payment-card">
              <div className="payment-card-section">
                <div className="payment-section-title">Choose your plan</div>
                <div className="payment-plan-buttons">
                  {(["individual", "team"] as PlanType[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlan(p)}
                      className={`payment-plan-btn ${plan === p ? "active" : ""}`}
                    >
                      <div className="payment-plan-name">
                        {p === "individual" ? "Individual" : "Team"}
                      </div>
                      <div className="payment-plan-price">
                        {p === "individual"
                          ? `${getPriceConfig(provider, "individual").displayCurrency}${getPriceConfig(provider, "individual").displayAmount} one-time`
                          : `${perPersonConfig.displayCurrency}${perPersonConfig.displayAmount} per person`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team details */}
              {isTeam && (
                <div className="payment-card-section payment-team-details">
                  <div className="payment-section-subtitle">Team Details</div>
                  <div className="payment-input-group">
                    <label className="payment-label">Team Name *</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Leadership Team"
                      className="payment-input"
                    />
                  </div>
                  <div className="payment-input-group">
                    <label className="payment-label">
                      Organization (optional)
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="payment-input"
                    />
                  </div>
                </div>
              )}

              {/* Team size */}
              {isTeam && (
                <div className="payment-card-section payment-team-size">
                  <div className="payment-section-subtitle">
                    How many team members?
                  </div>
                  <div className="payment-size-buttons">
                    {[3, 5, 8, 10, 15, 20].map((n) => (
                      <button
                        key={n}
                        onClick={() => setTeamSize(n)}
                        className={`payment-size-btn ${teamSize === n ? "active" : ""}`}
                      >
                        {n}
                      </button>
                    ))}
                    <input
                      type="number"
                      min={3}
                      max={500}
                      value={teamSize}
                      onChange={(e) =>
                        setTeamSize(Math.max(3, parseInt(e.target.value) || 3))
                      }
                      className="payment-size-input"
                      placeholder="Custom"
                    />
                  </div>
                  <div className="payment-size-note">Minimum 3 members</div>
                </div>
              )}

              {/* Features */}
              <div className="payment-card-section">
                <div className="payment-section-title">What's included</div>
                <ul className="payment-features-list">
                  {(isTeam ? TEAM_FEATURES : INDIVIDUAL_FEATURES).map((f) => (
                    <li key={f} className="payment-feature-item">
                      <span className="payment-feature-check">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Provider selector */}
            <div className="payment-card">
              <div className="payment-card-section">
                <div className="payment-section-title">Payment method</div>
                <div className="payment-provider-buttons">
                  <button
                    onClick={() => setProvider("stripe")}
                    className={`payment-provider-btn ${provider === "stripe" ? "active" : ""}`}
                  >
                    <div className="payment-provider-info">
                      <svg
                        width="28"
                        height="12"
                        viewBox="0 0 60 25"
                        fill="none"
                      >
                        <path
                          d="M27.5 6.8c0-1.8 1.5-2.5 3.8-2.5 3.4 0 7.7 1 11.1 2.8V1.1C39.1.4 35.8 0 32.5 0 24.8 0 19.7 4 19.7 10.2c0 9.9 13.7 8.3 13.7 12.6 0 2.1-1.8 2.8-4.3 2.8-3.7 0-8.5-1.5-12.3-3.6v6.1c4.2 1.8 8.4 2.5 12.3 2.5 7.9 0 13.3-3.9 13.3-10.2 0-10.7-13.9-8.8-13.9-13.6z"
                          fill="#635BFF"
                        />
                      </svg>
                      <span>Stripe</span>
                    </div>
                    <div className="payment-provider-desc">
                      Cards · USD · International
                    </div>
                  </button>
                  <button
                    onClick={() => setProvider("paystack")}
                    className={`payment-provider-btn ${provider === "paystack" ? "active" : ""}`}
                  >
                    <div className="payment-provider-info">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 40 40"
                        fill="none"
                      >
                        <circle cx="20" cy="20" r="20" fill="#00C3F7" />
                        <path
                          d="M12 20h16M20 12v16"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Paystack</span>
                    </div>
                    <div className="payment-provider-desc">
                      Cards · Local Currency · Africa
                    </div>
                  </button>
                </div>

                {provider === "paystack" && (
                  <div className="payment-provider-note paystack-note">
                    ✓ Recommended for African users — pay in local currency with
                    local cards
                  </div>
                )}
                {provider === "stripe" && (
                  <div className="payment-provider-note stripe-note">
                    ✓ Recommended for international users — pay in USD with any
                    card
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="payment-right">
            <div className="payment-summary">
              <div className="payment-summary-title">Order Summary</div>

              <div className="payment-summary-item">
                <div className="payment-summary-product">
                  Change Genius™ {isTeam ? "Team" : "Individual"} Assessment
                </div>
                <div className="payment-summary-detail">
                  {isTeam
                    ? `${teamSize} members × ${perPersonConfig.displayCurrency}${perPersonConfig.displayAmount}`
                    : "Individual — one-time access"}
                </div>
                {isTeam && teamName && (
                  <div className="payment-summary-team">Team: {teamName}</div>
                )}
              </div>

              <div className="payment-summary-total">
                <span>Total</span>
                <span className="payment-summary-amount">
                  {priceConfig.displayCurrency}
                  {priceConfig.displayAmount}
                </span>
              </div>
              <div className="payment-summary-currency">
                {priceConfig.currency} · One-time payment · No subscription
              </div>

              {error && <div className="payment-error">{error}</div>}

              <button
                onClick={handlePay}
                disabled={processing || (isTeam && !teamName)}
                className="payment-pay-btn"
              >
                {processing
                  ? "Redirecting to payment…"
                  : `Pay ${priceConfig.displayCurrency}${priceConfig.displayAmount} with ${provider === "stripe" ? "Stripe" : "Paystack"}`}
              </button>

              <div className="payment-security">
                <div>🔒 Encrypted end-to-end</div>
                <div>⚡ Instant access after payment</div>
                <div>📄 Lifetime access to your results</div>
                <div>↩️ 14-day refund policy</div>
              </div>
            </div>

            <div className="payment-user-info">
              <div className="payment-user-label">Paying as</div>
              <div className="payment-user-email">{user?.email}</div>
            </div>

            <p className="payment-terms">
              By completing your purchase you agree to our{" "}
              <Link href="/terms" className="payment-terms-link">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          background: #f5f6fa;
        }

        /* Navigation */
        .payment-nav {
          background: var(--blue, #0101ee);
          padding: 0 24px;
        }
        .payment-nav-container {
          max-width: 1160px;
          margin: 0 auto;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .payment-logo {
          font-size: 16px;
          font-weight: 800;
          color: white;
          text-decoration: none;
          letter-spacing: -0.4px;
        }
        .payment-secure {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
        }

        /* Container */
        .payment-container {
          max-width: 980px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* Header */
        .payment-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .payment-header-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--blue, #0101ee);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }
        .payment-header-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 800;
          color: var(--blue, #0101ee);
          letter-spacing: -1px;
          margin-bottom: 8px;
        }
        .payment-header-subtitle {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
        }

        /* Grid */
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
          align-items: start;
        }

        /* Cards */
        .payment-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .payment-card-section {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .payment-card-section:last-child {
          border-bottom: none;
        }
        .payment-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }
        .payment-section-subtitle {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 10px;
        }

        /* Plan buttons */
        .payment-plan-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .payment-plan-btn {
          padding: 14px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .payment-plan-btn.active {
          border-color: var(--blue, #0101ee);
          background: #e8f0fe;
        }
        .payment-plan-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-1, #1e293b);
          margin-bottom: 3px;
        }
        .payment-plan-btn.active .payment-plan-name {
          color: var(--blue, #0101ee);
        }
        .payment-plan-price {
          font-size: 12px;
          color: #64748b;
        }

        /* Inputs */
        .payment-input-group {
          margin-bottom: 12px;
        }
        .payment-label {
          font-size: 12px;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }
        .payment-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
        }

        /* Size buttons */
        .payment-size-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .payment-size-btn {
          padding: 6px 14px;
          border-radius: 100px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .payment-size-btn.active {
          background: var(--blue, #0101ee);
          border-color: var(--blue, #0101ee);
          color: white;
        }
        .payment-size-input {
          width: 72px;
          padding: 7px 10px;
          border: 1.5px solid #e2e8f0;
          border-radius: 100px;
          font-size: 13px;
          text-align: center;
        }
        .payment-size-note {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 8px;
        }

        {/* Features list */}
        .payment-features-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .payment-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 5px 0;
          border-bottom: 1px solid #f8fafc;
        }
        .payment-feature-check {
          color: var(--blue, #0101ee);
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }

        {/* Provider buttons */}
        .payment-provider-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .payment-provider-btn {
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          text-align: left;
        }
        .payment-provider-btn.active {
          border-color: var(--blue, #0101ee);
          background: #e8f0fe;
        }
        .payment-provider-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 700;
        }
        .payment-provider-desc {
          font-size: 11px;
          color: #64748b;
        }
        .payment-provider-note {
          margin-top: 10px;
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 12px;
        }
        .paystack-note {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }
        .stripe-note {
          background: #f0f4ff;
          border: 1px solid #c7d2fe;
          color: var(--blue, #0101ee);
        }

        {/* Right sidebar - Order Summary */}
        .payment-right {
          position: sticky;
          top: 80px;
        }
        .payment-summary {
          background: var(--blue, #0101ee);
          border-radius: 16px;
          padding: 28px;
        }
        .payment-summary-title {
          font-size: 11px;
          font-weight: 700;
          color: rgb(255, 255, 255);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 18px;
        }
        .payment-summary-item {
          background: rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 16px;
        }
        .payment-summary-product {
          font-size: 14px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }
        .payment-summary-detail {
          font-size: 12px;
          color: rgb(255, 255, 255);
        }
        .payment-summary-team {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
        }
        .payment-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .payment-summary-total span:first-child {
          font-size: 14px;
          color: rgb(255, 255, 255);
        }
        .payment-summary-amount {
          font-size: 34px;
          font-weight: 900;
          color: white;
          letter-spacing: -1px;
        }
        .payment-summary-currency {
          font-size: 11px;
          color: rgb(255, 255, 255);
          margin-bottom: 24px;
        }
        .payment-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 14px;
        }
        .payment-pay-btn {
          width: 100%;
          padding: 14px;
          background: white;
          color: var(--blue, #0101ee);
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 14px;
          transition: background 0.15s;
        }
        .payment-pay-btn:hover {
          background: #f0f0f0;
        }
        .payment-pay-btn:disabled {
          background: rgba(255,255,255,0.5);
          cursor: not-allowed;
        }
        .payment-security {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .payment-security div {
          font-size: 12px;
          color: rgb(255, 255, 255);
        }
        .payment-user-info {
          margin-top: 12px;
          padding: 10px 14px;
          background: white;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
        .payment-user-label {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 2px;
        }
        .payment-user-email {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }
        .payment-terms {
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
          margin-top: 12px;
          line-height: 1.5;
        }
        .payment-terms-link {
          color: var(--blue, #0101ee);
          text-decoration: none;
        }

        {/* Loading state */}
        .payment-loading {
          min-height: 100vh;
          background: #f5f6fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .payment-loading-text {
          font-size: 14px;
          color: #64748b;
        }

        {/* Responsive */}
        @media (max-width: 900px) {
          .payment-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .payment-right {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .payment-container {
            padding: 24px 16px 60px;
          }
          .payment-plan-buttons,
          .payment-provider-buttons {
            grid-template-columns: 1fr;
          }
          .payment-size-buttons {
            justify-content: center;
          }
          .payment-summary-amount {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .payment-header-title {
            font-size: 28px;
          }
          .payment-card-section {
            padding: 16px;
          }
          .payment-summary {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

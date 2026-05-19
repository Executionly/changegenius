"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { PRICING, formatPrice, getTeamTotalPrice } from "@/lib/config/pricing";
export default function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ minHeight: "50vh" }}>
        <nav className="header-nav">
          <Link href="/" className="nav-logo">
            <img src="/logo.png" alt="Forbes" className="trusted-logo-img" />
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/assessment">Assessment</Link>
            </li>
            <li>
              <Link href="/#adapts">Model</Link>
            </li>
            <li>
              <Link href="/#pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
          <div className="nav-actions">
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-dashboard">
                  Login
                </Link>
                <Link href="/signup" className="btn-started">
                  Get started
                </Link>
              </>
            )}
          </div>
          <button className="hnav-burger" onClick={() => {}}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        <div
          className="hero-inner"
          style={{ minHeight: "auto", padding: "60px 24px 80px" }}
        >
          <div
            className="hero-copy"
            style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}
          >
            <h1
              className="hero-headline"
              style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
            >
              About Change Genius™
            </h1>
            <p
              className="adapts-rotating-line"
              style={{
                fontSize: "clamp(16px, 3vw, 18px)",
                maxWidth: 600,
                margin: "20px auto",
              }}
            >
              The leadership intelligence platform for change.
            </p>
          </div>
        </div>
      </section>

      {/* What is Change Genius? */}
      <section className="two-column-section">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="col-text">
            <h2>What is Change Genius?</h2>
            <p className="subhead">
              The first assessment-based model for change leadership
            </p>
            <p className="description">
              Change Genius™ is the first assessment-based model that reveals
              exactly how individuals and teams drive transformation. Built on
              the ADAPTS™ model — six stages from sensing disruption to scaling
              impact — it gives every leader and organization a shared language
              for change.
            </p>
            <p className="description">
              Most change initiatives fail not because of strategy, but because
              leaders don't understand their own change behavior, or their
              team's. Change Genius™ maps who you are in the system, what your
              team needs, and where momentum is being lost.
            </p>
            <p className="description">
              Whether you are a change sponsor, HR leader, or team manager,
              Change Genius™ gives you the clarity and language to lead
              transformation with confidence at every level.
            </p>
            <Link
              href="/assessment"
              className="btn-primary"
              style={{ marginTop: 16, display: "inline-block" }}
            >
              Take the Assessment →
            </Link>
          </div>
          <div className="col-image">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
              alt="Leadership workshop"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="two-column-section reverse">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="col-image">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
              alt="Team collaboration"
            />
          </div>
          <div className="col-text">
            <h2>Our Mission & Vision</h2>
            <p className="subhead">
              To be the most trusted intelligence system for individual and
              organizational change globally
            </p>
            <p className="description">
              We believe every leader deserves a clear picture of how their
              organization moves through change — and every team deserves the
              tools to navigate it together.
            </p>
            <p className="description">
              Our mission is to democratize change intelligence, making it
              accessible to leaders at every level, in every industry, around
              the world. We're building a future where change isn't feared —
              it's understood, measured, and mastered.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="model-section" style={{ padding: "60px 24px" }}>
        <div className="model-intro">
          <div
            className="model-framework-header"
            style={{ background: "var(--blue)" }}
          >
            <h3
              className="framework-title"
              style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
            >
              Our Guiding Principles
            </h3>
            <p
              className="framework-description"
              style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
            >
              The values that drive everything we do
            </p>
          </div>
        </div>

        <div
          className="values-grid"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          <div
            className="card"
            style={{ padding: "clamp(24px, 4vw, 32px)", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "clamp(40px, 6vw, 48px)", marginBottom: 16 }}
            >
              🔮
            </div>
            <h3
              style={{
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                color: "var(--blue)",
                marginBottom: 12,
              }}
            >
              Clarity
            </h3>
            <p
              style={{
                fontSize: "clamp(13px, 2vw, 14px)",
                color: "var(--text-2)",
                lineHeight: 1.6,
              }}
            >
              Science-backed insights delivered in plain language. No jargon.
              Actionable at every leadership level.
            </p>
          </div>

          <div
            className="card"
            style={{ padding: "clamp(24px, 4vw, 32px)", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "clamp(40px, 6vw, 48px)", marginBottom: 16 }}
            >
              🎯
            </div>
            <h3
              style={{
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                color: "var(--blue)",
                marginBottom: 12,
              }}
            >
              Alignment
            </h3>
            <p
              style={{
                fontSize: "clamp(13px, 2vw, 14px)",
                color: "var(--text-2)",
                lineHeight: 1.6,
              }}
            >
              Individual and team insight always connected. One common language
              for the whole organization.
            </p>
          </div>

          <div
            className="card"
            style={{ padding: "clamp(24px, 4vw, 32px)", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "clamp(40px, 6vw, 48px)", marginBottom: 16 }}
            >
              ⚡
            </div>
            <h3
              style={{
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                color: "var(--blue)",
                marginBottom: 12,
              }}
            >
              Momentum
            </h3>
            <p
              style={{
                fontSize: "clamp(13px, 2vw, 14px)",
                color: "var(--text-2)",
                lineHeight: 1.6,
              }}
            >
              Built for action, not just reflection. Every feature drives the
              next step forward.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="stats-overlap"
        style={{ marginTop: 0, padding: "40px 24px" }}
      >
        <div className="stats-container">
          <div className="stat-item">
            {/* <div className="stat-number-container">
              <span className="stat-number">6</span>
            </div> */}
            <div className="stat-label">6 ADAPTS™ Stages</div>
            <div className="stat-desc">
              Mapped across the full arc of organizational transformation
            </div>
          </div>
          <div className="stat-item">
            {/*  <div className="stat-number-container">
              <span className="stat-number">72</span>
            </div> */}
            <div className="stat-label">Assessment</div>
            <div className="stat-desc">
              Science-backed assessment completed in 8–10 minutes
            </div>
          </div>
          <div className="stat-item">
            {/* <div className="stat-number-container">
              <span className="stat-number">
                {formatPrice(PRICING.INDIVIDUAL)}
              </span>
            </div> */}
            <div className="stat-label">No subscription</div>
            <div className="stat-desc">
              One-time payment. No subscription. No license complexity.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2
            className="cta-title"
            style={{ fontSize: "clamp(28px, 5vw, 44px)" }}
          >
            Ready to discover your Change Genius?
          </h2>
          <p
            className="cta-subhead"
            style={{ fontSize: "clamp(14px, 2.5vw, 18px)" }}
          >
            Join thousands of leaders transforming how they navigate change.
          </p>
          <Link
            href="/assessment"
            className="cta-button"
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              padding: "clamp(12px, 2vw, 16px) clamp(28px, 4vw, 40px)",
            }}
          >
            Take The Assessment Now →
          </Link>
          {/*<div className="cta-price">
            {formatPrice(PRICING.INDIVIDUAL)} per license · One-time payment
          </div>*/}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <svg width="32" height="32" viewBox="0 0 159 159" fill="none">
              {/* PASTE YOUR LOGO MARK PATH AGAIN (or reuse) */}
              <path d="[PASTE YOUR LOGO MARK PATH HERE]" fill="#0101ee" />
            </svg>
            <span className="footer-logo-text">
              changegenius<sup>™</sup>
            </span>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li>
                  <Link href="/assessment">Assessment</Link>
                </li>
                <li>
                  <Link href="/pricing?plan=individual">For Individuals</Link>
                </li>
                <li>
                  <Link href="/pricing?plan=team">For Teams</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link href="/resources">articles</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 ChangeGenius™. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .values-grid {
            gap: 16px !important;
          }
          .hero-inner {
            padding: 40px 20px 60px !important;
          }
        }
        @media (max-width: 480px) {
          .values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

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
            <svg className="nav-logo-mark" viewBox="0 0 159 159" fill="none">
              <path
                opacity="0.94"
                d="M49.6719 33.999C53.9563 30.0391 53.9602 26.5696 50.7754 20.1943C49.6463 18.2211 49 15.9353 49 13.499C49.0003 6.0434 55.0443 -0.000976562 62.5 -0.000976562C69.9557 -0.000976562 75.9997 6.0434 76 13.499C75.9999 16.3747 75.0999 19.0406 73.5674 21.2305C72.2363 23.5977 68.6459 31.0713 74.5 33.999L125 33.999L125 83.6699C128.96 87.9546 132.429 87.9584 138.805 84.7734C140.778 83.6443 143.064 82.998 145.5 82.998C152.956 82.998 158.999 89.0427 159 96.498C159 103.954 152.956 109.998 145.5 109.998C142.624 109.998 139.959 109.098 137.769 107.565C135.401 106.234 127.928 102.645 125 108.498L125 159L0 159L0 108.6C2.97579 103.838 9.56578 107.402 11.4727 108.575C11.6295 108.68 11.7882 108.781 11.9492 108.88C11.9821 108.902 12 108.913 12 108.913V108.91C14.1883 110.235 16.755 110.999 19.5 110.999C27.5079 110.999 34 104.507 34 96.499C34 88.4911 27.5079 81.9993 19.5 81.999C16.7552 81.999 14.1882 82.7619 12 84.0869V84.0811C5.49986 87.999 0.999854 84.999 0 82.999L0 33.999L49.6719 33.999ZM48 139.499C48 142.244 48.7629 144.811 50.0879 146.999H50.082C53.9999 153.499 51 157.999 49 158.999L74.6006 158.999C69.8388 156.023 73.4026 149.433 74.5762 147.526C74.6806 147.37 74.7824 147.211 74.8809 147.05C74.903 147.017 74.9141 146.999 74.9141 146.999H74.9111C76.2363 144.811 77 142.244 77 139.499C76.9997 131.491 70.508 124.999 62.5 124.999C54.492 124.999 48.0003 131.491 48 139.499Z"
                fill="#0101ee"
              />
            </svg>
            <span className="nav-brand">ChangeGenius™</span>
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/assessment">Assessment</Link>
            </li>
            <li>
              <Link href="/#adapts">model</Link>
            </li>
            <li>
              <Link href="/#pricing">Pricing</Link>
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
              The leadership intelligence platform for change. Built on the
              ADAPTS™ model.
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
              the ADAPTS model — six stages from sensing disruption to scaling
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
              To be the most trusted intelligence system for organizational
              change globally
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
            <div className="stat-number-container">
              <span className="stat-number">6</span>
            </div>
            <div className="stat-label">ADAPTS Stages</div>
            <div className="stat-desc">
              Mapped across the full arc of organizational transformation
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number-container">
              <span className="stat-number">72</span>
            </div>
            <div className="stat-label">Questions</div>
            <div className="stat-desc">
              Science-backed assessment completed in 8–10 minutes
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number-container">
              <span className="stat-number">
                {formatPrice(PRICING.INDIVIDUAL)}
              </span>
            </div>
            <div className="stat-label">Per Person</div>
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
          <div className="cta-price">
            {formatPrice(PRICING.INDIVIDUAL)} per license · One-time payment
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <svg width="32" height="32" viewBox="0 0 159 159" fill="none">
              <path
                opacity="0.94"
                d="M49.6719 33.999C53.9563 30.0391 53.9602 26.5696 50.7754 20.1943C49.6463 18.2211 49 15.9353 49 13.499C49.0003 6.0434 55.0443 -0.000976562 62.5 -0.000976562C69.9557 -0.000976562 75.9997 6.0434 76 13.499C75.9999 16.3747 75.0999 19.0406 73.5674 21.2305C72.2363 23.5977 68.6459 31.0713 74.5 33.999L125 33.999L125 83.6699C128.96 87.9546 132.429 87.9584 138.805 84.7734C140.778 83.6443 143.064 82.998 145.5 82.998C152.956 82.998 158.999 89.0427 159 96.498C159 103.954 152.956 109.998 145.5 109.998C142.624 109.998 139.959 109.098 137.769 107.565C135.401 106.234 127.928 102.645 125 108.498L125 159L0 159L0 108.6C2.97579 103.838 9.56578 107.402 11.4727 108.575C11.6295 108.68 11.7882 108.781 11.9492 108.88C11.9821 108.902 12 108.913 12 108.913V108.91C14.1883 110.235 16.755 110.999 19.5 110.999C27.5079 110.999 34 104.507 34 96.499C34 88.4911 27.5079 81.9993 19.5 81.999C16.7552 81.999 14.1882 82.7619 12 84.0869V84.0811C5.49986 87.999 0.999854 84.999 0 82.999L0 33.999L49.6719 33.999ZM48 139.499C48 142.244 48.7629 144.811 50.0879 146.999H50.082C53.9999 153.499 51 157.999 49 158.999L74.6006 158.999C69.8388 156.023 73.4026 149.433 74.5762 147.526C74.6806 147.37 74.7824 147.211 74.8809 147.05C74.903 147.017 74.9141 146.999 74.9141 146.999H74.9111C76.2363 144.811 77 142.244 77 139.499C76.9997 131.491 70.508 124.999 62.5 124.999C54.492 124.999 48.0003 131.491 48 139.499Z"
                fill="#0101ee"
              />
            </svg>
            <span className="footer-logo-text">ChangeGenius™</span>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li>
                  <Link href="/assessment">Assessment</Link>
                </li>
                <li>
                  <Link href="/#pricing">For Individuals</Link>
                </li>
                <li>
                  <Link href="/#pricing">For Teams</Link>
                </li>
                <li>
                  <Link href="/#pricing">Pricing</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/#adapts">ADAPTS model</Link>
                </li>
                <li>
                  <Link href="#">Case Studies</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li>
                  <Link href="#">Help Center</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href="#">Terms of Service</Link>
                </li>
                <li>
                  <Link href="#">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="#">Accessibility</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} ChangeGenius™. All rights
              reserved.
            </p>
            <div className="footer-social">
              <a href="#">in</a>
              <a href="#">𝕏</a>
              <a href="#">▶</a>
            </div>
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

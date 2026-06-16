"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PRICING, formatPrice, getTeamTotalPrice } from "@/lib/config/pricing";
// ------------------------------
// Data for interactive sections
// ------------------------------
const stages = [
  "Alert",
  "Diagnose",
  "Prepare",
  "Align",
  "Transform",
  "Sustain",
];

const stageDetails: Record<
  string,
  { preview: string; title: string; description: string; insight: string }
> = {
  alert: {
    preview: "Recognizes signals, opportunities, risks, and changing realities",
    title: "Alert",
    description:
      "Recognizes signals, opportunities, risks, and changing realities before others notice them.",
    insight:
      "Strong users are aware, proactive, and observant — they give organizations the crucial head-start needed to respond rather than react. Weak users tend to be reactive and slow to notice problems, leaving teams blindsided by changes that were visible long before they became crises.",
  },
  diagnose: {
    preview: "Understands root causes and identifies real problems",
    title: "Diagnose",
    description:
      "Understands root causes and identifies the real problems beneath the surface.",
    insight:
      "Strong users are analytical, thoughtful, and strategic — they ensure teams solve the right problem, not just the visible symptom. Weak users diagnose incorrectly or treat symptoms only, leading to recurring issues and wasted effort on solutions that never fully land.",
  },
  access: {
    preview: "Builds structure, readiness, planning, and systems",
    title: "Prepare",
    description:
      "Builds the structure, readiness, planning, and systems needed before execution begins.",
    insight:
      "Strong users are organized, intentional, and prepared — they reduce execution risk by ensuring people, systems, and structures are ready before change is deployed. Weak users rush into execution without clarity, leading to confusion, rework, and capability gaps that surface mid-delivery.",
  },
  participate: {
    preview: "Creates trust, communication, and shared direction",
    title: "Align",
    description:
      "Creates trust, communication, and shared direction so teams move as one.",
    insight:
      "Strong users are collaborative, clear communicators, and trust builders — they create environments where it is safe to surface problems early and keep teams connected through disruption. Weak users leave teams disconnected, with poor buy-in and confusion that causes silent failures to grow undetected.",
  },
  transform: {
    preview: "Turns plans into execution and measurable movement",
    title: "Transform",
    description:
      "Turns plans into execution and drives measurable movement toward outcomes.",
    insight:
      "Strong users are action-oriented, decisive, and execution-focused — they keep momentum moving and push initiatives through to completion. Weak users produce inconsistent execution and stalled progress, where plans look good on paper but never fully convert into real results.",
  },
  scale: {
    preview: "Maintains consistency, systems, rhythm, and long-term growth",
    title: "Sustain",
    description:
      "Maintains consistency, systems, rhythm, and the foundations for long-term growth.",
    insight:
      "Strong users are disciplined, scalable, and sustainable — they institutionalize new behaviors and build systems that make change self-sustaining beyond the initial push. Weak users rely on short-term momentum only, leading to burnout, inconsistency, and initiatives that fade once the initial energy dissipates.",
  },
};

const energyCards = [
  {
    title: "Innovator",
    tagline: "You ignite change.",
    desc: "You generate ideas, sense disruption early, and energize people toward new possibilities. Innovator energy is essential at the start of transformation.",
    chips: [
      "Future-focused",
      "Idea-generating",
      "Disruption-sensing",
      "Energizing",
    ],
  },
  {
    title: "Achiever",
    tagline: "You drive results.",
    desc: "You convert ideas into action, push initiatives forward, and keep teams moving. Achiever energy is essential when momentum needs to be created.",
    chips: [
      "Action-oriented",
      "Results-driven",
      "Momentum-focused",
      "Execution-led",
    ],
  },
  {
    title: "Organizer",
    tagline: "You refine and structure.",
    desc: "You set up systems, processes, and structures so that change can be sustained. Organizer energy is essential when clarity, order, and preparation are needed.",
    chips: [
      "Structure-focused",
      "Process-oriented",
      "Planning-led",
      "Quality-driven",
    ],
  },
  {
    title: "Unifier",
    tagline: "You unify people.",
    desc: "You build trust, facilitate dialogue, and keep teams connected through disruption. Unifier energy is essential when alignment is breaking down.",
    chips: [
      "Trust-building",
      "Dialogue-focused",
      "Relationship-led",
      "Empathy-driven",
    ],
  },
];

const productivityEnergies = [
  {
    key: "A",
    name: "Achiever",
    tagline: "Energized by progress and results.",
    alive: [
      "Completing goals",
      "Seeing momentum",
      "Producing measurable outcomes",
      "Achieving targets",
    ],
    drain: ["Inactivity", "Slow movement", "Lack of visible progress"],
  },
  {
    key: "I",
    name: "Innovator",
    tagline: "Energized by ideas and possibilities.",
    alive: [
      "Creating new ideas",
      "Solving complex problems",
      "Exploring possibilities",
      "Thinking creatively",
    ],
    drain: ["Repetitive work", "Rigid environments", "Lack of creativity"],
  },
  {
    key: "O",
    name: "Organizer",
    tagline: "Energized by structure and order.",
    alive: [
      "Creating systems",
      "Organizing complexity",
      "Improving workflows",
      "Building clarity",
    ],
    drain: ["Chaos", "Inconsistency", "Lack of direction"],
  },
  {
    key: "U",
    name: "Unifier",
    tagline: "Energized by people and connection.",
    alive: [
      "Building relationships",
      "Helping people succeed",
      "Strengthening trust",
      "Creating harmony",
    ],
    drain: ["Conflict", "Isolation", "Emotionally disconnected environments"],
  },
];

const testimonials = [
  {
    quote:
      "The ADAPTS™ model gave us a shared language across 12 countries. We reduced change friction by 40% in six months.",
    name: "Marie Dupont",
    role: "Head of Org Development",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    logo: "https://placehold.co/80x30?text=GlobalBank",
    rating: 5,
  },
  {
    quote:
      "The assessment uncovered my 'Innovator' energy. Now my team's productivity is through the roof.",
    name: "James Chen",
    role: "VP of Transformation",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    logo: "https://placehold.co/80x30?text=TechCorp",
    rating: 5,
  },
  {
    quote:
      "As an HR leader, I finally have a tool that helps every manager understand their change behaviour. It's a total game changer.",
    name: "Elena Rodriguez",
    role: "CHRO, HealthPlus",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    logo: "https://placehold.co/80x30?text=HealthPlus",
    rating: 5,
  },
  {
    quote: "A common vocabulary made all the difference.",
    name: "Sarah Voss",
    role: "VP Change Management",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
    logo: "https://placehold.co/80x30?text=NordicEnergy",
    rating: 5,
  },
  {
    quote:
      "The diagnostics revealed friction we never saw. In two months, we eliminated 70% of it.",
    name: "David Kim",
    role: "COO, LogiChain",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg",
    logo: "https://placehold.co/80x30?text=LogiChain",
    rating: 5,
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobOpen, setMobOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    "individual" | "team" | null
  >(null);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [activeStage, setActiveStage] =
    useState<keyof typeof stageDetails>("alert");
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [activeImpactTab, setActiveImpactTab] = useState("meetings");
  const [activePricingTab, setActivePricingTab] = useState("individuals");
  const [selectedTestimonial, setSelectedTestimonial] = useState<
    (typeof testimonials)[0] | null
  >(null);
  const autoInterval = useRef<NodeJS.Timeout | null>(null);

  // Rotating text
  useEffect(() => {
    const interval = setInterval(
      () => setRotatingIndex((i) => (i + 1) % stages.length),
      4000,
    );
    return () => clearInterval(interval);
  }, []);

  // Energy carousel auto-rotate
  useEffect(() => {
    autoInterval.current = setInterval(
      () => setCurrentEnergy((i) => (i + 1) % energyCards.length),
      4000,
    );
    return () => {
      if (autoInterval.current) clearInterval(autoInterval.current);
    };
  }, []);

  const handleStart = () => {
    if (isAuthenticated) setShowPlanModal(true);
    else router.push("/signup?returnUrl=/assessment/select");
  };
  const proceed = () => {
    if (selectedPlan === "individual") router.push("/payment?plan=individual");
    if (selectedPlan === "team") router.push("/teams/create");
    setShowPlanModal(false);
  };

  // Jigsaw cursor and grid overlay
  const heroRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!gridRef.current) return;
    // Build 16x8 grid cells
    const accentPairs = [
      { col: 12, row: 0 },
      { col: 13, row: 1 },
      { col: 1, row: 6 },
      { col: 2, row: 7 },
    ];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 16; col++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        if (accentPairs.some((p) => p.col === col && p.row === row))
          cell.classList.add("accent-pair");
        gridRef.current.appendChild(cell);
      }
    }
    let mouseX = 0,
      mouseY = 0,
      curX = 0,
      curY = 0,
      inside = false,
      show = false;
    let rafId: number | null = null;
    const tick = () => {
      if (!inside) {
        if (cursorRef.current) cursorRef.current.style.opacity = "0";
        return;
      }
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = curX + "px";
        cursorRef.current.style.top = curY + "px";
        cursorRef.current.style.opacity = show ? "1" : "0";
      }
      rafId = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      const target = e.target as HTMLElement;
      show = !target.closest?.(
        "a, button, .nav-links, .nav-actions, .btn-hero-primary, .nav-logo",
      );
    };
    heroRef.current?.addEventListener("mousemove", onMove);
    heroRef.current?.addEventListener("mouseenter", () => {
      inside = true;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    });
    heroRef.current?.addEventListener("mouseleave", () => {
      inside = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    });
    return () => heroRef.current?.removeEventListener("mousemove", onMove);
  }, []);

  // Add this inside your HomePage component, after the existing useEffects
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    sliderInterval.current = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => {
      if (sliderInterval.current) clearInterval(sliderInterval.current);
    };
  }, []);

  // Add this to control slider position
  useEffect(() => {
    const track = document.querySelector(".hero-slider-track") as HTMLElement;
    if (track) {
      track.style.transform = `translateX(-${sliderIndex * 100}%)`;
    }
    // Update active dot
    document.querySelectorAll(".hero-slider-dots span").forEach((dot, i) => {
      if (i === sliderIndex) dot.classList.add("active");
      else dot.classList.remove("active");
    });
  }, [sliderIndex]);

  return (
    <>
      {/* Mobile menu */}
      {mobOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "white",
            zIndex: 1000,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 36,
            }}
          >
            <span
              style={{ fontSize: 20, fontWeight: 800, color: "var(--blue)" }}
            >
              ChangeGenius™
            </span>
            <button
              onClick={() => setMobOpen(false)}
              style={{ fontSize: 24, background: "none", border: "none" }}
            >
              ✕
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link href="/about" onClick={() => setMobOpen(false)}>
              About Us
            </Link>
            <Link href="/assessment" onClick={() => setMobOpen(false)}>
              Assessment
            </Link>
            <Link href="#adapts" onClick={() => setMobOpen(false)}>
              Model
            </Link>
            <Link href="#pricing" onClick={() => setMobOpen(false)}>
              For Teams · Pricing
            </Link>
            <Link href="/contact" onClick={() => setMobOpen(false)}>
              Contact Us
            </Link>
            <Link href="/resources" onClick={() => setMobOpen(false)}>
              Resources
            </Link>
            <Link href="/dashboard" onClick={() => setMobOpen(false)}>
              Dashboard
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobOpen(false)}
              style={{
                background: "var(--blue)",
                color: "white",
                padding: "12px",
                borderRadius: 40,
                textAlign: "center",
              }}
            >
              Get started
            </Link>
          </nav>
        </div>
      )}

      {/* Plan selection modal */}
      {showPlanModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowPlanModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 40,
              maxWidth: 500,
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              Take the Assessment
            </h2>
            <p style={{ marginBottom: 24 }}>Choose how you want to start:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button
                onClick={() => {
                  setSelectedPlan("individual");
                  proceed();
                }}
                className="plan-btn"
                style={{
                  padding: 16,
                  border: "2px solid var(--blue)",
                  borderRadius: 16,
                  background: "white",
                  textAlign: "left",
                }}
              >
                <strong>For Individuals</strong>
                <br />
                <span style={{ fontSize: 14 }}>
                  Discover your Change Genius role –{" "}
                  {formatPrice(PRICING.INDIVIDUAL)} one-time
                </span>
              </button>
              <button
                onClick={() => {
                  setSelectedPlan("team");
                  proceed();
                }}
                className="plan-btn"
                style={{
                  padding: 16,
                  border: "2px solid var(--blue)",
                  borderRadius: 16,
                  background: "white",
                  textAlign: "left",
                }}
              >
                <strong>For Teams</strong>
                <br />
                <span style={{ fontSize: 14 }}>
                  Build your Team Change Map™ –{" "}
                  {formatPrice(PRICING.TEAM_PER_PERSON)} per person (min.{" "}
                  {PRICING.TEAM_MIN_MEMBERS})
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowPlanModal(false)}
              style={{
                marginTop: 24,
                width: "100%",
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: 100,
                background: "none",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========== HERO SECTION ========== */}
      {/* ========== HERO SECTION - CORPORATE REDESIGN ========== */}
      <section className="hero" ref={heroRef}>
        <div className="jig-cursor" ref={cursorRef}>
          <svg
            viewBox="0 0 159 159"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.92"
              d="M49.6719 33.999C53.9563 30.0391 53.9602 26.5696 50.7754 20.1943C49.6463 18.2231 49 15.9353 49 13.499C49.0003 6.0434 55.0443 -0.000976562 62.5 -0.000976562C69.9557 -0.000976562 75.9997 6.0434 76 13.499C75.9999 16.3747 75.0999 19.0406 73.5674 21.2305C72.2363 23.5977 68.6459 31.0713 74.5 33.999L125 33.999L125 83.6699C128.96 87.9546 132.429 87.9584 138.805 84.7734C140.778 83.6443 143.064 82.998 145.5 82.998C152.956 82.998 158.999 89.0427 159 96.498C159 103.954 152.956 109.998 145.5 109.998C142.624 109.998 139.959 109.098 137.769 107.565C135.401 106.234 127.928 102.645 125 108.498L125 159L0 159L0 108.6C2.97579 103.838 9.56578 107.402 11.4727 108.575C11.6295 108.68 11.7882 108.781 11.9492 108.88C11.9821 108.902 12 108.913 12 108.913V108.91C14.1883 110.235 16.755 110.999 19.5 110.999C27.5079 110.999 34 104.507 34 96.499C34 88.4911 27.5079 81.9993 19.5 81.999C16.7552 81.999 14.1882 82.7619 12 84.0869V84.0811C5.49986 87.999 0.999854 84.999 0 82.999L0 33.999L49.6719 33.999ZM48 139.499C48 142.244 48.7629 144.811 50.0879 146.999H50.082C53.9999 153.499 51 157.999 49 158.999L74.6006 158.999C69.8388 156.023 73.4026 149.433 74.5762 147.526C74.6806 147.37 74.7824 147.211 74.8809 147.05C74.903 147.017 74.9141 146.999 74.9141 146.999H74.9111C76.2363 144.811 77 142.244 77 139.499C76.9997 131.491 70.508 124.999 62.5 124.999C54.492 124.999 48.0003 131.491 48 139.499Z"
              fill="white"
            />
          </svg>
        </div>

        <nav className="header-nav">
          <Link href="/" className="nav-logo">
            <img src="/logo.png" alt="Forbes" className="trusted-logo-img" />
            {/*<span className="nav-brand">
              ChangeGenius<sup>™</sup>
            </span>*/}
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/assessment">Assessment</Link>
            </li>
            <li>
              <Link href="#adapts">Model</Link>
            </li>
            <li>
              <Link href="#pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
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
          <button className="hnav-burger" onClick={() => setMobOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-trust-badge">
              <span className="trust-dot"></span>
              Trusted by Fortune 500 leaders
            </div>

            <h1 className="hero-headline">
              Discover Your Change Genius™
              {/*<br />*/}
              <span className="highlight-text"></span>
            </h1>

            <p className="hero-description">
              Unlock the natural strengths that drive your performance,
              leadership, growth, and ability to create lasting results.
            </p>

            <button className="btn-hero-primary" onClick={handleStart}>
              Take the Assessment
              <span className="arrow">→</span>
            </button>

            <div className="hero-footnote">
              <span className="footnote-icon">✓</span> No subscription ·
              One-time payment · Instant results
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-slider">
              <div className="hero-slider-track">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="hero-card">
                    <div className="hero-card-header">
                      <div className="hero-card-badge">Sample Report</div>
                      <div className="hero-card-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="hero-card-content">
                      <div className="hero-card-role">
                        <span className="role-label">Your Change Genius™</span>
                        <div className="role-value">
                          <span className="role-primary">
                            {i === 0
                              ? "Driver"
                              : i === 1
                                ? "Spotter"
                                : "Stabilizer"}
                          </span>
                          <span className="role-plus">+</span>
                          <span className="role-secondary">
                            {i === 0
                              ? "Stabilizer"
                              : i === 1
                                ? "Preparer"
                                : "Unifier"}
                          </span>
                        </div>
                      </div>
                      <div className="hero-card-stats">
                        <div className="hero-card-stat">
                          <span className="stat-value">
                            {i === 0 ? "87" : i === 1 ? "92" : "78"}
                          </span>
                          <span className="stat-label">Change Capacity</span>
                        </div>
                        <div className="hero-card-stat">
                          <span className="stat-value">
                            {i === 0
                              ? "Achiever"
                              : i === 1
                                ? "Innovator"
                                : "Organizer"}
                          </span>
                          <span className="stat-label">Primary Energy</span>
                        </div>
                      </div>
                      <div className="hero-card-stages">
                        <div className="stage-row">
                          <span>Alert</span>
                          <div className="stage-bar">
                            <div
                              style={{
                                width:
                                  i === 0 ? "78%" : i === 1 ? "94%" : "62%",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="stage-row">
                          <span>Diagnose</span>
                          <div className="stage-bar">
                            <div
                              style={{
                                width:
                                  i === 0 ? "92%" : i === 1 ? "68%" : "84%",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="stage-row">
                          <span>Prepare</span>
                          <div className="stage-bar">
                            <div
                              style={{
                                width:
                                  i === 0 ? "65%" : i === 1 ? "82%" : "91%",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hero-slider-dots">
                <span className="active"></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS OVERLAP ========== */}
      <section className="stats-overlap">
        <div className="stats-container">
          <div className="stat-item">
            {/*  <div className="stat-number-container">
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
            <div className="stat-label">Assesment</div>
            <div className="stat-desc">
              Science-backed assessment completed in 8–10 minutes
            </div>
          </div>
          <div className="stat-item">
            {/*  <div className="stat-number-container">
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

      {/* ========== TRUSTED SECTION ========== */}
      <section className="trusted-section">
        <div className="trusted-header">
          <h2
            className="trusted-title"
            style={{ marginBottom: "20px", fontSize: "1.0rem" }}
          >
            Trusted by organizations worldwide
          </h2>
          <div className="trusted-logos-container">
            <div className="trusted-logos">
              <img
                src="/forbes-logo.png"
                alt="Forbes-logo"
                className="trusted-logo-img"
              />
            </div>
            <div className="trusted-logos">
              <img src="/nbc.png" alt="nbc-logo" className="trusted-logo-img" />
            </div>
            <div className="trusted-logos">
              <img src="/cbs.png" alt="cbs-logo" className="trusted-logo-img" />
            </div>
            <div className="trusted-logos">
              <img src="/abc.png" alt="abc-logo" className="trusted-logo-img" />
            </div>
            <div className="trusted-logos">
              <img src="/fox.jpg" alt="Fox-logo" className="trusted-logo-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT CHANGE GENIUS (two‑column) ========== */}
      <section className="two-column-section reverse">
        <div className="section-bg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 800 800"
            opacity="1"
          >
            <defs>
              <filter
                id="bbblurry-filter"
                x="-100%"
                y="-100%"
                width="400%"
                height="400%"
                filterUnits="objectBoundingBox"
                primitiveUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feGaussianBlur
                  stdDeviation="77"
                  x="0%"
                  y="0%"
                  width="100%"
                  height="100%"
                  in="SourceGraphic"
                  edgeMode="none"
                  result="blur"
                ></feGaussianBlur>
              </filter>
            </defs>
            <g filter="url(#bbblurry-filter)">
              <ellipse
                rx="203.5"
                ry="122"
                cx="546.8372560622993"
                cy="404.79289298103436"
                fill="#0000ffff"
              ></ellipse>
              <ellipse
                rx="203.5"
                ry="122"
                cx="387.96496953870883"
                cy="415.43581531610135"
                fill="hsl(316, 73%, 52%)"
              ></ellipse>
              <ellipse
                rx="203.5"
                ry="122"
                cx="355.06858700557973"
                cy="178.68972636901742"
                fill="#0000ffff"
              ></ellipse>
            </g>
          </svg>{" "}
        </div>
        <div className="container">
          <div className="col-image">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
              alt="Leadership workshop"
            />
          </div>
          <div className="col-text">
            <h2>About Change Genius</h2>
            <p className="subhead">
              Built for leaders navigating transformation — intelligence,
              clarity, and real-time insight.
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
            <Link href="/about" className="btn-primary">
              Explore the Model →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== ADAPTS FRAMEWORK (interactive SVG) ========== */}
      <section className="model-section" id="adapts">
        <div className="model-intro">
          <div className="model-framework-header">
            <h3 className="framework-title">The ADAPTS™ Model</h3>
            <p className="framework-subtitle">
              Six stages of substainable change
            </p>
            <p className="framework-description">
              Every transformation moves through six distinct stages.
              <br />
              Understanding which stage your team is in — and what it needs — is
              the difference between change that stalls and change that scales.
            </p>
          </div>
          <div className="model-click-hint">
            <span className="hint-icon"></span> Click any segment to
            explore{" "}
          </div>
        </div>
        <div className="model-container">
          <div className="model-svg-wrapper">
            {/* PASTE YOUR ADAPTS DIAGRAM SVG HERE (the clickable pieces) */}
            <svg
              viewBox="0 0 789 319"
              fill="none"
              style={{ width: "100%", height: "auto", maxWidth: "100%" }}
            >
              {/* Replace with your SVG groups. Each clickable piece should have a class "adapts-piece" and a data-stage attribute */}
              <g
                className="adapts-piece"
                data-stage="alert"
                onClick={() => setActiveStage("alert")}
                style={{ cursor: "pointer" }}
              >
                <path
                  opacity="0.94"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M49.6719 34.001C53.9563 30.041 53.9602 26.5716 50.7754 20.1963C49.6463 18.2231 49 15.9373 49 13.501C49.0003 6.04536 55.0443 0.000976562 62.5 0.000976562C69.9557 0.000976563 75.9997 6.04536 76 13.501C75.9999 16.3767 75.0999 19.0425 73.5674 21.2324C72.2363 23.5997 68.6459 31.0732 74.5 34.001L125 34.001L125 83.6719C128.96 87.9566 132.429 87.9604 138.805 84.7754C140.778 83.6462 143.064 83 145.5 83C152.956 83 158.999 89.0446 159 96.5C159 103.956 152.956 110 145.5 110C142.624 110 139.959 109.1 137.769 107.567C135.401 106.236 127.928 102.647 125 108.5L125 159.001H74.6006C69.8388 156.025 73.4026 149.435 74.5762 147.528C74.6806 147.372 74.7824 147.213 74.8809 147.052C74.903 147.019 74.9141 147.001 74.9141 147.001H74.9111C76.2363 144.813 77 142.246 77 139.501C76.9997 131.493 70.508 125.001 62.5 125.001C54.492 125.001 48.0003 131.493 48 139.501C48 142.246 48.7629 144.813 50.0879 147.001H50.082C53.9999 153.501 51 158.001 49 159.001H0L0 108.602C2.97579 103.84 9.56578 107.404 11.4727 108.577C11.6295 108.682 11.7882 108.783 11.9492 108.882C11.9821 108.904 12 108.915 12 108.915V108.912C14.1883 110.237 16.755 111.001 19.5 111.001C27.5079 111.001 34 104.509 34 96.501C34 88.493 27.5079 82.0012 19.5 82.001C16.7552 82.001 14.1882 82.7639 12 84.0889V84.083C5.49986 88.0009 0.999853 85.001 0 83.001L0 34.001L49.6719 34.001Z"
                  fill="#0000FF"
                />
              </g>
              <g
                className="adapts-piece"
                data-stage="diagnose"
                onClick={() => setActiveStage("diagnose")}
                style={{ cursor: "pointer" }}
              >
                {/* path for Diagnose */}
                <path
                  opacity="0.94"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M251 209.673C254.96 213.957 258.429 213.961 264.805 210.776C266.778 209.647 269.064 209.001 271.5 209.001C278.956 209.001 285 215.045 285 222.501C285 229.957 278.956 236.001 271.5 236.001C268.624 236.001 265.958 235.101 263.769 233.568C261.401 232.237 253.928 228.647 251 234.501V285.001H201.329C197.044 288.961 197.041 292.43 200.226 298.806C201.355 300.779 202.001 303.065 202.001 305.501C202.001 312.956 195.956 319 188.501 319.001C181.045 319.001 175.001 312.957 175.001 305.501C175.001 302.625 175.901 299.96 177.434 297.77C178.765 295.402 182.354 287.929 176.501 285.001H125.999V160.001H176.399C181.161 162.977 177.597 169.567 176.424 171.474C176.319 171.63 176.218 171.789 176.119 171.95C176.097 171.983 176.086 172.001 176.086 172.001H176.089C174.764 174.189 174 176.756 174 179.501C174 187.509 180.492 194.001 188.5 194.001C196.508 194.001 203 187.509 203 179.501C203 176.756 202.237 174.189 200.912 172.001H200.918C197 165.501 200 161.001 202 160.001H251V209.673ZM145.5 208.001C142.755 208.001 140.188 208.764 138 210.089V210.083C131.5 214.001 127 211.001 126 209.001V234.602C128.976 229.84 135.566 233.404 137.473 234.577C137.629 234.682 137.788 234.783 137.949 234.882C137.982 234.904 138 234.915 138 234.915V234.912C140.188 236.237 142.755 237.001 145.5 237.001C153.508 237.001 160 230.509 160 222.501C160 214.493 153.508 208.001 145.5 208.001Z"
                  fill="#00006D"
                />
              </g>
              <g
                className="adapts-piece"
                data-stage="participate"
                onClick={() => setActiveStage("participate")}
                style={{ cursor: "pointer" }}
              >
                {/* path for Access */}
                <path
                  opacity="0.94"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M377.004 83.6729C380.964 87.9573 384.433 87.9612 390.809 84.7764C392.782 83.6472 395.068 83.001 397.504 83.001C404.96 83.0012 411.004 89.0453 411.004 96.501C411.004 103.957 404.96 110.001 397.504 110.001C394.628 110.001 391.962 109.101 389.772 107.568C387.405 106.237 379.932 102.647 377.004 108.501V159.001H327.333C323.048 162.961 323.045 166.43 326.229 172.806C327.359 174.779 328.005 177.065 328.005 179.501C328.005 186.956 321.96 193 314.505 193.001C307.049 193.001 301.005 186.957 301.005 179.501C301.005 176.625 301.905 173.96 303.438 171.77C304.769 169.402 308.358 161.929 302.505 159.001H252.004V108.602C254.98 103.84 261.57 107.404 263.477 108.577C263.633 108.682 263.792 108.783 263.953 108.882C263.986 108.904 264.004 108.915 264.004 108.915V108.912C266.192 110.237 268.759 111.001 271.504 111.001C279.512 111.001 286.004 104.509 286.004 96.501C286.004 88.493 279.512 82.0012 271.504 82.001C268.759 82.001 266.192 82.7639 264.004 84.0889V84.083C257.504 88.0009 253.004 85.001 252.004 83.001V34.001H302.403C307.165 36.9768 303.601 43.5668 302.428 45.4736C302.323 45.6305 302.221 45.7892 302.123 45.9502C302.101 45.9831 302.09 46.001 302.09 46.001H302.093C300.768 48.1893 300.004 50.756 300.004 53.501C300.004 61.5089 306.496 68.001 314.504 68.001C322.512 68.001 329.004 61.5089 329.004 53.501C329.004 50.7562 328.241 48.1892 326.916 46.001H326.922C323.004 39.5008 326.004 35.0008 328.004 34.001H377.004V83.6729Z"
                  fill="#0000FF"
                />
              </g>
              <g
                className="adapts-piece"
                data-stage="access"
                onClick={() => setActiveStage("access")}
                style={{ cursor: "pointer" }}
              >
                {/* path for Participate */}
                <path
                  opacity="0.94"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M427.672 160.001C431.956 156.041 431.96 152.572 428.775 146.196C427.646 144.223 427 141.937 427 139.501C427 132.045 433.044 126.001 440.5 126.001C447.956 126.001 454 132.045 454 139.501C454 142.377 453.1 145.043 451.567 147.232C450.236 149.6 446.646 157.073 452.5 160.001H503V209.672C506.96 213.957 510.429 213.96 516.805 210.775C518.778 209.646 521.064 209 523.5 209C530.956 209 536.999 215.045 537 222.5C537 229.956 530.956 236 523.5 236C520.624 236 517.959 235.1 515.769 233.567C513.401 232.236 505.928 228.647 503 234.5V285.001H452.601C447.839 282.025 451.403 275.435 452.576 273.528C452.681 273.372 452.782 273.213 452.881 273.052C452.903 273.019 452.914 273.001 452.914 273.001H452.911C454.236 270.813 455 268.246 455 265.501C455 257.493 448.508 251.001 440.5 251.001C432.492 251.001 426 257.493 426 265.501C426 268.246 426.763 270.813 428.088 273.001H428.082C432 279.501 429 284.001 427 285.001H378V234.602C380.976 229.84 387.566 233.404 389.473 234.577C389.629 234.682 389.788 234.783 389.949 234.882C389.982 234.904 390 234.915 390 234.915V234.912C392.188 236.237 394.755 237.001 397.5 237.001C405.508 237.001 412 230.509 412 222.501C412 214.493 405.508 208.001 397.5 208.001C394.755 208.001 392.188 208.764 390 210.089V210.083C383.5 214.001 379 211.001 378 209.001V160.001H427.672Z"
                  fill="#0F0F76"
                />
              </g>
              <g
                className="adapts-piece"
                data-stage="transform"
                onClick={() => setActiveStage("transform")}
                style={{ cursor: "pointer" }}
              >
                {/* path for Transform */}
                <path
                  opacity="0.94"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M629.003 83.6729C632.963 87.9573 636.432 87.9612 642.808 84.7764C644.781 83.6472 647.067 83.001 649.503 83.001C656.959 83.0012 663.003 89.0453 663.003 96.501C663.003 103.957 656.959 110.001 649.503 110.001C646.627 110.001 643.961 109.101 641.771 107.568C639.404 106.237 631.931 102.647 629.003 108.501V159.001H579.332C575.047 162.961 575.044 166.43 578.229 172.806C579.358 174.779 580.004 177.065 580.004 179.501C580.004 186.956 573.959 193 566.504 193.001C559.048 193.001 553.004 186.957 553.004 179.501C553.004 176.625 553.904 173.96 555.437 171.77C556.768 169.402 560.357 161.929 554.504 159.001H504.003V108.602C506.979 103.84 513.569 107.404 515.476 108.577C515.632 108.682 515.791 108.783 515.952 108.882C515.985 108.904 516.003 108.915 516.003 108.915V108.912C518.191 110.237 520.758 111.001 523.503 111.001C531.511 111.001 538.003 104.509 538.003 96.501C538.003 88.493 531.511 82.0012 523.503 82.001C520.758 82.001 518.191 82.7639 516.003 84.0889V84.083C509.503 88.0009 505.003 85.001 504.003 83.001V34.001H554.402C559.164 36.9768 555.6 43.5668 554.427 45.4736C554.322 45.6305 554.22 45.7892 554.122 45.9502C554.1 45.9831 554.089 46.001 554.089 46.001H554.092C552.767 48.1893 552.003 50.756 552.003 53.501C552.003 61.5089 558.495 68.001 566.503 68.001C574.511 68.001 581.003 61.5089 581.003 53.501C581.003 50.7562 580.24 48.1892 578.915 46.001H578.921C575.003 39.5008 578.003 35.0008 580.003 34.001H629.003V83.6729Z"
                  fill="#0000FF"
                />
              </g>
              <g
                className="adapts-piece"
                data-stage="scale"
                onClick={() => setActiveStage("scale")}
                style={{ cursor: "pointer" }}
              >
                {/* path for Scale */}
                <path
                  opacity="0.94"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M679.672 159.001C683.956 155.041 683.96 151.572 680.775 145.196C679.646 143.223 679 140.937 679 138.501C679 131.045 685.044 125.001 692.5 125.001C699.956 125.001 706 131.045 706 138.501C706 141.377 705.1 144.043 703.567 146.232C702.236 148.6 698.646 156.073 704.5 159.001H755V208.672C758.96 212.957 762.429 212.96 768.805 209.775C770.778 208.646 773.064 208 775.5 208C782.956 208 788.999 214.045 789 221.5C789 228.956 782.956 235 775.5 235C772.624 235 769.959 234.1 767.769 232.567C765.401 231.236 757.928 227.647 755 233.5V284.001H704.601C699.839 281.025 703.403 274.435 704.576 272.528C704.681 272.372 704.782 272.213 704.881 272.052C704.903 272.019 704.914 272.001 704.914 272.001H704.911C706.236 269.813 707 267.246 707 264.501C707 256.493 700.508 250.001 692.5 250.001C684.492 250.001 678 256.493 678 264.501C678 267.246 678.763 269.813 680.088 272.001H680.082C684 278.501 681 283.001 679 284.001H630V233.602C632.976 228.84 639.566 232.404 641.473 233.577C641.629 233.682 641.788 233.783 641.949 233.882C641.982 233.904 642 233.915 642 233.915V233.912C644.188 235.237 646.755 236.001 649.5 236.001C657.508 236.001 664 229.509 664 221.501C664 213.493 657.508 207.001 649.5 207.001C646.755 207.001 644.188 207.764 642 209.089V209.083C635.5 213.001 631 210.001 630 208.001V159.001H679.672Z"
                  fill="#1D1D7E"
                />
              </g>
              <g className="adapts-piece" data-stage="alert">
                <path
                  d="M56.6051 110.001H50.9801L61.2216 80.9101H67.7273L77.983 110.001H72.358L64.5881 86.876H64.3608L56.6051 110.001ZM56.7898 98.5947H72.1307V102.828H56.7898V98.5947Z"
                  fill="white"
                />
              </g>
              <path
                opacity="0.32"
                d="M149.136 138.001H145.933V128.546H149.201C150.14 128.546 150.946 128.736 151.62 129.114C152.297 129.49 152.817 130.03 153.18 130.735C153.544 131.439 153.725 132.283 153.725 133.264C153.725 134.249 153.542 135.096 153.176 135.804C152.813 136.511 152.288 137.055 151.602 137.433C150.918 137.812 150.097 138.001 149.136 138.001ZM147.645 136.519H149.053C149.712 136.519 150.261 136.399 150.701 136.159C151.141 135.916 151.472 135.554 151.694 135.074C151.915 134.591 152.026 133.988 152.026 133.264C152.026 132.541 151.915 131.941 151.694 131.464C151.472 130.984 151.145 130.625 150.711 130.388C150.28 130.148 149.744 130.028 149.104 130.028H147.645V136.519ZM155.279 138.001V130.91H156.95V138.001H155.279ZM156.119 129.904C155.854 129.904 155.626 129.816 155.436 129.641C155.245 129.462 155.149 129.248 155.149 128.999C155.149 128.746 155.245 128.533 155.436 128.357C155.626 128.179 155.854 128.089 156.119 128.089C156.387 128.089 156.614 128.179 156.802 128.357C156.993 128.533 157.088 128.746 157.088 128.999C157.088 129.248 156.993 129.462 156.802 129.641C156.614 129.816 156.387 129.904 156.119 129.904ZM160.709 138.144C160.259 138.144 159.855 138.064 159.495 137.904C159.138 137.741 158.854 137.501 158.645 137.184C158.439 136.867 158.336 136.476 158.336 136.011C158.336 135.611 158.41 135.28 158.557 135.019C158.705 134.757 158.907 134.548 159.162 134.391C159.418 134.234 159.705 134.115 160.025 134.035C160.349 133.952 160.683 133.892 161.027 133.855C161.443 133.812 161.78 133.774 162.038 133.74C162.297 133.703 162.485 133.648 162.601 133.574C162.722 133.497 162.782 133.378 162.782 133.218V133.191C162.782 132.843 162.678 132.574 162.472 132.383C162.266 132.192 161.969 132.097 161.581 132.097C161.172 132.097 160.847 132.186 160.607 132.364C160.37 132.543 160.21 132.754 160.127 132.997L158.567 132.775C158.69 132.344 158.893 131.984 159.176 131.695C159.459 131.402 159.805 131.184 160.215 131.039C160.624 130.892 161.076 130.818 161.572 130.818C161.914 130.818 162.254 130.858 162.592 130.938C162.931 131.018 163.24 131.15 163.52 131.335C163.8 131.516 164.025 131.764 164.194 132.078C164.367 132.392 164.453 132.784 164.453 133.255V138.001H162.846V137.027H162.791C162.689 137.224 162.546 137.409 162.361 137.581C162.18 137.75 161.951 137.887 161.674 137.992C161.4 138.093 161.078 138.144 160.709 138.144ZM161.143 136.916C161.478 136.916 161.769 136.85 162.015 136.718C162.261 136.582 162.451 136.404 162.583 136.182C162.718 135.96 162.786 135.719 162.786 135.457V134.622C162.734 134.665 162.645 134.705 162.518 134.742C162.395 134.779 162.257 134.811 162.103 134.839C161.949 134.866 161.797 134.891 161.646 134.913C161.495 134.934 161.364 134.953 161.253 134.968C161.004 135.002 160.781 135.057 160.584 135.134C160.387 135.211 160.232 135.319 160.118 135.457C160.004 135.593 159.947 135.768 159.947 135.984C159.947 136.291 160.059 136.524 160.284 136.681C160.509 136.838 160.795 136.916 161.143 136.916ZM169.217 140.808C168.617 140.808 168.101 140.726 167.67 140.563C167.239 140.403 166.893 140.188 166.632 139.917C166.37 139.646 166.188 139.346 166.087 139.017L167.592 138.652C167.66 138.79 167.758 138.927 167.887 139.063C168.017 139.201 168.19 139.315 168.409 139.404C168.631 139.497 168.909 139.543 169.245 139.543C169.719 139.543 170.111 139.427 170.422 139.197C170.733 138.969 170.888 138.593 170.888 138.07V136.727H170.805C170.719 136.899 170.593 137.076 170.426 137.258C170.263 137.439 170.046 137.592 169.775 137.715C169.508 137.838 169.171 137.899 168.764 137.899C168.22 137.899 167.726 137.772 167.283 137.516C166.842 137.258 166.492 136.873 166.23 136.362C165.972 135.848 165.842 135.205 165.842 134.432C165.842 133.654 165.972 132.997 166.23 132.461C166.492 131.923 166.844 131.515 167.287 131.238C167.73 130.958 168.224 130.818 168.769 130.818C169.185 130.818 169.526 130.889 169.794 131.03C170.065 131.169 170.28 131.336 170.44 131.533C170.6 131.727 170.722 131.91 170.805 132.083H170.897V130.91H172.545V138.116C172.545 138.723 172.401 139.224 172.111 139.621C171.822 140.018 171.427 140.315 170.925 140.512C170.423 140.709 169.854 140.808 169.217 140.808ZM169.231 136.588C169.585 136.588 169.886 136.502 170.136 136.33C170.385 136.157 170.574 135.91 170.703 135.587C170.833 135.263 170.897 134.876 170.897 134.423C170.897 133.977 170.833 133.586 170.703 133.251C170.577 132.915 170.389 132.655 170.14 132.47C169.894 132.283 169.591 132.189 169.231 132.189C168.858 132.189 168.547 132.286 168.298 132.48C168.049 132.674 167.861 132.94 167.735 133.278C167.609 133.614 167.546 133.995 167.546 134.423C167.546 134.857 167.609 135.237 167.735 135.563C167.864 135.887 168.054 136.139 168.303 136.321C168.555 136.499 168.864 136.588 169.231 136.588ZM175.929 133.846V138.001H174.258V130.91H175.855V132.115H175.938C176.102 131.718 176.362 131.402 176.719 131.169C177.079 130.935 177.523 130.818 178.053 130.818C178.542 130.818 178.968 130.922 179.332 131.132C179.698 131.341 179.981 131.644 180.181 132.041C180.384 132.438 180.484 132.92 180.481 133.486V138.001H178.81V133.745C178.81 133.271 178.687 132.9 178.441 132.632C178.197 132.364 177.86 132.23 177.43 132.23C177.137 132.23 176.877 132.295 176.649 132.424C176.425 132.55 176.248 132.734 176.119 132.974C175.992 133.214 175.929 133.505 175.929 133.846ZM185.273 138.139C184.581 138.139 183.98 137.987 183.473 137.682C182.965 137.378 182.571 136.951 182.291 136.404C182.014 135.856 181.875 135.216 181.875 134.483C181.875 133.751 182.014 133.109 182.291 132.558C182.571 132.007 182.965 131.579 183.473 131.275C183.98 130.97 184.581 130.818 185.273 130.818C185.965 130.818 186.566 130.97 187.073 131.275C187.581 131.579 187.974 132.007 188.251 132.558C188.531 133.109 188.671 133.751 188.671 134.483C188.671 135.216 188.531 135.856 188.251 136.404C187.974 136.951 187.581 137.378 187.073 137.682C186.566 137.987 185.965 138.139 185.273 138.139ZM185.282 136.801C185.658 136.801 185.972 136.698 186.224 136.491C186.476 136.282 186.664 136.002 186.787 135.651C186.913 135.3 186.976 134.909 186.976 134.479C186.976 134.045 186.913 133.652 186.787 133.301C186.664 132.947 186.476 132.666 186.224 132.457C185.972 132.247 185.658 132.143 185.282 132.143C184.898 132.143 184.577 132.247 184.322 132.457C184.07 132.666 183.88 132.947 183.754 133.301C183.631 133.652 183.57 134.045 183.57 134.479C183.57 134.909 183.631 135.3 183.754 135.651C183.88 136.002 184.07 136.282 184.322 136.491C184.577 136.698 184.898 136.801 185.282 136.801ZM195.694 132.784L194.17 132.951C194.127 132.797 194.052 132.652 193.944 132.517C193.839 132.381 193.698 132.272 193.519 132.189C193.341 132.106 193.122 132.064 192.864 132.064C192.516 132.064 192.223 132.14 191.987 132.29C191.753 132.441 191.637 132.637 191.64 132.877C191.637 133.083 191.713 133.251 191.866 133.38C192.023 133.509 192.282 133.615 192.642 133.698L193.852 133.957C194.522 134.102 195.021 134.331 195.347 134.645C195.677 134.959 195.843 135.37 195.846 135.877C195.843 136.324 195.712 136.718 195.453 137.059C195.198 137.398 194.843 137.662 194.387 137.853C193.932 138.044 193.408 138.139 192.817 138.139C191.95 138.139 191.251 137.958 190.722 137.595C190.192 137.228 189.877 136.719 189.775 136.067L191.405 135.91C191.479 136.23 191.636 136.471 191.876 136.634C192.116 136.798 192.428 136.879 192.813 136.879C193.21 136.879 193.528 136.798 193.768 136.634C194.012 136.471 194.133 136.27 194.133 136.03C194.133 135.827 194.055 135.659 193.898 135.527C193.744 135.394 193.504 135.293 193.178 135.222L191.968 134.968C191.288 134.826 190.785 134.588 190.458 134.252C190.132 133.914 189.971 133.486 189.974 132.969C189.971 132.532 190.089 132.153 190.329 131.833C190.572 131.51 190.909 131.261 191.34 131.085C191.774 130.907 192.274 130.818 192.841 130.818C193.672 130.818 194.326 130.995 194.803 131.349C195.283 131.703 195.58 132.181 195.694 132.784ZM200.363 138.139C199.652 138.139 199.038 137.992 198.521 137.696C198.007 137.398 197.612 136.976 197.335 136.431C197.058 135.884 196.919 135.239 196.919 134.497C196.919 133.768 197.058 133.128 197.335 132.577C197.615 132.023 198.006 131.592 198.507 131.284C199.009 130.973 199.598 130.818 200.275 130.818C200.712 130.818 201.125 130.889 201.513 131.03C201.903 131.169 202.248 131.384 202.547 131.676C202.848 131.969 203.085 132.341 203.258 132.794C203.43 133.243 203.516 133.778 203.516 134.4V134.913H197.704V133.786H201.914C201.911 133.466 201.842 133.181 201.706 132.932C201.571 132.68 201.382 132.481 201.139 132.337C200.899 132.192 200.619 132.12 200.298 132.12C199.957 132.12 199.657 132.203 199.398 132.369C199.14 132.532 198.938 132.747 198.794 133.015C198.652 133.28 198.58 133.571 198.577 133.888V134.871C198.577 135.283 198.652 135.637 198.803 135.933C198.954 136.225 199.164 136.45 199.435 136.607C199.706 136.761 200.023 136.838 200.386 136.838C200.629 136.838 200.849 136.804 201.046 136.736C201.243 136.665 201.414 136.562 201.559 136.427C201.703 136.291 201.813 136.124 201.887 135.924L203.447 136.099C203.348 136.511 203.161 136.871 202.884 137.179C202.61 137.484 202.259 137.721 201.831 137.89C201.403 138.056 200.914 138.139 200.363 138.139Z"
                fill="black"
              />
              <path
                opacity="0.32"
                d="M391.147 68.001H389.319L392.647 58.5464H394.761L398.094 68.001H396.266L393.741 60.4854H393.667L391.147 68.001ZM391.207 64.2939H396.192V65.6697H391.207V64.2939ZM402.143 68.1395C401.435 68.1395 400.827 67.984 400.32 67.6732C399.815 67.3624 399.426 66.933 399.152 66.3852C398.881 65.8343 398.745 65.2003 398.745 64.4832C398.745 63.7631 398.884 63.1275 399.161 62.5766C399.438 62.0226 399.829 61.5918 400.333 61.284C400.841 60.9732 401.441 60.8177 402.134 60.8177C402.709 60.8177 403.219 60.9239 403.662 61.1363C404.108 61.3456 404.464 61.6425 404.728 62.0273C404.993 62.4089 405.144 62.8551 405.181 63.366H403.583C403.519 63.0244 403.365 62.7397 403.122 62.512C402.882 62.2812 402.56 62.1657 402.157 62.1657C401.815 62.1657 401.515 62.2581 401.257 62.4427C400.998 62.6243 400.797 62.8859 400.652 63.2275C400.51 63.5692 400.44 63.9785 400.44 64.4555C400.44 64.9387 400.51 65.3542 400.652 65.702C400.794 66.0467 400.992 66.3129 401.248 66.5006C401.506 66.6853 401.809 66.7776 402.157 66.7776C402.403 66.7776 402.623 66.7314 402.817 66.6391C403.014 66.5437 403.179 66.4068 403.311 66.2282C403.443 66.0497 403.534 65.8328 403.583 65.5773H405.181C405.141 66.079 404.993 66.5237 404.738 66.9115C404.482 67.2962 404.134 67.5978 403.694 67.8163C403.254 68.0318 402.737 68.1395 402.143 68.1395ZM409.646 68.1395C408.938 68.1395 408.33 67.984 407.823 67.6732C407.318 67.3624 406.928 66.933 406.655 66.3852C406.384 65.8343 406.248 65.2003 406.248 64.4832C406.248 63.7631 406.387 63.1275 406.664 62.5766C406.941 62.0226 407.332 61.5918 407.836 61.284C408.344 60.9732 408.944 60.8177 409.637 60.8177C410.212 60.8177 410.722 60.9239 411.165 61.1363C411.611 61.3456 411.967 61.6425 412.231 62.0273C412.496 62.4089 412.647 62.8551 412.684 63.366H411.086C411.022 63.0244 410.868 62.7397 410.625 62.512C410.385 62.2812 410.063 62.1657 409.66 62.1657C409.318 62.1657 409.018 62.2581 408.76 62.4427C408.501 62.6243 408.3 62.8859 408.155 63.2275C408.013 63.5692 407.943 63.9785 407.943 64.4555C407.943 64.9387 408.013 65.3542 408.155 65.702C408.296 66.0467 408.495 66.3129 408.75 66.5006C409.009 66.6853 409.312 66.7776 409.66 66.7776C409.906 66.7776 410.126 66.7314 410.32 66.6391C410.517 66.5437 410.682 66.4068 410.814 66.2282C410.946 66.0497 411.037 65.8328 411.086 65.5773H412.684C412.644 66.079 412.496 66.5237 412.241 66.9115C411.985 67.2962 411.637 67.5978 411.197 67.8163C410.757 68.0318 410.24 68.1395 409.646 68.1395ZM417.195 68.1395C416.484 68.1395 415.87 67.9917 415.353 67.6963C414.839 67.3978 414.444 66.9761 414.167 66.4314C413.89 65.8836 413.751 65.2388 413.751 64.4971C413.751 63.7677 413.89 63.1275 414.167 62.5766C414.447 62.0226 414.838 61.5918 415.339 61.284C415.841 60.9732 416.43 60.8177 417.107 60.8177C417.544 60.8177 417.957 60.8885 418.345 61.0301C418.735 61.1686 419.08 61.384 419.379 61.6764C419.68 61.9688 419.917 62.3412 420.09 62.7936C420.262 63.2429 420.348 63.7784 420.348 64.4001V64.9126H414.536V63.7861H418.746C418.743 63.4661 418.674 63.1814 418.539 62.9321C418.403 62.6797 418.214 62.4812 417.971 62.3366C417.731 62.1919 417.451 62.1196 417.131 62.1196C416.789 62.1196 416.489 62.2027 416.23 62.3689C415.972 62.532 415.77 62.7474 415.626 63.0152C415.484 63.2799 415.412 63.5707 415.409 63.8877V64.871C415.409 65.2834 415.484 65.6373 415.635 65.9328C415.786 66.2252 415.996 66.4498 416.267 66.6068C416.538 66.7607 416.855 66.8376 417.218 66.8376C417.461 66.8376 417.681 66.8038 417.878 66.7361C418.075 66.6653 418.246 66.5622 418.391 66.4268C418.535 66.2913 418.645 66.1236 418.719 65.9236L420.279 66.099C420.18 66.5114 419.993 66.8715 419.716 67.1792C419.442 67.4839 419.091 67.7209 418.663 67.8902C418.235 68.0564 417.746 68.1395 417.195 68.1395ZM427.366 62.7844L425.843 62.9506C425.8 62.7967 425.724 62.652 425.617 62.5166C425.512 62.3812 425.371 62.2719 425.192 62.1888C425.014 62.1057 424.795 62.0642 424.536 62.0642C424.189 62.0642 423.896 62.1396 423.659 62.2904C423.425 62.4412 423.31 62.6366 423.313 62.8767C423.31 63.0829 423.385 63.2506 423.539 63.3799C423.696 63.5091 423.955 63.6153 424.315 63.6984L425.524 63.9569C426.195 64.1016 426.694 64.3309 427.02 64.6448C427.349 64.9587 427.516 65.3696 427.519 65.8774C427.516 66.3237 427.385 66.7176 427.126 67.0592C426.871 67.3978 426.515 67.6624 426.06 67.8532C425.604 68.0441 425.081 68.1395 424.49 68.1395C423.622 68.1395 422.924 67.9579 422.394 67.5947C421.865 67.2285 421.55 66.7191 421.448 66.0667L423.078 65.9097C423.152 66.2298 423.309 66.4714 423.549 66.6345C423.789 66.7976 424.101 66.8792 424.486 66.8792C424.883 66.8792 425.201 66.7976 425.441 66.6345C425.684 66.4714 425.806 66.2698 425.806 66.0297C425.806 65.8266 425.728 65.6589 425.571 65.5265C425.417 65.3942 425.177 65.2926 424.85 65.2219L423.641 64.968C422.961 64.8264 422.458 64.5879 422.131 64.2524C421.805 63.9139 421.643 63.4861 421.647 62.969C421.643 62.532 421.762 62.1534 422.002 61.8334C422.245 61.5102 422.582 61.2609 423.013 61.0855C423.447 60.907 423.947 60.8177 424.513 60.8177C425.344 60.8177 425.998 60.9947 426.475 61.3486C426.956 61.7026 427.253 62.1811 427.366 62.7844ZM434.501 62.7844L432.978 62.9506C432.935 62.7967 432.859 62.652 432.752 62.5166C432.647 62.3812 432.505 62.2719 432.327 62.1888C432.148 62.1057 431.93 62.0642 431.671 62.0642C431.323 62.0642 431.031 62.1396 430.794 62.2904C430.56 62.4412 430.445 62.6366 430.448 62.8767C430.445 63.0829 430.52 63.2506 430.674 63.3799C430.831 63.5091 431.09 63.6153 431.45 63.6984L432.659 63.9569C433.33 64.1016 433.829 64.3309 434.155 64.6448C434.484 64.9587 434.65 65.3696 434.653 65.8774C434.65 66.3237 434.52 66.7176 434.261 67.0592C434.006 67.3978 433.65 67.6624 433.195 67.8532C432.739 68.0441 432.216 68.1395 431.625 68.1395C430.757 68.1395 430.059 67.9579 429.529 67.5947C429 67.2285 428.684 66.7191 428.583 66.0667L430.212 65.9097C430.286 66.2298 430.443 66.4714 430.683 66.6345C430.923 66.7976 431.236 66.8792 431.62 66.8792C432.017 66.8792 432.336 66.7976 432.576 66.6345C432.819 66.4714 432.941 66.2698 432.941 66.0297C432.941 65.8266 432.862 65.6589 432.705 65.5265C432.551 65.3942 432.311 65.2926 431.985 65.2219L430.776 64.968C430.095 64.8264 429.592 64.5879 429.266 64.2524C428.94 63.9139 428.778 63.4861 428.781 62.969C428.778 62.532 428.897 62.1534 429.137 61.8334C429.38 61.5102 429.717 61.2609 430.148 61.0855C430.582 60.907 431.082 60.8177 431.648 60.8177C432.479 60.8177 433.133 60.9947 433.61 61.3486C434.09 61.7026 434.387 62.1811 434.501 62.7844ZM439.256 68.001V60.9101H440.877V62.0919H440.95C441.08 61.6826 441.301 61.3671 441.615 61.1455C441.932 60.9208 442.294 60.8085 442.7 60.8085C442.792 60.8085 442.895 60.8131 443.009 60.8224C443.126 60.8285 443.223 60.8393 443.3 60.8547V62.392C443.229 62.3673 443.117 62.3458 442.963 62.3273C442.812 62.3058 442.666 62.295 442.525 62.295C442.22 62.295 441.946 62.3612 441.703 62.4935C441.463 62.6228 441.274 62.8028 441.135 63.0336C440.997 63.2645 440.927 63.5307 440.927 63.8323V68.001H439.256ZM447.258 68.1395C446.547 68.1395 445.933 67.9917 445.416 67.6963C444.902 67.3978 444.506 66.9761 444.229 66.4314C443.952 65.8836 443.814 65.2388 443.814 64.4971C443.814 63.7677 443.952 63.1275 444.229 62.5766C444.509 62.0226 444.9 61.5918 445.402 61.284C445.903 60.9732 446.493 60.8177 447.17 60.8177C447.607 60.8177 448.019 60.8885 448.407 61.0301C448.798 61.1686 449.143 61.384 449.441 61.6764C449.743 61.9688 449.98 62.3412 450.152 62.7936C450.325 63.2429 450.411 63.7784 450.411 64.4001V64.9126H444.599V63.7861H448.809C448.806 63.4661 448.736 63.1814 448.601 62.9321C448.466 62.6797 448.276 62.4812 448.033 62.3366C447.793 62.1919 447.513 62.1196 447.193 62.1196C446.851 62.1196 446.551 62.2027 446.293 62.3689C446.034 62.532 445.833 62.7474 445.688 63.0152C445.546 63.2799 445.474 63.5707 445.471 63.8877V64.871C445.471 65.2834 445.546 65.6373 445.697 65.9328C445.848 66.2252 446.059 66.4498 446.33 66.6068C446.601 66.7607 446.918 66.8376 447.281 66.8376C447.524 66.8376 447.744 66.8038 447.941 66.7361C448.138 66.6653 448.309 66.5622 448.453 66.4268C448.598 66.2913 448.707 66.1236 448.781 65.9236L450.341 66.099C450.243 66.5114 450.055 66.8715 449.778 67.1792C449.504 67.4839 449.153 67.7209 448.726 67.8902C448.298 68.0564 447.809 68.1395 447.258 68.1395ZM453.865 68.1441C453.416 68.1441 453.011 68.0641 452.651 67.904C452.294 67.7409 452.011 67.5009 451.801 67.1839C451.595 66.8669 451.492 66.476 451.492 66.0113C451.492 65.6112 451.566 65.2803 451.714 65.0187C451.861 64.7571 452.063 64.5479 452.318 64.3909C452.574 64.2339 452.862 64.1154 453.182 64.0354C453.505 63.9523 453.839 63.8923 454.184 63.8554C454.599 63.8123 454.936 63.7738 455.195 63.74C455.453 63.703 455.641 63.6476 455.758 63.5738C455.878 63.4968 455.938 63.3783 455.938 63.2183V63.1906C455.938 62.8428 455.835 62.5735 455.628 62.3827C455.422 62.1919 455.125 62.0965 454.737 62.0965C454.328 62.0965 454.003 62.1858 453.763 62.3643C453.526 62.5428 453.366 62.7536 453.283 62.9967L451.723 62.7751C451.846 62.3443 452.049 61.9842 452.332 61.6949C452.615 61.4025 452.962 61.184 453.371 61.0393C453.78 60.8916 454.233 60.8177 454.728 60.8177C455.07 60.8177 455.41 60.8577 455.748 60.9378C456.087 61.0178 456.396 61.1501 456.676 61.3348C456.956 61.5164 457.181 61.7641 457.35 62.078C457.523 62.392 457.609 62.7844 457.609 63.2552V68.001H456.002V67.0269H455.947C455.845 67.2239 455.702 67.4085 455.518 67.5809C455.336 67.7501 455.107 67.8871 454.83 67.9917C454.556 68.0933 454.234 68.1441 453.865 68.1441ZM454.299 66.9161C454.634 66.9161 454.925 66.8499 455.171 66.7176C455.418 66.5822 455.607 66.4037 455.739 66.1821C455.875 65.9605 455.942 65.7189 455.942 65.4573V64.6217C455.89 64.6648 455.801 64.7048 455.675 64.7417C455.552 64.7787 455.413 64.811 455.259 64.8387C455.105 64.8664 454.953 64.891 454.802 64.9126C454.651 64.9341 454.521 64.9526 454.41 64.968C454.16 65.0018 453.937 65.0572 453.74 65.1341C453.543 65.2111 453.388 65.3188 453.274 65.4573C453.16 65.5927 453.103 65.7681 453.103 65.9836C453.103 66.2913 453.216 66.5237 453.44 66.6807C453.665 66.8376 453.951 66.9161 454.299 66.9161ZM461.921 68.1256C461.364 68.1256 460.865 67.9825 460.425 67.6963C459.985 67.4101 459.637 66.9946 459.382 66.4498C459.126 65.9051 458.998 65.2434 458.998 64.4648C458.998 63.6769 459.128 63.0121 459.386 62.4704C459.648 61.9257 460 61.5148 460.443 61.2378C460.887 60.9578 461.381 60.8177 461.925 60.8177C462.341 60.8177 462.682 60.8885 462.95 61.0301C463.218 61.1686 463.43 61.3363 463.587 61.5333C463.744 61.7272 463.866 61.9103 463.952 62.0827H464.021V58.5464H465.697V68.001H464.054V66.8838H463.952C463.866 67.0561 463.741 67.2393 463.578 67.4331C463.415 67.624 463.199 67.7871 462.932 67.9225C462.664 68.0579 462.327 68.1256 461.921 68.1256ZM462.387 66.7545C462.741 66.7545 463.043 66.6591 463.292 66.4683C463.541 66.2744 463.73 66.0051 463.86 65.6604C463.989 65.3157 464.054 64.9141 464.054 64.4555C464.054 63.997 463.989 63.5984 463.86 63.2599C463.733 62.9213 463.546 62.6582 463.296 62.4704C463.05 62.2827 462.747 62.1888 462.387 62.1888C462.015 62.1888 461.704 62.2858 461.454 62.4797C461.205 62.6736 461.017 62.9413 460.891 63.2829C460.765 63.6246 460.702 64.0154 460.702 64.4555C460.702 64.8987 460.765 65.2942 460.891 65.642C461.021 65.9867 461.21 66.259 461.459 66.4591C461.711 66.656 462.021 66.7545 462.387 66.7545ZM467.478 68.001V60.9101H469.149V68.001H467.478ZM468.318 59.9037C468.053 59.9037 467.826 59.816 467.635 59.6405C467.444 59.462 467.349 59.2481 467.349 58.9988C467.349 58.7465 467.444 58.5326 467.635 58.3572C467.826 58.1787 468.053 58.0894 468.318 58.0894C468.586 58.0894 468.814 58.1787 469.001 58.3572C469.192 58.5326 469.287 58.7465 469.287 58.9988C469.287 59.2481 469.192 59.462 469.001 59.6405C468.814 59.816 468.586 59.9037 468.318 59.9037ZM472.539 63.8461V68.001H470.867V60.9101H472.465V62.115H472.548C472.711 61.718 472.971 61.4025 473.328 61.1686C473.688 60.9347 474.133 60.8177 474.662 60.8177C475.152 60.8177 475.578 60.9224 475.941 61.1317C476.307 61.3409 476.59 61.6441 476.79 62.0411C476.994 62.4381 477.094 62.9198 477.09 63.4861V68.001H475.419V63.7446C475.419 63.2706 475.296 62.8998 475.05 62.632C474.807 62.3643 474.47 62.2304 474.039 62.2304C473.747 62.2304 473.487 62.295 473.259 62.4243C473.034 62.5505 472.857 62.7336 472.728 62.9736C472.602 63.2137 472.539 63.5045 472.539 63.8461ZM481.929 68.1395C481.218 68.1395 480.604 67.9917 480.087 67.6963C479.573 67.3978 479.177 66.9761 478.9 66.4314C478.623 65.8836 478.485 65.2388 478.485 64.4971C478.485 63.7677 478.623 63.1275 478.9 62.5766C479.18 62.0226 479.571 61.5918 480.073 61.284C480.574 60.9732 481.164 60.8177 481.841 60.8177C482.278 60.8177 482.69 60.8885 483.078 61.0301C483.469 61.1686 483.814 61.384 484.112 61.6764C484.414 61.9688 484.651 62.3412 484.823 62.7936C484.995 63.2429 485.082 63.7784 485.082 64.4001V64.9126H479.269V63.7861H483.48C483.477 63.4661 483.407 63.1814 483.272 62.9321C483.137 62.6797 482.947 62.4812 482.704 62.3366C482.464 62.1919 482.184 62.1196 481.864 62.1196C481.522 62.1196 481.222 62.2027 480.964 62.3689C480.705 62.532 480.504 62.7474 480.359 63.0152C480.217 63.2799 480.145 63.5707 480.142 63.8877V64.871C480.142 65.2834 480.217 65.6373 480.368 65.9328C480.519 66.2252 480.73 66.4498 481.001 66.6068C481.271 66.7607 481.588 66.8376 481.952 66.8376C482.195 66.8376 482.415 66.8038 482.612 66.7361C482.809 66.6653 482.98 66.5622 483.124 66.4268C483.269 66.2913 483.378 66.1236 483.452 65.9236L485.012 66.099C484.914 66.5114 484.726 66.8715 484.449 67.1792C484.175 67.4839 483.824 67.7209 483.397 67.8902C482.969 68.0564 482.479 68.1395 481.929 68.1395ZM492.1 62.7844L490.576 62.9506C490.533 62.7967 490.458 62.652 490.35 62.5166C490.246 62.3812 490.104 62.2719 489.925 62.1888C489.747 62.1057 489.528 62.0642 489.27 62.0642C488.922 62.0642 488.63 62.1396 488.393 62.2904C488.159 62.4412 488.043 62.6366 488.047 62.8767C488.043 63.0829 488.119 63.2506 488.273 63.3799C488.43 63.5091 488.688 63.6153 489.048 63.6984L490.258 63.9569C490.929 64.1016 491.427 64.3309 491.754 64.6448C492.083 64.9587 492.249 65.3696 492.252 65.8774C492.249 66.3237 492.118 66.7176 491.86 67.0592C491.604 67.3978 491.249 67.6624 490.793 67.8532C490.338 68.0441 489.815 68.1395 489.224 68.1395C488.356 68.1395 487.657 67.9579 487.128 67.5947C486.598 67.2285 486.283 66.7191 486.181 66.0667L487.811 65.9097C487.885 66.2298 488.042 66.4714 488.282 66.6345C488.522 66.7976 488.834 66.8792 489.219 66.8792C489.616 66.8792 489.935 66.7976 490.175 66.6345C490.418 66.4714 490.539 66.2698 490.539 66.0297C490.539 65.8266 490.461 65.6589 490.304 65.5265C490.15 65.3942 489.91 65.2926 489.584 65.2219L488.374 64.968C487.694 64.8264 487.191 64.5879 486.865 64.2524C486.538 63.9139 486.377 63.4861 486.38 62.969C486.377 62.532 486.495 62.1534 486.735 61.8334C486.979 61.5102 487.316 61.2609 487.746 61.0855C488.18 60.907 488.681 60.8177 489.247 60.8177C490.078 60.8177 490.732 60.9947 491.209 61.3486C491.689 61.7026 491.986 62.1811 492.1 62.7844ZM499.235 62.7844L497.711 62.9506C497.668 62.7967 497.593 62.652 497.485 62.5166C497.38 62.3812 497.239 62.2719 497.06 62.1888C496.882 62.1057 496.663 62.0642 496.405 62.0642C496.057 62.0642 495.765 62.1396 495.528 62.2904C495.294 62.4412 495.178 62.6366 495.181 62.8767C495.178 63.0829 495.254 63.2506 495.407 63.3799C495.564 63.5091 495.823 63.6153 496.183 63.6984L497.393 63.9569C498.064 64.1016 498.562 64.3309 498.888 64.6448C499.218 64.9587 499.384 65.3696 499.387 65.8774C499.384 66.3237 499.253 66.7176 498.994 67.0592C498.739 67.3978 498.384 67.6624 497.928 67.8532C497.473 68.0441 496.949 68.1395 496.358 68.1395C495.491 68.1395 494.792 67.9579 494.263 67.5947C493.733 67.2285 493.418 66.7191 493.316 66.0667L494.946 65.9097C495.02 66.2298 495.177 66.4714 495.417 66.6345C495.657 66.7976 495.969 66.8792 496.354 66.8792C496.751 66.8792 497.069 66.7976 497.309 66.6345C497.553 66.4714 497.674 66.2698 497.674 66.0297C497.674 65.8266 497.596 65.6589 497.439 65.5265C497.285 65.3942 497.045 65.2926 496.719 65.2219L495.509 64.968C494.829 64.8264 494.326 64.5879 493.999 64.2524C493.673 63.9139 493.512 63.4861 493.515 62.969C493.512 62.532 493.63 62.1534 493.87 61.8334C494.113 61.5102 494.45 61.2609 494.881 61.0855C495.315 60.907 495.815 60.8177 496.382 60.8177C497.213 60.8177 497.867 60.9947 498.344 61.3486C498.824 61.7026 499.121 62.1811 499.235 62.7844Z"
                fill="black"
              />
              <path
                opacity="0.32"
                d="M538.933 215.001V205.546H542.478C543.204 205.546 543.814 205.682 544.306 205.953C544.802 206.224 545.176 206.596 545.428 207.07C545.683 207.541 545.811 208.076 545.811 208.676C545.811 209.283 545.683 209.821 545.428 210.292C545.172 210.763 544.795 211.134 544.297 211.405C543.798 211.672 543.184 211.806 542.455 211.806H540.105V210.398H542.224C542.649 210.398 542.997 210.324 543.267 210.177C543.538 210.029 543.738 209.826 543.868 209.567C544 209.309 544.066 209.012 544.066 208.676C544.066 208.341 544 208.045 543.868 207.79C543.738 207.535 543.537 207.336 543.263 207.195C542.992 207.05 542.643 206.978 542.215 206.978H540.645V215.001H538.933ZM549.138 215.144C548.689 215.144 548.284 215.064 547.924 214.904C547.567 214.741 547.284 214.501 547.075 214.184C546.869 213.867 546.766 213.476 546.766 213.011C546.766 212.611 546.839 212.28 546.987 212.019C547.135 211.757 547.336 211.548 547.592 211.391C547.847 211.234 548.135 211.115 548.455 211.035C548.778 210.952 549.112 210.892 549.457 210.855C549.872 210.812 550.209 210.774 550.468 210.74C550.726 210.703 550.914 210.648 551.031 210.574C551.151 210.497 551.211 210.378 551.211 210.218V210.191C551.211 209.843 551.108 209.574 550.902 209.383C550.696 209.192 550.399 209.097 550.011 209.097C549.602 209.097 549.277 209.186 549.037 209.364C548.8 209.543 548.64 209.754 548.557 209.997L546.996 209.775C547.119 209.344 547.323 208.984 547.606 208.695C547.889 208.402 548.235 208.184 548.644 208.039C549.054 207.892 549.506 207.818 550.002 207.818C550.343 207.818 550.683 207.858 551.022 207.938C551.36 208.018 551.67 208.15 551.95 208.335C552.23 208.516 552.455 208.764 552.624 209.078C552.796 209.392 552.882 209.784 552.882 210.255V215.001H551.276V214.027H551.22C551.119 214.224 550.976 214.409 550.791 214.581C550.61 214.75 550.38 214.887 550.103 214.992C549.829 215.093 549.508 215.144 549.138 215.144ZM549.572 213.916C549.908 213.916 550.199 213.85 550.445 213.718C550.691 213.582 550.88 213.404 551.013 213.182C551.148 212.96 551.216 212.719 551.216 212.457V211.622C551.164 211.665 551.074 211.705 550.948 211.742C550.825 211.779 550.686 211.811 550.533 211.839C550.379 211.866 550.226 211.891 550.076 211.913C549.925 211.934 549.794 211.953 549.683 211.968C549.434 212.002 549.211 212.057 549.014 212.134C548.817 212.211 548.661 212.319 548.547 212.457C548.434 212.593 548.377 212.768 548.377 212.984C548.377 213.291 548.489 213.524 548.714 213.681C548.938 213.838 549.225 213.916 549.572 213.916ZM554.563 215.001V207.91H556.183V209.092H556.257C556.386 208.683 556.608 208.367 556.922 208.146C557.239 207.921 557.6 207.809 558.007 207.809C558.099 207.809 558.202 207.813 558.316 207.822C558.433 207.829 558.53 207.839 558.607 207.855V209.392C558.536 209.367 558.424 209.346 558.27 209.327C558.119 209.306 557.973 209.295 557.831 209.295C557.527 209.295 557.253 209.361 557.009 209.494C556.769 209.623 556.58 209.803 556.442 210.034C556.303 210.264 556.234 210.531 556.234 210.832V215.001H554.563ZM563.639 207.91V209.203H559.562V207.91H563.639ZM560.569 206.211H562.24V212.868C562.24 213.093 562.274 213.265 562.342 213.385C562.412 213.502 562.505 213.582 562.619 213.625C562.732 213.668 562.859 213.69 562.997 213.69C563.102 213.69 563.197 213.682 563.283 213.667C563.373 213.651 563.44 213.638 563.486 213.625L563.768 214.932C563.679 214.963 563.551 214.996 563.385 215.033C563.222 215.07 563.022 215.092 562.785 215.098C562.366 215.11 561.989 215.047 561.654 214.909C561.318 214.767 561.052 214.549 560.855 214.253C560.661 213.958 560.566 213.588 560.569 213.145V206.211ZM565.036 215.001V207.91H566.708V215.001H565.036ZM565.877 206.904C565.612 206.904 565.384 206.816 565.193 206.641C565.003 206.462 564.907 206.248 564.907 205.999C564.907 205.746 565.003 205.533 565.193 205.357C565.384 205.179 565.612 205.089 565.877 205.089C566.144 205.089 566.372 205.179 566.56 205.357C566.751 205.533 566.846 205.746 566.846 205.999C566.846 206.248 566.751 206.462 566.56 206.641C566.372 206.816 566.144 206.904 565.877 206.904ZM571.519 215.139C570.811 215.139 570.203 214.984 569.696 214.673C569.191 214.362 568.802 213.933 568.528 213.385C568.257 212.834 568.121 212.2 568.121 211.483C568.121 210.763 568.26 210.128 568.537 209.577C568.814 209.023 569.205 208.592 569.709 208.284C570.217 207.973 570.817 207.818 571.51 207.818C572.085 207.818 572.595 207.924 573.038 208.136C573.484 208.346 573.84 208.643 574.104 209.027C574.369 209.409 574.52 209.855 574.557 210.366H572.959C572.895 210.024 572.741 209.74 572.498 209.512C572.258 209.281 571.936 209.166 571.533 209.166C571.191 209.166 570.891 209.258 570.633 209.443C570.374 209.624 570.173 209.886 570.028 210.228C569.886 210.569 569.816 210.978 569.816 211.456C569.816 211.939 569.886 212.354 570.028 212.702C570.17 213.047 570.368 213.313 570.623 213.501C570.882 213.685 571.185 213.778 571.533 213.778C571.779 213.778 571.999 213.731 572.193 213.639C572.39 213.544 572.555 213.407 572.687 213.228C572.819 213.05 572.91 212.833 572.959 212.577H574.557C574.517 213.079 574.369 213.524 574.114 213.911C573.858 214.296 573.51 214.598 573.07 214.816C572.63 215.032 572.113 215.139 571.519 215.139ZM575.929 215.001V207.91H577.6V215.001H575.929ZM576.769 206.904C576.504 206.904 576.277 206.816 576.086 206.641C575.895 206.462 575.8 206.248 575.8 205.999C575.8 205.746 575.895 205.533 576.086 205.357C576.277 205.179 576.504 205.089 576.769 205.089C577.037 205.089 577.265 205.179 577.452 205.357C577.643 205.533 577.739 205.746 577.739 205.999C577.739 206.248 577.643 206.462 577.452 206.641C577.265 206.816 577.037 206.904 576.769 206.904ZM579.319 217.66V207.91H580.962V209.083H581.059C581.145 208.91 581.267 208.727 581.424 208.533C581.581 208.336 581.793 208.169 582.061 208.03C582.329 207.889 582.67 207.818 583.086 207.818C583.633 207.818 584.127 207.958 584.568 208.238C585.011 208.515 585.362 208.926 585.62 209.47C585.882 210.012 586.013 210.677 586.013 211.465C586.013 212.243 585.885 212.905 585.629 213.45C585.374 213.995 585.026 214.41 584.586 214.696C584.146 214.983 583.647 215.126 583.09 215.126C582.684 215.126 582.347 215.058 582.079 214.922C581.812 214.787 581.596 214.624 581.433 214.433C581.273 214.239 581.148 214.056 581.059 213.884H580.99V217.66H579.319ZM580.957 211.456C580.957 211.914 581.022 212.316 581.151 212.66C581.284 213.005 581.473 213.274 581.719 213.468C581.968 213.659 582.27 213.755 582.624 213.755C582.993 213.755 583.303 213.656 583.552 213.459C583.801 213.259 583.989 212.987 584.115 212.642C584.244 212.294 584.309 211.899 584.309 211.456C584.309 211.015 584.246 210.625 584.12 210.283C583.994 209.941 583.806 209.674 583.557 209.48C583.307 209.286 582.996 209.189 582.624 209.189C582.267 209.189 581.964 209.283 581.715 209.47C581.465 209.658 581.276 209.921 581.147 210.26C581.021 210.598 580.957 210.997 580.957 211.456ZM589.484 215.144C589.035 215.144 588.63 215.064 588.27 214.904C587.913 214.741 587.63 214.501 587.421 214.184C587.214 213.867 587.111 213.476 587.111 213.011C587.111 212.611 587.185 212.28 587.333 212.019C587.481 211.757 587.682 211.548 587.938 211.391C588.193 211.234 588.481 211.115 588.801 211.035C589.124 210.952 589.458 210.892 589.803 210.855C590.218 210.812 590.555 210.774 590.814 210.74C591.072 210.703 591.26 210.648 591.377 210.574C591.497 210.497 591.557 210.378 591.557 210.218V210.191C591.557 209.843 591.454 209.574 591.248 209.383C591.041 209.192 590.744 209.097 590.357 209.097C589.947 209.097 589.623 209.186 589.383 209.364C589.146 209.543 588.986 209.754 588.902 209.997L587.342 209.775C587.465 209.344 587.668 208.984 587.951 208.695C588.235 208.402 588.581 208.184 588.99 208.039C589.399 207.892 589.852 207.818 590.347 207.818C590.689 207.818 591.029 207.858 591.368 207.938C591.706 208.018 592.015 208.15 592.296 208.335C592.576 208.516 592.8 208.764 592.97 209.078C593.142 209.392 593.228 209.784 593.228 210.255V215.001H591.622V214.027H591.566C591.465 214.224 591.321 214.409 591.137 214.581C590.955 214.75 590.726 214.887 590.449 214.992C590.175 215.093 589.853 215.144 589.484 215.144ZM589.918 213.916C590.254 213.916 590.544 213.85 590.791 213.718C591.037 213.582 591.226 213.404 591.358 213.182C591.494 212.96 591.562 212.719 591.562 212.457V211.622C591.509 211.665 591.42 211.705 591.294 211.742C591.171 211.779 591.032 211.811 590.878 211.839C590.724 211.866 590.572 211.891 590.421 211.913C590.27 211.934 590.14 211.953 590.029 211.968C589.78 212.002 589.556 212.057 589.359 212.134C589.162 212.211 589.007 212.319 588.893 212.457C588.779 212.593 588.722 212.768 588.722 212.984C588.722 213.291 588.835 213.524 589.059 213.681C589.284 213.838 589.57 213.916 589.918 213.916ZM598.449 207.91V209.203H594.373V207.91H598.449ZM595.379 206.211H597.051V212.868C597.051 213.093 597.084 213.265 597.152 213.385C597.223 213.502 597.315 213.582 597.429 213.625C597.543 213.668 597.669 213.69 597.808 213.69C597.912 213.69 598.008 213.682 598.094 213.667C598.183 213.651 598.251 213.638 598.297 213.625L598.579 214.932C598.489 214.963 598.362 214.996 598.195 215.033C598.032 215.07 597.832 215.092 597.595 215.098C597.177 215.11 596.8 215.047 596.464 214.909C596.129 214.767 595.863 214.549 595.666 214.253C595.472 213.958 595.376 213.588 595.379 213.145V206.211ZM602.91 215.139C602.199 215.139 601.585 214.992 601.068 214.696C600.554 214.398 600.159 213.976 599.882 213.431C599.605 212.884 599.466 212.239 599.466 211.497C599.466 210.768 599.605 210.128 599.882 209.577C600.162 209.023 600.552 208.592 601.054 208.284C601.556 207.973 602.145 207.818 602.822 207.818C603.259 207.818 603.672 207.889 604.059 208.03C604.45 208.169 604.795 208.384 605.094 208.676C605.395 208.969 605.632 209.341 605.805 209.794C605.977 210.243 606.063 210.778 606.063 211.4V211.913H600.251V210.786H604.461C604.458 210.466 604.389 210.181 604.253 209.932C604.118 209.68 603.929 209.481 603.686 209.337C603.445 209.192 603.165 209.12 602.845 209.12C602.504 209.12 602.204 209.203 601.945 209.369C601.687 209.532 601.485 209.747 601.34 210.015C601.199 210.28 601.126 210.571 601.123 210.888V211.871C601.123 212.283 601.199 212.637 601.35 212.933C601.5 213.225 601.711 213.45 601.982 213.607C602.253 213.761 602.57 213.838 602.933 213.838C603.176 213.838 603.396 213.804 603.593 213.736C603.79 213.665 603.961 213.562 604.106 213.427C604.25 213.291 604.36 213.124 604.433 212.924L605.994 213.099C605.895 213.511 605.708 213.871 605.431 214.179C605.157 214.484 604.806 214.721 604.378 214.89C603.95 215.056 603.461 215.139 602.91 215.139Z"
                fill="black"
              />
              <path
                opacity="0.32"
                d="M285.517 249.982V248.546H293.06V249.982H290.138V258.001H288.439V249.982H285.517ZM293.704 258.001V250.91H295.325V252.092H295.399C295.528 251.683 295.749 251.367 296.063 251.146C296.38 250.921 296.742 250.809 297.148 250.809C297.241 250.809 297.344 250.813 297.458 250.822C297.575 250.829 297.671 250.839 297.748 250.855V252.392C297.678 252.367 297.565 252.346 297.411 252.327C297.261 252.306 297.114 252.295 296.973 252.295C296.668 252.295 296.394 252.361 296.151 252.494C295.911 252.623 295.722 252.803 295.583 253.034C295.445 253.264 295.376 253.531 295.376 253.832V258.001H293.704ZM300.772 258.144C300.323 258.144 299.918 258.064 299.558 257.904C299.201 257.741 298.918 257.501 298.709 257.184C298.502 256.867 298.399 256.476 298.399 256.011C298.399 255.611 298.473 255.28 298.621 255.019C298.769 254.757 298.97 254.548 299.226 254.391C299.481 254.234 299.769 254.115 300.089 254.035C300.412 253.952 300.746 253.892 301.091 253.855C301.506 253.812 301.843 253.774 302.102 253.74C302.36 253.703 302.548 253.648 302.665 253.574C302.785 253.497 302.845 253.378 302.845 253.218V253.191C302.845 252.843 302.742 252.574 302.536 252.383C302.329 252.192 302.032 252.097 301.645 252.097C301.235 252.097 300.911 252.186 300.671 252.364C300.434 252.543 300.274 252.754 300.191 252.997L298.63 252.775C298.753 252.344 298.956 251.984 299.24 251.695C299.523 251.402 299.869 251.184 300.278 251.039C300.688 250.892 301.14 250.818 301.635 250.818C301.977 250.818 302.317 250.858 302.656 250.938C302.994 251.018 303.304 251.15 303.584 251.335C303.864 251.516 304.088 251.764 304.258 252.078C304.43 252.392 304.516 252.784 304.516 253.255V258.001H302.91V257.027H302.854C302.753 257.224 302.61 257.409 302.425 257.581C302.243 257.75 302.014 257.887 301.737 257.992C301.463 258.093 301.142 258.144 300.772 258.144ZM301.206 256.916C301.542 256.916 301.832 256.85 302.079 256.718C302.325 256.582 302.514 256.404 302.646 256.182C302.782 255.96 302.85 255.719 302.85 255.457V254.622C302.797 254.665 302.708 254.705 302.582 254.742C302.459 254.779 302.32 254.811 302.166 254.839C302.012 254.866 301.86 254.891 301.709 254.913C301.559 254.934 301.428 254.953 301.317 254.968C301.068 255.002 300.845 255.057 300.648 255.134C300.451 255.211 300.295 255.319 300.181 255.457C300.067 255.593 300.01 255.768 300.01 255.984C300.01 256.291 300.123 256.524 300.347 256.681C300.572 256.838 300.858 256.916 301.206 256.916ZM307.868 253.846V258.001H306.197V250.91H307.794V252.115H307.877C308.04 251.718 308.3 251.402 308.657 251.169C309.017 250.935 309.462 250.818 309.991 250.818C310.481 250.818 310.907 250.922 311.27 251.132C311.636 251.341 311.919 251.644 312.119 252.041C312.323 252.438 312.423 252.92 312.42 253.486V258.001H310.748V253.745C310.748 253.271 310.625 252.9 310.379 252.632C310.136 252.364 309.799 252.23 309.368 252.23C309.076 252.23 308.816 252.295 308.588 252.424C308.363 252.55 308.186 252.734 308.057 252.974C307.931 253.214 307.868 253.505 307.868 253.846ZM319.723 252.784L318.199 252.951C318.156 252.797 318.081 252.652 317.973 252.517C317.869 252.381 317.727 252.272 317.548 252.189C317.37 252.106 317.151 252.064 316.893 252.064C316.545 252.064 316.253 252.14 316.016 252.29C315.782 252.441 315.666 252.637 315.67 252.877C315.666 253.083 315.742 253.251 315.896 253.38C316.053 253.509 316.311 253.615 316.671 253.698L317.881 253.957C318.552 254.102 319.05 254.331 319.377 254.645C319.706 254.959 319.872 255.37 319.875 255.877C319.872 256.324 319.741 256.718 319.483 257.059C319.227 257.398 318.872 257.662 318.416 257.853C317.961 258.044 317.438 258.139 316.847 258.139C315.979 258.139 315.28 257.958 314.751 257.595C314.222 257.228 313.906 256.719 313.805 256.067L315.434 255.91C315.508 256.23 315.665 256.471 315.905 256.634C316.145 256.798 316.457 256.879 316.842 256.879C317.239 256.879 317.558 256.798 317.798 256.634C318.041 256.471 318.162 256.27 318.162 256.03C318.162 255.827 318.084 255.659 317.927 255.527C317.773 255.394 317.533 255.293 317.207 255.222L315.997 254.968C315.317 254.826 314.814 254.588 314.488 254.252C314.162 253.914 314 253.486 314.003 252.969C314 252.532 314.118 252.153 314.358 251.833C314.602 251.51 314.939 251.261 315.369 251.085C315.803 250.907 316.304 250.818 316.87 250.818C317.701 250.818 318.355 250.995 318.832 251.349C319.312 251.703 319.609 252.181 319.723 252.784ZM324.845 250.91V252.203H320.653V250.91H324.845ZM321.701 258.001V250.241C321.701 249.764 321.799 249.367 321.996 249.05C322.196 248.733 322.464 248.496 322.8 248.339C323.135 248.182 323.508 248.103 323.917 248.103C324.206 248.103 324.463 248.126 324.688 248.172C324.913 248.219 325.079 248.26 325.186 248.297L324.854 249.59C324.783 249.568 324.694 249.547 324.586 249.525C324.479 249.501 324.359 249.488 324.226 249.488C323.915 249.488 323.695 249.564 323.566 249.714C323.44 249.862 323.377 250.074 323.377 250.351V258.001H321.701ZM328.98 258.139C328.288 258.139 327.687 257.987 327.18 257.682C326.672 257.378 326.278 256.951 325.998 256.404C325.721 255.856 325.582 255.216 325.582 254.483C325.582 253.751 325.721 253.109 325.998 252.558C326.278 252.007 326.672 251.579 327.18 251.275C327.687 250.97 328.288 250.818 328.98 250.818C329.672 250.818 330.273 250.97 330.78 251.275C331.288 251.579 331.681 252.007 331.958 252.558C332.238 253.109 332.378 253.751 332.378 254.483C332.378 255.216 332.238 255.856 331.958 256.404C331.681 256.951 331.288 257.378 330.78 257.682C330.273 257.987 329.672 258.139 328.98 258.139ZM328.989 256.801C329.365 256.801 329.679 256.698 329.931 256.491C330.183 256.282 330.371 256.002 330.494 255.651C330.62 255.3 330.684 254.909 330.684 254.479C330.684 254.045 330.62 253.652 330.494 253.301C330.371 252.947 330.183 252.666 329.931 252.457C329.679 252.247 329.365 252.143 328.989 252.143C328.605 252.143 328.284 252.247 328.029 252.457C327.777 252.666 327.587 252.947 327.461 253.301C327.338 253.652 327.277 254.045 327.277 254.479C327.277 254.909 327.338 255.3 327.461 255.651C327.587 256.002 327.777 256.282 328.029 256.491C328.284 256.698 328.605 256.801 328.989 256.801ZM333.796 258.001V250.91H335.417V252.092H335.49C335.62 251.683 335.841 251.367 336.155 251.146C336.472 250.921 336.834 250.809 337.24 250.809C337.332 250.809 337.435 250.813 337.549 250.822C337.666 250.829 337.763 250.839 337.84 250.855V252.392C337.769 252.367 337.657 252.346 337.503 252.327C337.352 252.306 337.206 252.295 337.065 252.295C336.76 252.295 336.486 252.361 336.243 252.494C336.003 252.623 335.814 252.803 335.675 253.034C335.537 253.264 335.467 253.531 335.467 253.832V258.001H333.796ZM338.95 258.001V250.91H340.548V252.115H340.631C340.779 251.709 341.023 251.392 341.365 251.164C341.706 250.933 342.114 250.818 342.588 250.818C343.068 250.818 343.473 250.935 343.802 251.169C344.135 251.399 344.369 251.715 344.504 252.115H344.578C344.735 251.721 345 251.407 345.372 251.173C345.747 250.936 346.192 250.818 346.706 250.818C347.359 250.818 347.891 251.024 348.303 251.436C348.716 251.849 348.922 252.45 348.922 253.241V258.001H347.246V253.5C347.246 253.06 347.129 252.738 346.895 252.535C346.662 252.329 346.375 252.226 346.037 252.226C345.634 252.226 345.318 252.352 345.09 252.604C344.866 252.854 344.753 253.178 344.753 253.578V258.001H343.115V253.431C343.115 253.064 343.004 252.772 342.782 252.554C342.564 252.335 342.277 252.226 341.923 252.226C341.683 252.226 341.465 252.287 341.268 252.41C341.071 252.53 340.914 252.701 340.797 252.923C340.68 253.141 340.622 253.397 340.622 253.689V258.001H338.95Z"
                fill="black"
              />
              <path
                opacity="0.32"
                d="M306.071 212.146C306.028 211.742 305.846 211.428 305.526 211.204C305.209 210.979 304.797 210.867 304.289 210.867C303.932 210.867 303.625 210.921 303.37 211.028C303.115 211.136 302.919 211.282 302.784 211.467C302.648 211.652 302.579 211.862 302.576 212.099C302.576 212.296 302.621 212.467 302.71 212.612C302.802 212.756 302.927 212.88 303.084 212.981C303.241 213.08 303.415 213.163 303.605 213.23C303.796 213.298 303.989 213.355 304.183 213.401L305.069 213.623C305.426 213.706 305.769 213.818 306.098 213.96C306.431 214.101 306.728 214.28 306.989 214.495C307.254 214.711 307.463 214.971 307.617 215.275C307.771 215.58 307.848 215.937 307.848 216.347C307.848 216.9 307.706 217.388 307.423 217.81C307.14 218.228 306.731 218.556 306.195 218.793C305.663 219.027 305.018 219.144 304.261 219.144C303.525 219.144 302.887 219.03 302.345 218.802C301.807 218.575 301.385 218.242 301.08 217.805C300.779 217.368 300.616 216.836 300.591 216.208H302.276C302.301 216.537 302.402 216.811 302.581 217.03C302.759 217.248 302.991 217.411 303.278 217.519C303.567 217.627 303.89 217.681 304.247 217.681C304.62 217.681 304.946 217.625 305.226 217.514C305.509 217.401 305.731 217.244 305.891 217.044C306.051 216.84 306.132 216.603 306.135 216.333C306.132 216.086 306.06 215.883 305.918 215.723C305.777 215.56 305.578 215.425 305.323 215.317C305.07 215.206 304.775 215.108 304.436 215.022L303.361 214.745C302.582 214.545 301.967 214.241 301.514 213.835C301.065 213.426 300.84 212.883 300.84 212.206C300.84 211.648 300.991 211.161 301.293 210.742C301.597 210.324 302.011 209.999 302.534 209.768C303.058 209.534 303.65 209.417 304.312 209.417C304.983 209.417 305.571 209.534 306.075 209.768C306.583 209.999 306.982 210.32 307.271 210.733C307.56 211.142 307.71 211.613 307.719 212.146H306.071ZM312.394 219.139C311.686 219.139 311.078 218.984 310.571 218.673C310.066 218.362 309.677 217.933 309.403 217.385C309.132 216.834 308.996 216.2 308.996 215.483C308.996 214.763 309.135 214.128 309.412 213.577C309.689 213.023 310.08 212.592 310.584 212.284C311.092 211.973 311.692 211.818 312.385 211.818C312.96 211.818 313.47 211.924 313.913 212.136C314.359 212.346 314.715 212.643 314.979 213.027C315.244 213.409 315.395 213.855 315.432 214.366H313.834C313.77 214.024 313.616 213.74 313.373 213.512C313.133 213.281 312.811 213.166 312.408 213.166C312.066 213.166 311.766 213.258 311.508 213.443C311.249 213.624 311.048 213.886 310.903 214.228C310.761 214.569 310.691 214.978 310.691 215.456C310.691 215.939 310.761 216.354 310.903 216.702C311.045 217.047 311.243 217.313 311.498 217.501C311.757 217.685 312.06 217.778 312.408 217.778C312.654 217.778 312.874 217.731 313.068 217.639C313.265 217.544 313.43 217.407 313.562 217.228C313.694 217.05 313.785 216.833 313.834 216.577H315.432C315.392 217.079 315.244 217.524 314.989 217.911C314.733 218.296 314.385 218.598 313.945 218.816C313.505 219.032 312.988 219.139 312.394 219.139ZM318.844 219.144C318.395 219.144 317.99 219.064 317.63 218.904C317.273 218.741 316.99 218.501 316.781 218.184C316.575 217.867 316.472 217.476 316.472 217.011C316.472 216.611 316.545 216.28 316.693 216.019C316.841 215.757 317.042 215.548 317.298 215.391C317.553 215.234 317.841 215.115 318.161 215.035C318.484 214.952 318.818 214.892 319.163 214.855C319.578 214.812 319.915 214.774 320.174 214.74C320.433 214.703 320.62 214.648 320.737 214.574C320.857 214.497 320.917 214.378 320.917 214.218V214.191C320.917 213.843 320.814 213.574 320.608 213.383C320.402 213.192 320.105 213.097 319.717 213.097C319.308 213.097 318.983 213.186 318.743 213.364C318.506 213.543 318.346 213.754 318.263 213.997L316.702 213.775C316.826 213.344 317.029 212.984 317.312 212.695C317.595 212.402 317.941 212.184 318.35 212.039C318.76 211.892 319.212 211.818 319.708 211.818C320.049 211.818 320.389 211.858 320.728 211.938C321.067 212.018 321.376 212.15 321.656 212.335C321.936 212.516 322.161 212.764 322.33 213.078C322.502 213.392 322.588 213.784 322.588 214.255V219.001H320.982V218.027H320.926C320.825 218.224 320.682 218.409 320.497 218.581C320.316 218.75 320.086 218.887 319.809 218.992C319.535 219.093 319.214 219.144 318.844 219.144ZM319.278 217.916C319.614 217.916 319.905 217.85 320.151 217.718C320.397 217.582 320.586 217.404 320.719 217.182C320.854 216.96 320.922 216.719 320.922 216.457V215.622C320.87 215.665 320.78 215.705 320.654 215.742C320.531 215.779 320.393 215.811 320.239 215.839C320.085 215.866 319.932 215.891 319.782 215.913C319.631 215.934 319.5 215.953 319.389 215.968C319.14 216.002 318.917 216.057 318.72 216.134C318.523 216.211 318.367 216.319 318.254 216.457C318.14 216.593 318.083 216.768 318.083 216.984C318.083 217.291 318.195 217.524 318.42 217.681C318.644 217.838 318.931 217.916 319.278 217.916ZM325.94 209.546V219.001H324.269V209.546H325.94ZM330.798 219.139C330.087 219.139 329.473 218.992 328.956 218.696C328.442 218.398 328.046 217.976 327.769 217.431C327.492 216.884 327.354 216.239 327.354 215.497C327.354 214.768 327.492 214.128 327.769 213.577C328.049 213.023 328.44 212.592 328.942 212.284C329.444 211.973 330.033 211.818 330.71 211.818C331.147 211.818 331.559 211.889 331.947 212.03C332.338 212.169 332.683 212.384 332.981 212.676C333.283 212.969 333.52 213.341 333.692 213.794C333.865 214.243 333.951 214.778 333.951 215.4V215.913H328.139V214.786H332.349C332.346 214.466 332.276 214.181 332.141 213.932C332.006 213.68 331.816 213.481 331.573 213.337C331.333 213.192 331.053 213.12 330.733 213.12C330.391 213.12 330.091 213.203 329.833 213.369C329.574 213.532 329.373 213.747 329.228 214.015C329.086 214.28 329.014 214.571 329.011 214.888V215.871C329.011 216.283 329.086 216.637 329.237 216.933C329.388 217.225 329.599 217.45 329.87 217.607C330.141 217.761 330.458 217.838 330.821 217.838C331.064 217.838 331.284 217.804 331.481 217.736C331.678 217.665 331.849 217.562 331.993 217.427C332.138 217.291 332.247 217.124 332.321 216.924L333.881 217.099C333.783 217.511 333.595 217.871 333.318 218.179C333.044 218.484 332.694 218.721 332.266 218.89C331.838 219.056 331.349 219.139 330.798 219.139Z"
                fill="black"
              />
              <path
                opacity="0.3"
                d="M559.005 251.091C558.955 250.626 558.745 250.263 558.376 250.004C558.01 249.745 557.534 249.615 556.949 249.615C556.537 249.615 556.183 249.677 555.888 249.802C555.594 249.926 555.368 250.095 555.212 250.308C555.056 250.521 554.976 250.764 554.972 251.038C554.972 251.265 555.024 251.462 555.127 251.629C555.233 251.796 555.377 251.938 555.558 252.055C555.739 252.169 555.94 252.264 556.16 252.343C556.38 252.421 556.602 252.486 556.826 252.54L557.849 252.795C558.261 252.891 558.657 253.021 559.037 253.184C559.42 253.348 559.763 253.554 560.065 253.802C560.37 254.051 560.612 254.351 560.789 254.702C560.967 255.054 561.055 255.466 561.055 255.938C561.055 256.577 560.892 257.14 560.565 257.627C560.239 258.11 559.766 258.488 559.148 258.761C558.534 259.031 557.79 259.166 556.917 259.166C556.068 259.166 555.331 259.035 554.706 258.772C554.085 258.509 553.598 258.126 553.246 257.621C552.898 257.117 552.71 256.503 552.682 255.778H554.626C554.654 256.158 554.772 256.474 554.978 256.726C555.184 256.979 555.452 257.167 555.782 257.291C556.116 257.415 556.489 257.478 556.901 257.478C557.33 257.478 557.707 257.414 558.03 257.286C558.357 257.154 558.612 256.973 558.797 256.742C558.982 256.508 559.076 256.235 559.079 255.922C559.076 255.638 558.992 255.404 558.829 255.219C558.665 255.031 558.436 254.875 558.142 254.75C557.85 254.622 557.51 254.509 557.119 254.409L555.878 254.09C554.979 253.859 554.269 253.509 553.747 253.04C553.229 252.568 552.969 251.941 552.969 251.16C552.969 250.517 553.143 249.954 553.491 249.472C553.843 248.989 554.321 248.614 554.924 248.348C555.528 248.078 556.212 247.943 556.975 247.943C557.749 247.943 558.428 248.078 559.01 248.348C559.596 248.614 560.056 248.985 560.39 249.461C560.723 249.933 560.896 250.476 560.906 251.091H559.005ZM566.301 259.161C565.484 259.161 564.783 258.981 564.197 258.623C563.614 258.264 563.165 257.769 562.849 257.137C562.537 256.501 562.38 255.769 562.38 254.942C562.38 254.111 562.54 253.378 562.86 252.742C563.179 252.103 563.63 251.606 564.213 251.251C564.799 250.892 565.491 250.713 566.29 250.713C566.954 250.713 567.542 250.835 568.053 251.08C568.568 251.322 568.978 251.664 569.284 252.108C569.589 252.549 569.763 253.063 569.806 253.653H567.963C567.888 253.259 567.711 252.93 567.43 252.668C567.153 252.401 566.782 252.268 566.317 252.268C565.923 252.268 565.576 252.375 565.278 252.588C564.98 252.797 564.747 253.099 564.58 253.493C564.417 253.887 564.335 254.36 564.335 254.91C564.335 255.468 564.417 255.947 564.58 256.348C564.744 256.746 564.973 257.053 565.267 257.27C565.566 257.483 565.916 257.589 566.317 257.589C566.601 257.589 566.855 257.536 567.079 257.43C567.306 257.32 567.496 257.161 567.649 256.956C567.801 256.75 567.906 256.499 567.963 256.204H569.806C569.76 256.783 569.589 257.296 569.294 257.744C569 258.188 568.598 258.536 568.091 258.788C567.583 259.036 566.986 259.161 566.301 259.161ZM573.744 259.166C573.225 259.166 572.758 259.074 572.343 258.889C571.931 258.701 571.604 258.424 571.363 258.058C571.125 257.692 571.006 257.241 571.006 256.705C571.006 256.244 571.091 255.862 571.261 255.56C571.432 255.258 571.664 255.017 571.959 254.835C572.254 254.654 572.586 254.518 572.955 254.425C573.328 254.329 573.713 254.26 574.111 254.218C574.591 254.168 574.979 254.123 575.278 254.084C575.576 254.042 575.793 253.978 575.928 253.893C576.066 253.804 576.135 253.667 576.135 253.483V253.451C576.135 253.049 576.016 252.739 575.778 252.518C575.54 252.298 575.198 252.188 574.75 252.188C574.278 252.188 573.903 252.291 573.626 252.497C573.353 252.703 573.168 252.946 573.072 253.227L571.272 252.971C571.414 252.474 571.648 252.059 571.975 251.725C572.302 251.387 572.701 251.135 573.174 250.968C573.646 250.798 574.168 250.713 574.74 250.713C575.134 250.713 575.526 250.759 575.917 250.851C576.308 250.943 576.664 251.096 576.988 251.309C577.311 251.519 577.57 251.805 577.765 252.167C577.964 252.529 578.064 252.982 578.064 253.525V259.001H576.21V257.877H576.146C576.029 258.104 575.864 258.317 575.651 258.516C575.441 258.712 575.176 258.87 574.857 258.99C574.541 259.108 574.17 259.166 573.744 259.166ZM574.244 257.749C574.631 257.749 574.967 257.673 575.251 257.52C575.535 257.364 575.754 257.158 575.906 256.902C576.062 256.647 576.141 256.368 576.141 256.066V255.102C576.08 255.152 575.977 255.198 575.832 255.24C575.69 255.283 575.53 255.32 575.352 255.352C575.175 255.384 574.999 255.413 574.825 255.437C574.651 255.462 574.5 255.484 574.372 255.501C574.085 255.54 573.827 255.604 573.6 255.693C573.373 255.782 573.193 255.906 573.062 256.066C572.93 256.222 572.865 256.425 572.865 256.673C572.865 257.028 572.994 257.296 573.254 257.478C573.513 257.659 573.843 257.749 574.244 257.749ZM581.931 248.092V259.001H580.002V248.092H581.931ZM587.536 259.161C586.715 259.161 586.007 258.99 585.41 258.649C584.817 258.305 584.361 257.818 584.041 257.19C583.722 256.558 583.562 255.814 583.562 254.958C583.562 254.116 583.722 253.378 584.041 252.742C584.365 252.103 584.816 251.606 585.394 251.251C585.973 250.892 586.653 250.713 587.435 250.713C587.939 250.713 588.415 250.794 588.862 250.958C589.313 251.117 589.711 251.366 590.055 251.703C590.403 252.041 590.677 252.47 590.876 252.992C591.074 253.511 591.174 254.129 591.174 254.846V255.437H584.468V254.138H589.326C589.322 253.768 589.242 253.44 589.086 253.152C588.93 252.861 588.711 252.632 588.431 252.465C588.154 252.298 587.831 252.215 587.461 252.215C587.067 252.215 586.721 252.311 586.422 252.502C586.124 252.691 585.892 252.939 585.725 253.248C585.561 253.554 585.478 253.889 585.474 254.255V255.389C585.474 255.865 585.561 256.274 585.735 256.615C585.909 256.952 586.153 257.211 586.465 257.392C586.778 257.57 587.143 257.659 587.562 257.659C587.843 257.659 588.097 257.62 588.324 257.541C588.551 257.46 588.748 257.341 588.915 257.185C589.082 257.028 589.208 256.835 589.294 256.604L591.094 256.806C590.98 257.282 590.764 257.698 590.444 258.053C590.128 258.404 589.723 258.678 589.23 258.873C588.736 259.065 588.171 259.161 587.536 259.161Z"
                fill="black"
              />
              <path
                opacity="0.21"
                d="M439.477 116.001H437.368L441.208 105.092H443.648L447.494 116.001H445.384L442.471 107.329H442.385L439.477 116.001ZM439.546 111.724H445.299V113.311H439.546V111.724ZM450.774 105.092V116.001H448.845V105.092H450.774ZM456.379 116.161C455.558 116.161 454.85 115.99 454.253 115.649C453.66 115.305 453.204 114.818 452.884 114.19C452.565 113.558 452.405 112.814 452.405 111.958C452.405 111.116 452.565 110.378 452.884 109.742C453.207 109.103 453.658 108.606 454.237 108.251C454.816 107.892 455.496 107.713 456.277 107.713C456.782 107.713 457.257 107.794 457.705 107.958C458.156 108.117 458.554 108.366 458.898 108.703C459.246 109.041 459.52 109.47 459.718 109.992C459.917 110.511 460.017 111.129 460.017 111.846V112.437H453.31V111.138H458.168C458.165 110.768 458.085 110.44 457.929 110.152C457.772 109.861 457.554 109.632 457.273 109.465C456.996 109.298 456.673 109.215 456.304 109.215C455.91 109.215 455.564 109.311 455.265 109.502C454.967 109.691 454.734 109.939 454.567 110.248C454.404 110.554 454.321 110.889 454.317 111.255V112.389C454.317 112.865 454.404 113.274 454.578 113.615C454.752 113.952 454.995 114.211 455.308 114.392C455.62 114.57 455.986 114.659 456.405 114.659C456.686 114.659 456.94 114.62 457.167 114.541C457.394 114.46 457.591 114.341 457.758 114.185C457.925 114.028 458.051 113.835 458.136 113.604L459.937 113.806C459.823 114.282 459.607 114.698 459.287 115.053C458.971 115.404 458.566 115.678 458.072 115.873C457.579 116.065 457.014 116.161 456.379 116.161ZM461.648 116.001V107.819H463.518V109.183H463.603C463.752 108.71 464.008 108.347 464.37 108.091C464.736 107.832 465.153 107.702 465.622 107.702C465.728 107.702 465.847 107.707 465.979 107.718C466.114 107.725 466.225 107.737 466.314 107.755V109.529C466.233 109.501 466.103 109.476 465.925 109.454C465.751 109.43 465.583 109.417 465.419 109.417C465.068 109.417 464.752 109.494 464.471 109.646C464.194 109.795 463.976 110.003 463.816 110.269C463.656 110.536 463.576 110.843 463.576 111.191V116.001H461.648ZM472.12 107.819V109.311H467.417V107.819H472.12ZM468.578 105.859H470.506V113.54C470.506 113.799 470.545 113.998 470.623 114.137C470.705 114.272 470.812 114.364 470.943 114.414C471.074 114.463 471.22 114.488 471.38 114.488C471.501 114.488 471.611 114.479 471.71 114.462C471.813 114.444 471.891 114.428 471.945 114.414L472.269 115.921C472.166 115.957 472.019 115.996 471.827 116.038C471.639 116.081 471.408 116.106 471.135 116.113C470.652 116.127 470.217 116.054 469.83 115.894C469.443 115.731 469.136 115.479 468.908 115.138C468.685 114.797 468.574 114.371 468.578 113.86V105.859Z"
                fill="black"
              />
              <path
                opacity="0.21"
                d="M193.147 97.001H191.319L194.647 87.5464H196.761L200.094 97.001H198.266L195.741 89.4854H195.667L193.147 97.001ZM193.207 93.2939H198.192V94.6697H193.207V93.2939ZM202.937 87.5464V97.001H201.266V87.5464H202.937ZM207.795 97.1395C207.084 97.1395 206.47 96.9917 205.953 96.6963C205.439 96.3978 205.043 95.9761 204.766 95.4314C204.489 94.8836 204.351 94.2388 204.351 93.4971C204.351 92.7677 204.489 92.1275 204.766 91.5766C205.046 91.0226 205.437 90.5918 205.939 90.284C206.441 89.9732 207.03 89.8177 207.707 89.8177C208.144 89.8177 208.556 89.8885 208.944 90.0301C209.335 90.1686 209.68 90.384 209.978 90.6764C210.28 90.9688 210.517 91.3412 210.689 91.7936C210.862 92.2429 210.948 92.7784 210.948 93.4001V93.9126H205.136V92.7861H209.346C209.343 92.4661 209.274 92.1814 209.138 91.9321C209.003 91.6797 208.813 91.4812 208.57 91.3366C208.33 91.1919 208.05 91.1196 207.73 91.1196C207.388 91.1196 207.088 91.2027 206.83 91.3689C206.571 91.532 206.37 91.7474 206.225 92.0152C206.084 92.2799 206.011 92.5707 206.008 92.8877V93.871C206.008 94.2834 206.084 94.6373 206.234 94.9328C206.385 95.2252 206.596 95.4498 206.867 95.6068C207.138 95.7607 207.455 95.8376 207.818 95.8376C208.061 95.8376 208.281 95.8038 208.478 95.7361C208.675 95.6653 208.846 95.5622 208.99 95.4268C209.135 95.2913 209.244 95.1236 209.318 94.9236L210.879 95.099C210.78 95.5114 210.592 95.8715 210.315 96.1792C210.041 96.4839 209.691 96.7209 209.263 96.8902C208.835 97.0564 208.346 97.1395 207.795 97.1395ZM212.362 97.001V89.9101H213.982V91.0919H214.056C214.185 90.6826 214.407 90.3671 214.721 90.1455C215.038 89.9208 215.399 89.8085 215.805 89.8085C215.898 89.8085 216.001 89.8131 216.115 89.8224C216.232 89.8285 216.329 89.8393 216.406 89.8547V91.392C216.335 91.3673 216.223 91.3458 216.069 91.3273C215.918 91.3058 215.772 91.295 215.63 91.295C215.325 91.295 215.051 91.3612 214.808 91.4935C214.568 91.6228 214.379 91.8028 214.241 92.0336C214.102 92.2645 214.033 92.5307 214.033 92.8323V97.001H212.362ZM221.438 89.9101V91.2027H217.361V89.9101H221.438ZM218.368 88.2112H220.039V94.8682C220.039 95.0928 220.073 95.2652 220.14 95.3852C220.211 95.5022 220.303 95.5822 220.417 95.6253C220.531 95.6684 220.657 95.6899 220.796 95.6899C220.901 95.6899 220.996 95.6822 221.082 95.6668C221.171 95.6514 221.239 95.6376 221.285 95.6253L221.567 96.9317C221.478 96.9625 221.35 96.9964 221.184 97.0333C221.021 97.0702 220.821 97.0918 220.584 97.0979C220.165 97.1102 219.788 97.0471 219.453 96.9086C219.117 96.7671 218.851 96.5486 218.654 96.2531C218.46 95.9577 218.365 95.5883 218.368 95.1452V88.2112Z"
                fill="black"
              />
              <g className="adapts-piece" data-stage="diagnose">
                <path
                  d="M189.727 241.001H179.869V211.91H189.926C192.814 211.91 195.295 212.492 197.369 213.657C199.453 214.813 201.053 216.474 202.17 218.643C203.288 220.812 203.847 223.406 203.847 226.427C203.847 229.457 203.283 232.062 202.156 234.24C201.039 236.418 199.424 238.089 197.312 239.254C195.21 240.419 192.682 241.001 189.727 241.001ZM185.139 236.441H189.472C191.498 236.441 193.188 236.072 194.543 235.333C195.897 234.585 196.915 233.473 197.597 231.995C198.278 230.509 198.619 228.652 198.619 226.427C198.619 224.202 198.278 222.355 197.597 220.887C196.915 219.41 195.906 218.307 194.571 217.578C193.245 216.839 191.598 216.47 189.628 216.47H185.139V236.441Z"
                  fill="white"
                />
              </g>
              <g className="adapts-piece" data-stage="transform">
                <path
                  d="M558.591 92.3277V87.9101H581.801V92.3277H572.81V117.001H567.582V92.3277H558.591Z"
                  fill="white"
                />
              </g>
              <g className="adapts-piece" data-stage="scale">
                <path
                  d="M701.679 210.907C701.546 209.667 700.988 208.701 700.003 208.009C699.027 207.318 697.759 206.973 696.196 206.973C695.098 206.973 694.155 207.138 693.369 207.47C692.583 207.801 691.982 208.251 691.565 208.819C691.149 209.387 690.936 210.036 690.926 210.765C690.926 211.371 691.063 211.897 691.338 212.342C691.622 212.787 692.006 213.166 692.489 213.478C692.972 213.781 693.507 214.037 694.094 214.245C694.681 214.454 695.273 214.629 695.869 214.771L698.597 215.453C699.695 215.708 700.751 216.054 701.764 216.49C702.787 216.925 703.701 217.474 704.506 218.137C705.32 218.8 705.964 219.6 706.438 220.538C706.911 221.475 707.148 222.574 707.148 223.833C707.148 225.538 706.712 227.039 705.841 228.336C704.97 229.624 703.71 230.633 702.062 231.362C700.424 232.081 698.44 232.441 696.111 232.441C693.848 232.441 691.883 232.091 690.216 231.39C688.559 230.689 687.261 229.667 686.324 228.322C685.396 226.977 684.894 225.339 684.818 223.407H690.003C690.079 224.42 690.391 225.263 690.94 225.936C691.49 226.608 692.205 227.11 693.085 227.441C693.975 227.773 694.97 227.938 696.068 227.938C697.214 227.938 698.218 227.768 699.08 227.427C699.951 227.077 700.633 226.594 701.125 225.978C701.617 225.353 701.868 224.624 701.878 223.791C701.868 223.033 701.646 222.408 701.21 221.916C700.775 221.414 700.164 220.997 699.378 220.666C698.601 220.325 697.692 220.022 696.651 219.757L693.341 218.904C690.945 218.289 689.051 217.356 687.659 216.106C686.277 214.847 685.585 213.175 685.585 211.092C685.585 209.378 686.049 207.877 686.977 206.589C687.915 205.301 689.188 204.302 690.798 203.592C692.408 202.872 694.231 202.512 696.267 202.512C698.331 202.512 700.14 202.872 701.693 203.592C703.256 204.302 704.482 205.292 705.372 206.561C706.262 207.82 706.722 209.269 706.75 210.907H701.679Z"
                  fill="white"
                />
              </g>
              <g className="adapts-piece" data-stage="participate">
                <path
                  d="M433.869 230.001V200.91H444.778C447.013 200.91 448.888 201.327 450.403 202.16C451.928 202.993 453.079 204.139 453.855 205.598C454.641 207.046 455.034 208.694 455.034 210.541C455.034 212.406 454.641 214.063 453.855 215.512C453.069 216.961 451.909 218.102 450.375 218.936C448.841 219.759 446.952 220.171 444.707 220.171H437.477V215.839H443.997C445.304 215.839 446.374 215.612 447.207 215.157C448.041 214.703 448.656 214.078 449.054 213.282C449.461 212.487 449.665 211.573 449.665 210.541C449.665 209.509 449.461 208.599 449.054 207.813C448.656 207.027 448.036 206.417 447.193 205.981C446.36 205.536 445.285 205.313 443.969 205.313H439.139V230.001H433.869Z"
                  fill="white"
                />
              </g>
              <g className="adapts-piece" data-stage="access">
                <path
                  d="M309.605 116.001H303.98L314.222 86.9101H320.727L330.983 116.001H325.358L317.588 92.876H317.361L309.605 116.001ZM309.79 104.595H325.131V108.828H309.79V104.595Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
          <div className="model-content">
            <div className="model-preview">
              {stageDetails[activeStage].preview}
            </div>
            <h3 className="model-title">{stageDetails[activeStage].title}</h3>
            <p className="model-description">
              {stageDetails[activeStage].description}
            </p>
            <div className="model-chevron">⌄</div>
            <div className="model-insight">
              {stageDetails[activeStage].insight}
            </div>
          </div>
        </div>
      </section>

      {/*========== PRODUCTIVITY ENERGY INTO============= */}
      <section className="productivity-energy-section">
        <div className="pe-inner">
          <div className="pe-header">
            <div className="framework-subtitle" style={{ marginBottom: 12 }}>
              Productivity Energy
            </div>
            <h2 className="framework-title" style={{ color: "white" }}>
              Know Your Energy Type
            </h2>
            <p className="framework-description">
              Every person carries a dominant productivity energy. Understanding
              yours reveals where you thrive, what fuels your best work, and how
              to build teams that complement each other.
            </p>
          </div>

          <div className="pe-body">
            {/* LEFT — AIOU square */}
            <div className="pe-square-wrap">
              <div
                className="pe-square"
                aria-label="AIOU Productivity Energies"
              >
                {productivityEnergies.map((e) => (
                  <div key={e.key} className="pe-quadrant">
                    <span className="pe-letter">{e.key}</span>
                    <span className="pe-quad-name">{e.name}</span>
                  </div>
                ))}
              </div>
              <p className="pe-square-caption">
                A · I · O · U — four distinct productivity energies
              </p>
            </div>

            {/* RIGHT — plain text grid */}
            <div className="pe-details">
              {productivityEnergies.map((e) => (
                <div key={e.key} className="pe-item">
                  <div className="pe-item-head">
                    <span className="pe-item-letter">{e.key}</span>
                    <div>
                      <h3 className="pe-item-name">{e.name}</h3>
                      <p className="pe-item-tagline">{e.tagline}</p>
                    </div>
                  </div>

                  <div className="pe-item-body">
                    <div className="pe-col">
                      <p className="pe-col-label">Feels most alive when</p>
                      <ul className="pe-list pe-list--alive">
                        {e.alive.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pe-col">
                      <p className="pe-col-label drain">Drain factors</p>
                      <ul className="pe-list pe-list--drain">
                        {e.drain.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ========== PROMISE SECTION ========== */}
      <section className="promise-section">
        <div className="promise-container">
          <div className="promise-header">
            <span className="promise-badge">Our Promise</span>
            <h2 className="promise-title">
              From Insight to <span className="highlight">Execution</span>
            </h2>
            <p className="promise-subtitle">
              A leadership and team intelligence platform that helps you
              understand how you naturally think, where your energy creates
              results, and how to turn ideas into real execution.
            </p>
          </div>

          <div className="promise-grid">
            {/* Card 1 - For Leaders */}
            <div className="promise-card">
              <div className="promise-icon">🎯</div>
              <h3>For Leaders & Teams</h3>
              <p>
                Take the assessment to gain clarity, improve alignment, and
                drive consistent results. Understand your natural change genius
                and build teams that execute.
              </p>
              <ul className="promise-list">
                <li>✓ Discover your natural thinking patterns</li>
                <li>✓ Identify where your energy creates results</li>
                <li>✓ Turn ideas into real execution</li>
                <li>✓ Improve team alignment & communication</li>
              </ul>
            </div>

            {/* Card 2 - For Experts & Creators */}
            <div className="promise-card highlight-card">
              <div className="promise-icon">⚡</div>
              <h3>For Experts, Creators & Professionals</h3>
              <p>
                Move from knowledge to results. Discover a clearer message, a
                faster path from value to income, stronger offers, and sharper
                positioning.
              </p>
              <ul className="promise-list">
                <li>✓ Clearer message & sharper positioning</li>
                <li>✓ Faster path from value to income</li>
                <li>✓ Content-to-client system</li>
                <li>✓ Execution structure that converts</li>
              </ul>
              <div className="promise-tag">
                For Coaches, Consultants & Creators
              </div>
            </div>

            {/* Card 3 - For Business Growth */}
            <div className="promise-card">
              <div className="promise-icon">📈</div>
              <h3>For Business Growth</h3>
              <p>
                Help your expertise or business convert better and grow with
                clarity. Stop guessing and start executing with a proven model.
              </p>
              <ul className="promise-list">
                <li>✓ Convert better with clarity</li>
                <li>✓ Scale your expertise</li>
                <li>✓ Build sustainable systems</li>
                <li>✓ Grow with confidence</li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="promise-cta">
            <Link href="/assessment" className="btn-primary promise-btn">
              Take the Assessment →{" "}
              {/*<span>{formatPrice(PRICING.INDIVIDUAL)} one-time</span>*/}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== UNDERSTAND YOUR GIFTS SECTION ========== */}
      <section className="gifts-section">
        <div className="gifts-container">
          <div className="gifts-content">
            <h2 className="gifts-title">
              Understand your gifts,
              <br />
              your frustrations & your team's
              <br />
              <span className="gifts-highlight">
                natural productivity energy.
              </span>
            </h2>
            <p className="gifts-description">
              Most professionals spend years trying to fit into roles that drain
              them. Change Genius™ reveals exactly where you naturally thrive —
              and where you expend energy fighting your own nature. Stop
              guessing. Start building teams and careers around what actually
              works.
            </p>
            <div className="gifts-buttons">
              <button onClick={handleStart} className="gifts-btn-primary">
                Take the Assessment →
              </button>
              <Link href="#pricing" className="gifts-btn-secondary">
                View Team Pricing
              </Link>
            </div>
            <div className="gifts-stats">
              <div className="gifts-stat">
                <span className="gifts-stat-number">94%</span>
                <span className="gifts-stat-label">
                  of leaders gain new
                  <br />
                  self-awareness
                </span>
              </div>
              <div className="gifts-stat">
                <span className="gifts-stat-number">8-10</span>
                <span className="gifts-stat-label">
                  minutes to complete
                  <br />
                  the assessment
                </span>
              </div>
              <div className="gifts-stat">
                <span className="gifts-stat-number">6</span>
                <span className="gifts-stat-label">
                  ADAPTS™ stages of
                  <br />
                  transformation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHAT IS CHANGE GENIUS? ========== */}
      <section className="two-column-section">
        <div className="section-bg">{/* optional bg SVG */}</div>
        <div className="container">
          <div className="col-text">
            <h2>What is Change Genius?</h2>
            <p className="subhead">Explore the Change Genius™ Model</p>
            <p className="description">
              Change Genius™ is the only assessment-based model built to reveal
              how leaders and teams drive transformation.
            </p>
            <ul className="benefits-list what-is-change-genius">
              <li>✓ Understand your natural role during change</li>
              <li>✓ Identify where your team loses momentum</li>
              <li>✓ Improve dialogue, alignment, and execution</li>
              <li>✓ Transform friction into collaborative momentum</li>
              <li>✓ Develop stronger change leadership skills</li>
              <li>✓ Build organizations that absorb and drive change</li>
            </ul>
            <Link href="/about" className="btn-outline">
              Explore the Model →
            </Link>
          </div>
          <div className="col-image">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
              alt="Office team meeting"
            />
          </div>
        </div>
      </section>

      {/* ========== IMPACT TABS ========== */}
      <section className="impact-tabs-section">
        <div className="section-header">
          <h2>Change Genius Transforms</h2>
          <p className="section-subhead">
            How leaders and teams drive real impact across every dimension of
            work
          </p>
        </div>
        <div className="tabs-wrapper">
          <div className="tabs-nav">
            {["meetings", "hiring", "productivity", "morale", "language"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeImpactTab === tab ? "active" : ""}`}
                  onClick={() => setActiveImpactTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ),
            )}
          </div>
          <div className="tabs-content">
            {activeImpactTab === "meetings" && (
              <div className="tab-pane active">
                <div className="impact-description">
                  Stop wasting time in meetings that go nowhere. ChangeGenius
                  helps teams align on the natural energy each person brings —
                  so every meeting has the right people in the right roles, from
                  sparking ideas to driving execution.
                </div>
                {/*<div className="testimonial-block">
                  <div className="quote-icon">“</div>
                  <div className="quote-text">
                    Before ChangeGenius, our leadership meetings were a drag.
                    Now we know who should start the conversation, who should
                    challenge assumptions, and who should push to action. Our
                    meeting efficiency has tripled, and decisions stick.
                  </div>
                  <div className="quote-author">
                    Elena Vasquez, COO, NexaTech
                  </div>
                </div>*/}
              </div>
            )}
            {activeImpactTab === "hiring" && (
              <div className="tab-pane active">
                <div className="impact-description">
                  Hire for what people naturally do best. ChangeGenius reveals
                  productivity energies — Innovator, Achiever, Organizer,
                  Unifier — so you can build teams that complement each other,
                  reduce friction, and close capability gaps before they emerge.
                </div>
                {/*<div className="testimonial-block">
                  <div className="quote-icon">“</div>
                  <div className="quote-text">
                    We used ChangeGenius to restructure our hiring process. Now
                    we interview for energy fit, not just skills. The result?
                    New hires ramp 2x faster and stay longer because they're
                    placed where they thrive.
                  </div>
                  <div className="quote-author">
                    Marcus Thorne, VP of People, Stratex
                  </div>
                </div>*/}
              </div>
            )}
            {activeImpactTab === "productivity" && (
              <div className="tab-pane active">
                <div className="impact-description">
                  Unlock hidden productivity by matching tasks to natural
                  strengths. ChangeGenius identifies where your team has too
                  much of one energy and too little of another — then gives you
                  a 90‑day roadmap to rebalance and accelerate outcomes.
                </div>
                {/* <div className="testimonial-block">
                  <div className="quote-icon">“</div>
                  <div className="quote-text">
                    Our cross‑functional teams used to step on each other's
                    toes. After mapping everyone's ChangeGenius profile, we
                    reassigned roles based on energy — and saw a 40% reduction
                    in rework within eight weeks.
                  </div>
                  <div className="quote-author">
                    Priya Mehta, Head of Delivery, GlobalSync
                  </div>
                </div> */}
              </div>
            )}
            {activeImpactTab === "morale" && (
              <div className="tab-pane active">
                <div className="impact-description">
                  Low morale often comes from being forced to work against your
                  natural energy. ChangeGenius helps leaders create a culture
                  where every person feels seen, valued, and empowered to
                  contribute in the way that energizes them most.
                </div>
                {/*<div className="testimonial-block">
                  <div className="quote-icon">“</div>
                  <div className="quote-text">
                    ChangeGenius turned our retention crisis around. For the
                    first time, people felt understood. Our employee Net
                    Promoter Score went from -12 to +47 in six months. That's
                    the power of aligning work to energy.
                  </div>
                  <div className="quote-author">
                    Dr. Lena Wu, Chief People Officer, CareBridge
                  </div>
                </div>*/}
              </div>
            )}
            {activeImpactTab === "language" && (
              <div className="tab-pane active">
                <div className="impact-description">
                  Most change fails because teams don't speak the same language.
                  ChangeGenius introduces a simple, powerful vocabulary —
                  Innovator, Achiever, Organizer, Unifier — that everyone can
                  use to name what they need and where they struggle.
                </div>
                {/*<div className="testimonial-block">
                  <div className="quote-icon">“</div>
                  <div className="quote-text">
                    We rolled out ChangeGenius across 12 countries. Within a
                    month, people stopped using vague complaints and started
                    saying things like ‘we're stuck in Diagnose’ or ‘we need
                    more Spark.’ It changed everything.
                  </div>
                  <div className="quote-author">
                    David Okonkwo, Global Transformation Lead, Unity Health
                  </div>
                </div>*/}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== ENERGY STACK CAROUSEL ========== */}
      <section className="energy-stack-section">
        <div className="section-bg">
          {/* PASTE YOUR CHAOS LINES SVG PATH DATA HERE (the background lines) */}
          <svg className="bg-svg" viewBox="0 0 800 800">
            <g stroke="white" fill="none" strokeLinecap="round" opacity="0.15">
              {/* Paste all path elements from the .bg-svg in index.html */}
            </g>
          </svg>
        </div>
        <div className="energy-header">
          <h2> Productivity Energy</h2>
          <p>How you show up during change</p>
        </div>
        <div className="stack-container">
          <button
            className="slider-control prev"
            onClick={() =>
              setCurrentEnergy(
                (i) => (i - 1 + energyCards.length) % energyCards.length,
              )
            }
          >
            ‹
          </button>
          <button
            className="slider-control next"
            onClick={() =>
              setCurrentEnergy((i) => (i + 1) % energyCards.length)
            }
          >
            ›
          </button>
          <div className="card-stack">
            {energyCards.map((card, idx) => {
              let positionClass = "";
              if (idx === currentEnergy) positionClass = "front";
              else if (idx === (currentEnergy + 1) % energyCards.length)
                positionClass = "stack-1";
              else if (idx === (currentEnergy + 2) % energyCards.length)
                positionClass = "stack-2";
              else if (idx === (currentEnergy + 3) % energyCards.length)
                positionClass = "stack-3";
              return (
                <div
                  key={card.title}
                  className={`energy-card ${positionClass}`}
                >
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-tagline">{card.tagline}</div>
                  <p className="card-desc">{card.desc}</p>
                  <div className="card-chips">
                    {card.chips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== PRICING TABS (Individuals / Teams) ========== */}
      <section className="individuals-teams-section" id="pricing">
        <div className="section-header">
          <h2>Change Genius for You & Your Team</h2>
          <p className="section-subhead">
            Choose the path that fits your needs
          </p>
        </div>
        <div className="tabs-container">
          <div className="tabs-nav">
            <button
              className={`tab-btn ${activePricingTab === "individuals" ? "active" : ""}`}
              onClick={() => setActivePricingTab("individuals")}
            >
              For Individuals
            </button>
            <button
              className={`tab-btn ${activePricingTab === "teams" ? "active" : ""}`}
              onClick={() => setActivePricingTab("teams")}
            >
              For Teams
            </button>
          </div>
          <div className="tabs-content">
            {activePricingTab === "individuals" && (
              <div className="tab-pane active">
                <div className="offer-card">
                  <h3>Discover Your Change Genius™ Profile</h3>
                  <p className="offer-description">
                    Understand how you naturally lead during transformation. Get
                    your ADAPTS™ stage strengths, your Change Genius™ role, and
                    clear development guidance.
                  </p>
                  <ul className="text-list">
                    <li>Your Change Genius™ role</li>
                    <li>ADAPTS™ stage strengths</li>
                    <li>Productivity Energy</li>
                    <li>Leadership development guidance</li>
                    <li>Download and share your results</li>
                  </ul>
                  <div className="price-block">
                    <span className="price">
                      {formatPrice(PRICING.INDIVIDUAL)}
                    </span>
                    <span className="price-caption">one‑time payment</span>
                  </div>
                  <button className="btn-primary" onClick={handleStart}>
                    Take Assessment →
                  </button>
                  <div className="payment-footnote">
                    No subscription · Secure checkout
                  </div>
                </div>
              </div>
            )}
            {activePricingTab === "teams" && (
              <div className="tab-pane active">
                <div className="offer-card">
                  <h3>Build Your Team Change Map™</h3>
                  <p className="offer-description">
                    See how your team's roles map across all six ADAPTS™ stages.
                    Identify friction, unlock your Change Capacity Score™, and
                    get a 90‑day roadmap.
                  </p>
                  <div className="tier-list">
                    <div className="tier-item">
                      <span className="tier-size">3-7 members</span>
                      <span className="tier-feature">
                        Visible role distribution and team change map unlocks
                      </span>
                    </div>
                    <div className="tier-item">
                      <span className="tier-size">8+ members</span>
                      <span className="tier-feature">
                        Full team diagnostics unlocks
                      </span>
                    </div>
                  </div>
                  <div className="price-block">
                    <span className="price">
                      {formatPrice(PRICING.INDIVIDUAL)}
                    </span>
                    <span className="price-caption">per person · one‑time</span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => router.push("/teams/create")}
                  >
                    Start a Team →
                  </button>
                  <div className="payment-footnote">
                    Bulk discounts available · Contact sales
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== WALL OF LOVE (TESTIMONIALS) ========== */}
      {/*<section className="wall-of-love-section">
        <div className="section-header">
          <h2>What people are saying</h2>
          <p>
            Real stories from leaders who transformed their teams with
            ChangeGenius™
          </p>
        </div>
        <div className="wall-of-love">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card"
              onClick={() => setSelectedTestimonial(t)}
            >
              <div className="card-quote">{t.quote}</div>
              <div className="card-author">
                <img src={t.avatar} alt={t.name} />
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
              <div className="card-footer">
                <img src={t.logo} alt="logo" className="company-logo" />
                <span className="rating">{"★".repeat(t.rating)}</span>
              </div>
            </div>
          ))}
        </div>
        {selectedTestimonial && (
          <div
            className="modal"
            style={{ display: "flex" }}
            onClick={() => setSelectedTestimonial(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span
                className="close-modal"
                onClick={() => setSelectedTestimonial(null)}
              >
                &times;
              </span>
              <p className="modal-quote">{selectedTestimonial.quote}</p>
              <div className="modal-author">
                <img
                  src={selectedTestimonial.avatar}
                  alt={selectedTestimonial.name}
                />
                <div>
                  <div className="modal-name">{selectedTestimonial.name}</div>
                  <div className="modal-role">{selectedTestimonial.role}</div>
                  <img
                    src={selectedTestimonial.logo}
                    alt="logo"
                    style={{ marginTop: 8, maxHeight: 30 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>*/}

      {/* ========== RESOURCES SECTION ========== */}
      <section className="resources-section">
        <div className="section-bg-light"></div>
        <div className="bg-squiggly">
          {/* PASTE YOUR SQUIGGLY LINES SVG PATH DATA HERE */}
          <svg viewBox="0 0 800 800">
            <g
              stroke="#0101ee"
              fill="none"
              strokeLinecap="round"
              opacity="0.09"
            >
              {/* Paste all squiggly path elements from .bg-squiggly in index.html */}
            </g>
          </svg>
        </div>
        <div className="floating-ball ball-blue">
          <svg viewBox="0 0 800 800">
            <circle cx="400" cy="400" r="278.5" fill="#0101ee" />
          </svg>
        </div>
        <div className="floating-ball ball-pink">
          <svg viewBox="0 0 800 800">
            <circle cx="400" cy="400" r="278.5" fill="#0101ee" />
          </svg>
        </div>
        <div className="section-header">
          <h2>Change Intelligence Resources</h2>
          <p>
            Curated insights, tools, and guides to help you lead transformation
            with confidence
          </p>
        </div>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="resource-image">
              <img
                src="https://www.mckinsey.com/~/media/mckinsey/business%20functions/people%20and%20organizational%20performance/our%20insights/all%20about%20teams%20a%20new%20approach%20to%20organizational%20transformation/focusonteams-ex1.svgz?cq=50&cpy=Center"
                alt="All about teams"
              />
            </div>
            <h3 className="resource-title">
              All about teams: A new approach to organizational transformation
            </h3>
            <a
              href="https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/all-about-teams-a-new-approach-to-organizational-transformation"
              className="resource-link"
              target="_blank"
            >
              Read article →
            </a>
          </div>
          <div className="resource-card">
            <div className="resource-image">
              <img
                src="https://www.mckinsey.com/~/media/mckinsey/business%20functions/people%20and%20organizational%20performance/our%20insights/how%20to%20capture%20the%20elusive%20performance%20edge%20in%20true%20transformations/performanceedgetransformation_ex1.svgz?cq=50&cpy=Center"
                alt="How to capture the elusive performance edge"
              />
            </div>
            <h3 className="resource-title">
              How to capture the elusive performance edge in true
              transformations
            </h3>
            <a
              href="https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/how-to-capture-the-elusive-performance-edge-in-true-transformations"
              className="resource-link"
              target="_blank"
            >
              Read article →
            </a>
          </div>
          <div className="resource-card">
            <div className="resource-image">
              <img
                src="https://imageio.forbes.com/specials-images/imageserve/69418a438c33187fc09a977e/Excited-male-and-female-entrepreneurs-celebrating-achievement-sitting-at-desk-in/0x0.jpg?width=960&dpr=1.5"
                alt="Why You Can't Scale A Business Without Scaling Its Leaders First"
              />
            </div>
            <h3 className="resource-title">
              Why You Can't Scale A Business Without Scaling Its Leaders First
            </h3>
            <a
              href="https://www.forbes.com/councils/forbescoachescouncil/2025/12/17/why-you-cant-scale-a-business-without-scaling-its-leaders-first/"
              className="resource-link"
              target="_blank"
            >
              Read article →
            </a>
          </div>
          <div className="resource-card">
            <div className="resource-image">
              <img
                src="https://hbr.org/resources/images/article_assets/2026/01/Jan26_14_90442277.jpg"
                alt="What Leaders Get Wrong About Strategic Alignment"
              />
            </div>
            <h3 className="resource-title">
              What Leaders Get Wrong About Strategic Alignment{" "}
            </h3>
            <a
              href="https://hbr.org/2026/01/what-leaders-get-wrong-about-strategic-alignment"
              className="resource-link"
              target="_blank"
            >
              Read article →
            </a>
          </div>
          <div className="resource-card">
            <div className="resource-image">
              <img
                src="https://hbr.org/resources/images/article_assets/2024/05/R2404C_EIS-1900x1069.jpg"
                alt="Build a Corporate Culture That Works"
              />
            </div>
            <h3 className="resource-title">
              Build a Corporate Culture That Works{" "}
            </h3>
            <a
              href="https://hbr.org/2024/07/build-a-corporate-culture-that-works"
              className="resource-link"
              target="_blank"
            >
              Read article →
            </a>
          </div>
          <div className="resource-card">
            <div className="resource-image">
              <img
                src="https://imageio.forbes.com/specials-images/imageserve/66d2135aa3eebcfe32c51c53/Three-Employees-Giving-Presentation-During-Seminar/0x0.jpg?width=960&dpr=1.5"
                alt="Why Change Efforts Still Fail And What Leaders Can Do Differently"
              />
            </div>
            <h3 className="resource-title">
              Why Change Efforts Still Fail And What Leaders Can Do Differently
            </h3>
            <a
              href="
https://www.forbes.com/councils/forbescoachescouncil/2026/04/30/why-change-efforts-still-fail-and-what-leaders-can-do-differently/"
              className="resource-link"
              target="_blank"
            >
              Read article →
            </a>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Understand your gifts,
            <br />
            your frustrations & your team's natural productivity energy.
          </h2>
          <p className="cta-subhead">Join the movement today!</p>
          <button className="cta-button" onClick={handleStart}>
            Take The Assessment Now →
          </button>
          {/*<div className="cta-price">
            {formatPrice(PRICING.INDIVIDUAL)} per license
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
    </>
  );
}

import { Role } from "../assessment/questions";
import { TeamDiagnostic } from "../assessment/team-diagnostic";


export interface TeamReportInput {
  teamName: string;
  diagnostic: TeamDiagnostic;
  memberNames: string[];
  date: string;
}

// ── Design tokens ──────────────────────────────────────────────
const C = {
  navy:      "#0F1F3D",
  purple:    "#6C3FC5",
  gold:      "#F4C842",
  amber:     "#F59E0B",
  green:     "#10B981",
  red:       "#EF4444",
  gray:      "#6B7280",
  grayLight: "#F3F4F6",
  white:     "#FFFFFF",
};

const ENERGY_COLORS: Record<string, string> = {
  Achiever:  C.purple,
  Unifier:   C.green,
  Organizer: C.gold,
  Innovator: "#EC4899",
};

// ── Base CSS ───────────────────────────────────────────────────
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F0F2F5; }
  .page {
    width: 794px; min-height: 1123px; background: white;
    margin: 0 auto 32px; padding: 44px 50px 60px;
    page-break-after: always; position: relative;
  }
  h1 { font-size: 46px; color: ${C.navy}; font-weight: 900; line-height: 1.05; }
  h2 { font-size: 24px; color: ${C.navy}; font-weight: 800; }
  h3 { font-size: 13px; color: ${C.navy}; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; }
  p  { font-size: 13px; color: #374151; line-height: 1.65; }
  .label { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .divider { height: 2px; background: ${C.grayLight}; margin: 10px 0 18px; }
  .section-gap { margin-top: 22px; }
  .locked-card {
    position: relative; border-radius: 10px; overflow: hidden;
    border: 2px dashed #D1D5DB; padding: 20px;
    background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
    min-height: 90px;
  }
  .locked-overlay {
    position: absolute; inset: 0; backdrop-filter: blur(3px);
    background: rgba(255,255,255,0.55);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  }
  .lock-badge {
    background: ${C.navy}; color: white; font-size: 11px; font-weight: 700;
    padding: 5px 12px; border-radius: 20px; letter-spacing: .08em;
  }
  .upgrade-cta {
    background: linear-gradient(135deg, ${C.navy} 0%, #1e3a6e 100%);
    border-radius: 12px; padding: 20px 24px; color: white; text-align: center;
    margin-top: 18px;
  }
  .cta-btn {
    display: inline-block; margin-top: 10px;
    background: ${C.gold}; color: ${C.navy}; font-weight: 800;
    font-size: 12px; letter-spacing: .08em; padding: 9px 20px;
    border-radius: 20px; text-transform: uppercase;
  }
  .num-badge {
    width: 26px; height: 26px; border-radius: 50%; background: ${C.navy};
    color: white; font-weight: 700; font-size: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  @media print { .page { margin: 0; page-break-after: always; } }
`;

// ── Helpers ────────────────────────────────────────────────────
function page(content: string, pageNum?: number): string {
  const footer = pageNum !== undefined ? `
    <div style="position:absolute;bottom:22px;left:50px;right:50px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${C.grayLight};padding-top:8px">
      <span style="font-size:10px;color:${C.gray}">Change Genius™ · Team Change Map™ · changegeniusai.com</span>
      <span style="font-size:10px;color:${C.gray};font-weight:700">Page ${pageNum + 1}</span>
    </div>` : "";
  return `<div class="page">${content}${footer}</div>`;
}

function scoreBar(value: number, color: string, height = 9): string {
  return `
    <div style="background:${C.grayLight};border-radius:99px;height:${height}px;overflow:hidden">
      <div style="width:${Math.min(value, 100)}%;height:100%;background:${color};border-radius:99px"></div>
    </div>`;
}

function lockedCard(label: string, desc: string): string {
  return `
    <div class="locked-card" style="min-height:100px">
      <div style="opacity:0.2">
        <div class="label" style="margin-bottom:6px">${label}</div>
        <p style="font-size:11px;margin:0">${desc}</p>
      </div>
      <div class="locked-overlay">
        <span style="font-size:16px">🔒</span>
        <span class="lock-badge">LOCKED</span>
      </div>
    </div>`;
}

function upgradeCTA(headline: string, body: string): string {
  return `
    <div class="upgrade-cta">
      <div class="label" style="color:${C.gold};margin-bottom:5px">UPGRADE TO UNLOCK</div>
      <div style="font-size:15px;font-weight:800;margin-bottom:6px">${headline}</div>
      <p style="font-size:12px;color:rgba(255,255,255,0.75);margin:0">${body}</p>
      <span class="cta-btn">Unlock Full Intelligence →</span>
    </div>`;
}

// ── Supplementary data ─────────────────────────────────────────

const STAGE_DESCRIPTIONS: Record<string, string> = {
  Alert:     "Sensing disruption early and creating urgency before the market forces it.",
  Diagnose:  "Asking harder questions to address root causes — not just symptoms.",
  Prepare:   "Assessing capability and confidence before launch to reduce implementation risk.",
  Align:     "Building shared understanding and surfacing hidden concerns before execution.",
  Transform: "Converting agreement into coordinated action through complex change.",
  Sustain:   "Embedding new behaviours and building systems that make change last.",
};

const ENERGY_TEAM_DESC: Record<string, string> = {
  Achiever:  "Results-driven and fast-moving. This team measures success in visible outcomes. Communication should be direct, goal-oriented, and tied to measurable progress. Push too hard without relational investment and trust will erode.",
  Unifier:   "People-first and trust-driven. This team makes better decisions when all voices are heard. Relationships are the engine — protect them under pressure. The risk is avoiding difficult conversations to preserve harmony.",
  Organizer: "Structure-dependent and reliability-focused. This team performs best with clear processes, defined roles, and logical planning. The risk is over-engineering systems before validating the direction.",
  Innovator: "Idea-rich and future-focused. This team generates strong creative thinking but needs execution support to convert insight into consistent delivery. The risk is moving to the next idea before the last one is complete.",
};

const RISK_LEVEL_DESC: Record<string, string> = {
  Low:      "Your team has a well-balanced profile with low execution risk. Maintain current strengths and deepen capability in your weakest ADAPTS stages.",
  Moderate: "Some gaps exist that could create friction as complexity grows. Address proactively before scaling initiatives or team size.",
  High:     "Significant role or stage gaps are creating active execution risk. Structural intervention is needed before the next major initiative.",
  Critical: "Multiple critical gaps are compounding. Immediate structural attention is strongly recommended to prevent execution failure.",
};

const MISSING_ROLE_IMPACT: Record<string, string> = {
  Driver:    "Without a Driver, the team struggles to convert planning into consistent momentum. Deadlines slip, initiatives stall, and urgency is lost between meetings. Someone is always pushing who shouldn't have to.",
  Connector: "Without a Connector, trust erodes under pressure. Misalignment builds silently, voices go unheard, and conflict surfaces only after it has done damage. Retention risk increases significantly.",
  Architect: "Without an Architect, good ideas lack operational structure. Execution is ad hoc, processes are undocumented, and the same mistakes are made repeatedly. Scaling becomes painful.",
  Spotter:   "Without a Spotter, the team may execute confidently in the wrong direction. Strategic blind spots accumulate and the team is slow to detect emerging risk or better opportunity.",
};

const LEADERSHIP_RISKS = [
  {
    label: "Alignment Breakdown Risk",
    desc:  "Misalignment forming between team members. Decisions made without genuine buy-in lead to passive resistance and rework.",
    flagged: (d: TeamDiagnostic) => (d.stageScores["Align"] ?? 100) < 50,
  },
  {
    label: "Execution Drift Risk",
    desc:  "Execution losing consistency over time. Initiatives start with energy but accountability fades before completion.",
    flagged: (d: TeamDiagnostic) => (d.stageScores["Transform"] ?? 100) < 50,
  },
  {
    label: "Founder Dependency Risk",
    desc:  "Over-reliance on one or two people to drive delivery and decisions. The team stalls when they are unavailable.",
    flagged: (d: TeamDiagnostic) => (d.roleDistribution["Driver"] ?? 0) <= 1,
  },
  {
    label: "Communication Fragmentation",
    desc:  "Breakdown in information flow between roles. Important context is lost and people operate from different assumptions.",
    flagged: (d: TeamDiagnostic) => (d.roleDistribution["Connector"] ?? 0) === 0,
  },
];

const ROLE_COMM_GUIDE = [
  { role: "Driver",    motivates: "Clear goals, visible progress, accountability, speed, decisive leadership",  frustrates: "Slow decisions, endless discussion, vague next steps, no follow-through" },
  { role: "Connector", motivates: "Trust, inclusion, being heard, collaborative decisions, team harmony",        frustrates: "Rushed decisions, ignored input, unresolved conflict, cold communication" },
  { role: "Architect", motivates: "Clear process, logical structure, reliable systems, well-defined scope",      frustrates: "Ambiguity, last-minute changes, skipping steps, inconsistent standards" },
  { role: "Spotter",   motivates: "New challenges, strategic thinking, intellectual freedom, open questions",    frustrates: "Repetition, over-structure, locked-in plans, being told how rather than why" },
];

function buildTensionPatterns(roleDistribution: Record<string, number>) {
  const tensions = [];
  if ((roleDistribution["Driver"] ?? 0) > 0 && (roleDistribution["Architect"] ?? 0) > 0)
    tensions.push({ title: "Driver vs Architect", desc: "Drivers push for speed; Architects want the plan right before moving. Friction builds around launch timing, quality standards, and when 'good enough' is ready to ship. Left unmanaged this creates mutual frustration and delayed decisions." });
  if ((roleDistribution["Spotter"] ?? 0) > 0 && (roleDistribution["Driver"] ?? 0) > 0)
    tensions.push({ title: "Spotter vs Driver", desc: "Spotters want to explore new directions; Drivers want to finish what's started. Tension emerges around whether to pivot or commit — especially mid-execution when switching costs are high." });
  if ((roleDistribution["Connector"] ?? 0) > 0 && (roleDistribution["Driver"] ?? 0) > 0)
    tensions.push({ title: "Connector vs Driver", desc: "Connectors prioritise consensus and relational trust; Drivers prioritise outcomes and speed. Friction builds around pace of decisions and how much discussion is 'enough' before action." });
  if ((roleDistribution["Spotter"] ?? 0) > 0 && (roleDistribution["Architect"] ?? 0) > 0)
    tensions.push({ title: "Spotter vs Architect", desc: "Spotters want open exploration; Architects want defined structure. Tension emerges around how much freedom is given before a framework is imposed — and who decides when it's time to stop exploring." });
  if (tensions.length === 0)
    tensions.push({ title: "No Major Tension Detected", desc: "Your current role mix does not show strong predictive tension patterns. Monitor as team grows and roles become more defined under pressure. Tension often emerges when workload increases or deadlines compress." });
  return tensions;
}

const PRESSURE_RESPONSES = [
  { role: "Driver",    response: "Drivers become forceful — pushing harder, raising urgency, and sometimes steamrolling input. They may make unilateral decisions and lose awareness of team impact. Watch for communication breakdown and resentment building silently beneath a compliant surface." },
  { role: "Connector", response: "Connectors avoid conflict — staying quiet about concerns, smoothing over issues, and delaying necessary difficult conversations. They may agree outwardly while disconnecting internally. Watch for passive resistance and sudden disengagement after sustained pressure." },
  { role: "Architect", response: "Architects overanalyse — diving deeper into planning and hesitating to commit without complete information. They enter a loop of refinement that blocks decision-making. Watch for execution paralysis disguised as diligence and quality standards." },
  { role: "Spotter",   response: "Spotters become critical — pointing out what could go wrong, reframing the problem instead of solving it, and questioning direction at the worst moment. Watch for team destabilisation and loss of confidence when a Spotter's doubt becomes contagious." },
];

const SCALABILITY_DIMENSIONS = [
  { key: "leadership",     label: "Leadership Scalability",     desc: "Can the team sustain delivery without founder or lead overload as complexity grows?" },
  { key: "communication",  label: "Communication Scalability",  desc: "Can information flow reliably and without distortion as team size and project count increases?" },
  { key: "operational",    label: "Operational Scalability",    desc: "Are systems and processes in place to support more volume without breakdown or rework?" },
  { key: "sustainability", label: "Sustainability Scalability", desc: "Will improvements hold and compound after the initial change sprint ends?" },
  { key: "innovation",     label: "Innovation Scalability",     desc: "Can the team continue generating and testing new ideas at scale without losing execution quality?" },
];

function getScalabilityScore(key: string, d: TeamDiagnostic): number {
  const base: Record<string, number> = {
    leadership:     Math.min(100, (d.roleDistribution["Driver"] ?? 0) * 20 + (d.stageScores["Transform"] ?? 0) * 0.4),
    communication:  Math.min(100, (d.roleDistribution["Connector"] ?? 0) * 20 + (d.stageScores["Align"] ?? 0) * 0.4),
    operational:    Math.min(100, (d.roleDistribution["Architect"] ?? 0) * 20 + (d.stageScores["Prepare"] ?? 0) * 0.4),
    sustainability: Math.min(100, (d.stageScores["Sustain"] ?? 0)),
    innovation:     Math.min(100, (d.roleDistribution["Spotter"] ?? 0) * 20 + (d.stageScores["Alert"] ?? 0) * 0.4),
  };
  return Math.round(base[key] ?? 50);
}

function getHeatmapScore(dim: string, d: TeamDiagnostic): number {
  const map: Record<string, number> = {
    Trust:          d.stageScores["Align"] ?? 50,
    Communication:  Math.round(((d.stageScores["Align"] ?? 50) + (d.stageScores["Diagnose"] ?? 50)) / 2),
    Execution:      d.stageScores["Transform"] ?? 50,
    Sustainability: d.stageScores["Sustain"] ?? 50,
    Innovation:     d.stageScores["Alert"] ?? 50,
    Alignment:      Math.round(((d.stageScores["Align"] ?? 50) + (d.stageScores["Prepare"] ?? 50)) / 2),
  };
  return Math.round(map[dim] ?? 50);
}

function getTeamMaturity(d: TeamDiagnostic) {
  const avg = Object.values(d.stageScores).reduce((a, b) => a + b, 0) / 6;
  if (avg >= 75) return {
    level: "Strategic Leadership Team",
    description: "This team operates with high trust, clear execution patterns, and strong change capability across all six ADAPTS stages. They are able to lead complex transformation from within without external support.",
    risks: "Risk of complacency and under-challenging team members. Ensure continued growth through stretch goals, external exposure, and high-stakes initiative ownership.",
    nextStage: "Focus on innovation leadership, external market positioning, and scaling leadership depth beyond current key individuals.",
  };
  if (avg >= 60) return {
    level: "High-Trust Team",
    description: "Trust and communication are strong. Execution is mostly consistent and team members have a working understanding of their roles in the change system.",
    risks: "Risk of avoiding necessary disruption to preserve harmony. May need to push harder into uncomfortable strategic questions and harder performance conversations.",
    nextStage: "Build sustainability systems and scale operational capacity to support the next phase of growth.",
  };
  if (avg >= 45) return {
    level: "Scaling Team",
    description: "The team has functional foundations but faces growing pains under pressure. Capability gaps become visible and performance becomes uneven as complexity increases.",
    risks: "Risk of burning out key performers and losing trust if execution gaps are not addressed before the next major initiative is launched.",
    nextStage: "Strengthen alignment and execution consistency. Build role clarity before adding more people or projects to the team.",
  };
  if (avg >= 30) return {
    level: "Functional Team",
    description: "Core roles are in place but significant capability gaps are creating friction. The team works — but not efficiently — and performance is inconsistent across initiatives.",
    risks: "Risk of talent frustration and initiative failure if structural gaps are not acknowledged and directly addressed with investment and change.",
    nextStage: "Address missing roles, improve preparation and dialogue disciplines, and create shared accountability frameworks across the team.",
  };
  return {
    level: "Emerging Team",
    description: "The team is in early formation. Foundations are still being built and contribution patterns are not yet established, understood, or consistently applied.",
    risks: "Risk of early disengagement if people don't understand how they fit, what is expected, or how their contribution connects to team success.",
    nextStage: "Focus on role clarity, communication norms, and establishing shared operating agreements before scaling headcount or project complexity.",
  };
}

function getIdealHire(d: TeamDiagnostic) {
  if ((d.roleDistribution["Connector"] ?? 0) === 0) return {
    role: "Connector / Culture Lead",
    reason: "Your team has no trust-builder or alignment anchor. As complexity grows, conflict and silent disengagement will become your biggest risks — not strategy or execution capacity.",
    improvement: "Faster alignment, healthier conflict resolution, stronger retention, improved cross-team communication, and a culture people actively choose to stay in.",
  };
  if ((d.roleDistribution["Architect"] ?? 0) === 0) return {
    role: "Architect / Operations Lead",
    reason: "Your team lacks a systems thinker. Good work is being done inconsistently, and processes are likely informal or undocumented — creating rework, scaling resistance, and repeated mistakes.",
    improvement: "Reliable delivery standards, scalable processes, reduced rework, clearer operational ownership, and systems that run without direct founder involvement.",
  };
  if ((d.roleDistribution["Spotter"] ?? 0) === 0) return {
    role: "Spotter / Strategy Advisor",
    reason: "Your team has no strategic radar. You may be executing effectively in the wrong direction — missing market shifts, better approaches, or early risk signals that a Spotter would catch.",
    improvement: "Improved strategic positioning, earlier detection of execution risk, better-informed pivots, and more confident long-range planning.",
  };
  return {
    role: "Driver / Execution Lead",
    reason: "Adding another Driver increases delivery capacity and distributes accountability — reducing bottlenecks and leader overload as projects grow in volume and cross-functional complexity.",
    improvement: "Higher execution throughput, distributed accountability, reduced leader overload, and a stronger delivery culture across the team.",
  };
}

function getCompatibilityPairings(d: TeamDiagnostic, type: "strong" | "tension") {
  const roles = Object.entries(d.roleDistribution).filter(([, c]) => c > 0).map(([r]) => r);
  const strongPairs: Record<string, string> = {
    "Driver+Architect":   "Driver ↔ Architect — speed meets structure",
    "Connector+Spotter":  "Connector ↔ Spotter — trust meets vision",
    "Driver+Connector":   "Driver ↔ Connector — results meet relationships",
    "Architect+Spotter":  "Architect ↔ Spotter — systems meet strategy",
  };
  const tensionPairs: Record<string, string> = {
    "Driver+Connector":  "Driver ↔ Connector — pace vs inclusion",
    "Spotter+Architect": "Spotter ↔ Architect — exploration vs structure",
    "Driver+Spotter":    "Driver ↔ Spotter — commit vs pivot",
  };
  const pairs = type === "strong" ? strongPairs : tensionPairs;
  return Object.entries(pairs)
    .filter(([k]) => k.split("+").every(r => roles.includes(r)))
    .map(([, v]) => v)
    .slice(0, 4);
}

function buildBottlenecks(
  roleDistribution: Record<string, number>,
  stageHealth: Record<string, string>,
  riskScore: number,
): Array<{ icon: string; title: string; desc: string }> {
  const b: Array<{ icon: string; title: string; desc: string }> = [];

  if ((roleDistribution["Driver"] ?? 0) === 0)
    b.push({ icon: "⚡", title: "Execution Vacuum", desc: "No Driver present. Plans and strategies are unlikely to convert into consistent momentum. Delivery depends on whoever has the most urgency on any given day — creating unpredictable output and missed deadlines." });
  if ((roleDistribution["Connector"] ?? 0) === 0)
    b.push({ icon: "🔗", title: "Communication Bottleneck", desc: "No Connector present. Information flow is fragmented and trust is not being actively maintained. Misalignment accumulates silently until it surfaces as conflict, disengagement, or failed handoffs between team members." });
  if ((roleDistribution["Architect"] ?? 0) === 0)
    b.push({ icon: "🏗️", title: "Systems & Process Gap", desc: "No Architect present. Execution is ad hoc and processes are likely undocumented. The team rebuilds the same solutions repeatedly without a scalable foundation — creating rework, inconsistent quality, and onboarding problems." });
  if (stageHealth["Sustain"] === "Critical" || stageHealth["Sustain"] === "At Risk")
    b.push({ icon: "📉", title: "Sustainability Breakdown", desc: "The Sustain stage is critically weak. Improvements are not being institutionalised — the team reverts to old patterns after each change sprint ends, making progress feel temporary and exhausting for those who drove it." });
  if (stageHealth["Align"] === "Critical" || stageHealth["Align"] === "At Risk")
    b.push({ icon: "🗣️", title: "Alignment Deficit", desc: "The Align stage is weak. Decisions are being made without sufficient buy-in and dissenting voices are not being surfaced before execution begins. Silent resistance is likely building beneath the surface." });
  if (stageHealth["Prepare"] === "Critical" || stageHealth["Prepare"] === "At Risk")
    b.push({ icon: "📋", title: "Launch Without Readiness", desc: "The Prepare stage is weak. The team is moving into execution before capability, capacity, or confidence has been verified — creating preventable failure, rework, and team frustration with repeated missed launches." });
  if (riskScore >= 60)
    b.push({ icon: "🚨", title: "High Organisational Risk", desc: "Multiple compounding gaps are present. Without structural intervention, execution quality will degrade significantly as team size and project complexity increase. The risk compounds faster than it appears." });
  if (b.length === 0)
    b.push({ icon: "✅", title: "No Critical Bottlenecks Detected", desc: "Your team has a well-rounded profile with no major execution bottlenecks. Focus on sustaining current strengths and deepening capability in your lowest-scoring ADAPTS stages to reach Strategic Leadership Team status." });

  return b;
}

// ── Page builders ──────────────────────────────────────────────

function coverPage(
  teamName: string, memberCount: number, capacityScore: number,
  date: string, tierLabel: string, diagnostic: TeamDiagnostic
): string {
  const riskColor = diagnostic.riskLevel === "Low" ? C.green : diagnostic.riskLevel === "Moderate" ? C.amber : C.red;

  // Find which energy each member contributes most to dominant
  const dominantColor = ENERGY_COLORS[diagnostic.dominantEnergy] ?? C.gold;

  // ADAPTS stage meaning
  const STAGE_MEANING: Record<string, string> = {
    Alert:     "Recognises signals, risks, and opportunities early",
    Diagnose:  "Identifies root causes and real problems",
    Prepare:   "Builds structure, readiness, and systems",
    Align:     "Creates trust, communication, and shared direction",
    Transform: "Turns plans into execution and measurable movement",
    Sustain:   "Maintains consistency, rhythm, and long-term growth",
  };

  // Role meaning
  const ROLE_MEANING: Record<string, string> = {
    Driver:    "Moves execution forward",
    Connector: "Builds trust and alignment",
    Architect: "Creates structure and clarity",
    Spotter:   "Sees patterns and possibilities",
  };

  // Energy meaning
  const ENERGY_MEANING: Record<string, string> = {
    Achiever:  "Energised by progress and results",
    Unifier:   "Energised by people and connection",
    Organizer: "Energised by structure and order",
    Innovator: "Energised by ideas and possibilities",
  };

  // Score band meaning
  const scoreBand = (score: number) =>
    score >= 70 ? { label: "Strong", color: C.green } :
    score >= 50 ? { label: "Solid",  color: C.purple } :
    score >= 30 ? { label: "At Risk", color: C.amber } :
                  { label: "Critical", color: C.red };

  return page(`
    <div style="display:flex;flex-direction:column;gap:18px">

      <!-- Header -->
      <div>
        <div class="label" style="color:${C.purple};margin-bottom:10px">TEAM ASSESSMENT REPORT · ${tierLabel.toUpperCase()}</div>
        <h1 style="font-size:36px;line-height:1.1;margin-bottom:6px">TEAM CHANGE MAP™</h1>
        <div style="width:48px;height:3px;background:${C.gold};margin-bottom:10px"></div>
        <p style="font-size:15px;color:${C.gray};font-weight:300;margin-bottom:2px">${teamName}</p>
        <p style="font-size:11px;color:${C.gray}">Assessment Date: ${date} &nbsp;·&nbsp; ${memberCount} Team Member${memberCount !== 1 ? "s" : ""}</p>
      </div>

      <!-- Summary bar -->
      <div style="background:${C.navy};border-radius:12px;padding:20px 24px;color:white;style="margin-top:30px;"">
        <div class="label" style="color:rgba(255,255,255,0.5);margin-bottom:12px">TEAM OVERVIEW</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px">
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:2px;text-transform:uppercase;letter-spacing:.08em">Team Size</div>
            <div style="font-size:26px;font-weight:900">${memberCount}</div>
          </div>
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:2px;text-transform:uppercase;letter-spacing:.08em">Capacity Score™</div>
            <div style="font-size:26px;font-weight:900;color:${C.gold}">${capacityScore}<span style="font-size:12px;font-weight:400;color:rgba(255,255,255,0.4)">/100</span></div>
          </div>
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:2px;text-transform:uppercase;letter-spacing:.08em">Dominant Energy</div>
            <div style="font-size:18px;font-weight:800;color:${dominantColor}">${diagnostic.dominantEnergy}</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:2px">${ENERGY_MEANING[diagnostic.dominantEnergy] ?? ""}</div>
          </div>
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:2px;text-transform:uppercase;letter-spacing:.08em">Risk Level</div>
            <div style="font-size:18px;font-weight:800;color:${riskColor}">${diagnostic.riskLevel}</div>
          </div>
        </div>
        ${diagnostic.missingRoles.length > 0
          ? `<div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:7px;padding:9px 12px">
               <span style="font-size:10px;font-weight:700;color:#FCA5A5;letter-spacing:.08em;text-transform:uppercase">⚠ Missing Roles: </span>
               <span style="font-size:11px;color:#FCA5A5">${diagnostic.missingRoles.join(", ")} — execution gaps active</span>
             </div>`
          : `<div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:7px;padding:9px 12px">
               <span style="font-size:10px;font-weight:700;color:#6EE7B7;letter-spacing:.08em;text-transform:uppercase">✓ All Four Roles Represented </span>
               <span style="font-size:11px;color:#6EE7B7">— Complete change capability profile</span>
             </div>`}
      </div>

      <!-- Dominant energy source -->
      <div style="background:${dominantColor}12;border:1px solid ${dominantColor}40;border-radius:10px;padding:14px 16px;margin-top:30px;">
        <div class="label" style="color:${dominantColor};margin-bottom:8px">DOMINANT ENERGY SOURCE — ${diagnostic.dominantEnergy.toUpperCase()}</div>
        <p style="font-size:11px;color:${C.navy};margin-bottom:8px">
          The team's dominant productivity energy is <strong>${diagnostic.dominantEnergy}</strong> — ${ENERGY_MEANING[diagnostic.dominantEnergy]}. 
          This is derived from the average energy scores across all ${memberCount} assessed members. 
          It reflects what collectively gives this team momentum, focus, and sustainable performance.
        </p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
          ${Object.entries(diagnostic.energyScores)
            .sort(([,a],[,b]) => b - a)
            .map(([energy, score]) => {
              const ec = ENERGY_COLORS[energy] ?? C.purple;
              const isDominant = energy === diagnostic.dominantEnergy;
              return `<div style="text-align:center;padding:8px 6px;background:${isDominant ? ec+'22' : C.grayLight};border-radius:7px;border-top:2px solid ${isDominant ? ec : C.gray}">
                <div style="font-size:10px;font-weight:700;color:${isDominant ? ec : C.gray};margin-bottom:2px">${energy}</div>
                <div style="font-size:16px;font-weight:800;color:${isDominant ? ec : C.navy}">${Math.round(score)}</div>
                <div style="font-size:8px;color:${C.gray}">${ENERGY_MEANING[energy]?.split(' ').slice(0,3).join(' ')}...</div>
              </div>`;
            }).join("")}
        </div>
      </div>

      <!-- ADAPTS stage scores with meaning -->
      <div style="margin-top:30px;">
        <div class="label" style="color:${C.gray};margin-bottom:8px">ADAPTS™ STAGE SCORES — WHAT EACH STAGE MEANS</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px">
          ${Object.entries(diagnostic.stageScores).map(([stage, score]) => {
            const band = scoreBand(score);
            return `<div style="padding:10px;background:${C.grayLight};border-radius:8px;border-left:3px solid ${band.color}">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                <div style="font-size:11px;font-weight:700;color:${C.navy}">${stage}</div>
                <div style="font-size:14px;font-weight:900;color:${band.color}">${Math.round(score)}</div>
              </div>
              <div style="font-size:9px;color:${C.gray};margin-bottom:3px">${STAGE_MEANING[stage] ?? ""}</div>
              <div style="font-size:9px;font-weight:700;color:${band.color}">${band.label}</div>
            </div>`;
          }).join("")}
        </div>
      </div>

      <!-- Role distribution with meaning -->
      <div style="margin-top:30px;">
        <div class="label" style="color:${C.gray};margin-bottom:8px">CHANGE GENIUS™ ROLE DISTRIBUTION — WHAT EACH ROLE CONTRIBUTES</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px">
          ${Object.entries(diagnostic.roleDistribution).map(([role, count]) => {
            const color = count === 0 ? C.red : count >= 3 ? C.amber : C.green;
            return `<div style="text-align:center;padding:10px 8px;background:${count === 0 ? "#FEF2F2" : C.grayLight};border-radius:8px;border-top:3px solid ${color}">
              <div style="font-size:11px;font-weight:700;color:${C.navy};margin-bottom:2px">${role}</div>
              <div style="font-size:20px;font-weight:900;color:${color};margin-bottom:3px">${count}</div>
              <div style="font-size:8px;color:${C.gray};line-height:1.4">${ROLE_MEANING[role] ?? ""}</div>
              <div style="font-size:8px;font-weight:700;color:${color};margin-top:2px">${count === 0 ? "MISSING" : count === 1 ? "1 member" : `${count} members`}</div>
            </div>`;
          }).join("")}
        </div>
      </div>

      <p style="font-size:10px;color:${C.gray};text-align:center">Prepared for team development and organisational insight · Change Genius™ · changegeniusai.com</p>
    </div>
  `);
}

function adaptsCoveragePage(
  stageScores: Record<string, number>,
  roleDistribution: Record<string, number>,
  energyScores: Record<string, number>,
  pageNum: number
): string {
  const sorted    = Object.entries(stageScores).sort((a, b) => b[1] - a[1]);
  const topStages = sorted.slice(0, 2).map(([s]) => s);
  const botStages = sorted.slice(-2).map(([s]) => s);

  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">TEAM RESULTS</div>
    <h2 style="margin-bottom:3px">Team ADAPTS™ Stage Coverage</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">How well your team covers the six stages of organisational change. Scores reflect team average.</p>
    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px">
      ${sorted.map(([stage, avg]) => {
        const isTop = topStages.includes(stage);
        const isBot = botStages.includes(stage);
        const color = isTop ? C.green : isBot ? C.red : C.purple;
        const badge = isTop
          ? `<span style="background:${C.green}22;color:${C.green};font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap">Team Strength ✦</span>`
          : isBot
          ? `<span style="background:${C.red}22;color:${C.red};font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap">Coverage Gap ⚠</span>`
          : `<span style="background:${C.purple}22;color:${C.purple};font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">Solid</span>`;
        return `
        <div style="margin-top:10px;padding:11px 13px;background:${color}08;border-radius:9px;border-left:3px solid ${color}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
            <div style="flex:1;min-width:0;padding-right:10px">
              <span style="font-size:13px;font-weight:700;color:${C.navy}">${stage}</span>
              <span style="font-size:11px;color:${C.gray};margin-left:7px">${STAGE_DESCRIPTIONS[stage] ?? ""}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              ${badge}
              <span style="font-size:14px;font-weight:800;color:${color};min-width:26px;text-align:right">${Math.round(avg)}</span>
            </div>
          </div>
          ${scoreBar(Math.round(avg), color, 7)}
        </div>`;
      }).join("")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:25px">
      <div style="background:${C.green}10;border-radius:10px;padding:14px 16px;border-left:4px solid ${C.green}">
        <div class="label" style="color:${C.green};margin-bottom:8px">TEAM STRENGTHS</div>
        ${topStages.map(s => `
          <div style="margin-bottom:7px">
            <div style="font-size:13px;font-weight:700;color:${C.navy}">${s}</div>
            <div style="font-size:11px;color:#374151;margin-top:1px">${STAGE_DESCRIPTIONS[s] ?? ""}</div>
          </div>`).join("")}
      </div>
      <div style="background:${C.red}10;border-radius:10px;padding:14px 16px;border-left:4px solid ${C.red}">
        <div class="label" style="color:${C.red};margin-bottom:8px">COVERAGE GAPS</div>
        ${botStages.map(s => `
          <div style="margin-bottom:7px">
            <div style="font-size:13px;font-weight:700;color:${C.navy}">${s}</div>
            <div style="font-size:11px;color:#374151;margin-top:1px">${STAGE_DESCRIPTIONS[s] ?? ""}</div>
          </div>`).join("")}
      </div>
    </div>

    <h3 style="margin-bottom:10px;margin-top:30px">Team Energy Mix</h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      ${Object.entries(energyScores).map(([energy, avg]) => {
        const color = ENERGY_COLORS[energy] ?? C.purple;
        const rounded = Math.round(avg);
        return `
        <div style="background:${C.grayLight};border-radius:10px;padding:13px;text-align:center;border-top:3px solid ${color}">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px;color:${color}">${energy}</div>
          <div style="font-size:26px;font-weight:900;color:${color}">${rounded}</div>
          <div style="font-size:10px;color:${C.gray};margin-top:2px;margin-bottom:6px">avg score</div>
          ${scoreBar(rounded, color, 5)}
        </div>`;
      }).join("")}
    </div>
  `, pageNum);
}

function frictionAndRecommendationsPage(
  frictionPatterns: string[],
  rollout90Days: string[],
  pageNum: number,
  tier: 1 | 2 | 3
): string {
  const visibleFriction = tier === 1 ? frictionPatterns.slice(0, 1) : frictionPatterns;
  const visibleRollout  = tier === 1 ? rollout90Days.slice(0, 1)    : rollout90Days;
  const lockedCount     = tier === 1 ? Math.max(0, frictionPatterns.length - 1) : 0;

  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">TEAM DIAGNOSTICS</div>
    <h2 style="margin-bottom:3px">Friction Patterns & Recommendations</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">Detected patterns that create execution friction and recommended actions to address them.</p>
    <div class="divider"></div>

    <h3 style="margin-bottom:10px;color:${C.amber}">DETECTED FRICTION PATTERNS</h3>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${visibleFriction.length > 0
        ? visibleFriction.map(f => `
          <div style="background:#FEF3C7;border-left:4px solid ${C.amber};border-radius:0 9px 9px 0;padding:13px 15px">
            <p style="margin:0;color:#92400E;font-size:13px">${f}</p>
          </div>`).join("")
        : `<div style="background:#ECFDF5;border-left:4px solid ${C.green};border-radius:0 9px 9px 0;padding:13px 15px">
            <p style="margin:0;color:#065F46;font-size:13px">No significant friction patterns detected. Your team has a well-balanced profile with strong coverage across roles and ADAPTS stages.</p>
           </div>`
      }
      ${lockedCount > 0 ? `
        <div style="position:relative;border-radius:10px;overflow:hidden;border:2px dashed #D1D5DB;padding:16px;background:#F9FAFB;min-height:70px">
          <div style="opacity:0.2">
            <div class="label" style="margin-bottom:6px">+${lockedCount} more friction pattern${lockedCount > 1 ? "s" : ""} detected</div>
            <div style="height:9px;background:#9CA3AF;border-radius:4px;margin-bottom:5px;width:85%"></div>
            <div style="height:9px;background:#9CA3AF;border-radius:4px;margin-bottom:5px;width:65%"></div>
          </div>
          <div class="locked-overlay"><span style="font-size:16px">🔒</span><span class="lock-badge">LOCKED</span></div>
        </div>` : ""}
    </div>

    <h3 style="margin-bottom:10px">90-DAY RECOMMENDATIONS</h3>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${visibleRollout.map((r, i) => `
        <div style="display:flex;gap:12px;align-items:flex-start;padding:13px;background:${C.grayLight};border-radius:8px">
          <div class="num-badge">${i + 1}</div>
          <p style="margin:0;font-size:13px">${r}</p>
        </div>`).join("")}
    </div>

    ${tier === 1 ? `
    <h3 style="margin-bottom:10px">STARTER RECOMMENDATIONS</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:4px">
      <div style="background:${C.grayLight};border-radius:9px;padding:13px;border-top:3px solid ${C.purple}">
        <div class="label" style="color:${C.purple};margin-bottom:6px">Communication</div>
        <p style="font-size:12px;margin:0">Agree on one shared communication channel and a weekly rhythm before scaling team size or project complexity.</p>
      </div>
      <div style="background:${C.grayLight};border-radius:9px;padding:13px;border-top:3px solid ${C.green}">
        <div class="label" style="color:${C.green};margin-bottom:6px">Role Awareness</div>
        <p style="font-size:12px;margin:0">Share individual Change Genius™ profiles so each person understands how they contribute to the team system and where tensions may arise.</p>
      </div>
      <div style="background:${C.grayLight};border-radius:9px;padding:13px;border-top:3px solid ${C.amber}">
        <div class="label" style="color:${C.amber};margin-bottom:6px">Delegation</div>
        <p style="font-size:12px;margin:0">Identify one task each person is doing that would be better owned by someone with a different role strength. Reassign it this week.</p>
      </div>
    </div>
    ${upgradeCTA(
      "Unlock Full Team Intelligence",
      "Add more team members to unlock deeper diagnostics, leadership insights, execution bottlenecks, and scaling recommendations."
    )}` : ""}
  `, pageNum);
}

function tier1LockedPage(pageNum: number): string {
  const features = [
    { label: "Team Bottleneck Analysis",    desc: "Identifies where execution breaks down, communication fails, and leadership overloads across your team system." },
    { label: "Leadership Dynamics",          desc: "Reveals how your leadership team makes decisions, responds to conflict, and distributes authority under pressure." },
    { label: "Scaling Diagnostics",          desc: "Five-dimension scalability assessment across leadership, communication, operations, sustainability, and innovation." },
    { label: "Hiring Recommendations",       desc: "AI-generated ideal next hire based on your team's role gaps and execution weaknesses — with impact analysis." },
    { label: "Pressure Response Analysis",   desc: "How each role behaves under high pressure — and what specific risks that creates for team performance and trust." },
    { label: "Team Maturity Level",           desc: "Five-stage maturity framework showing where your team is now, what risks exist, and what's needed to reach the next level." },
    { label: "Full 90-Day Roadmap",           desc: "Phase-by-phase transformation plan built from your specific role gaps, stage scores, and friction patterns." },
    { label: "Role Tension Forecast",         desc: "Predicts the most likely communication friction and accountability conflicts before they appear — and how to prevent them." },
  ];
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">LOCKED FEATURES</div>
    <h2 style="margin-bottom:3px">Full Team Intelligence Preview</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:16px">The following insights unlock as your team grows. Each member added deepens the organizational intelligence available.</p>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:16px">
      ${features.map(f => lockedCard(f.label, f.desc)).join("")}
    </div>

    ${upgradeCTA(
      "Unlock Full Team Intelligence",
      "Add more team members to unlock deeper diagnostics, leadership insights, execution bottlenecks, and scaling recommendations."
    )}
  `, pageNum);
}

function teamDynamicsPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">TEAM DYNAMICS</div>
    <h2 style="margin-bottom:3px">Team Identity, Risk Analysis & Communication Guide</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">How this team operates, where leadership risks are forming, and how to communicate with each role.</p>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px">
      <div style="background:${C.grayLight};border-radius:10px;padding:15px">
        <div class="label" style="color:${C.navy};margin-bottom:7px">DOMINANT ENERGY</div>
        <div style="font-size:19px;font-weight:800;color:${ENERGY_COLORS[diagnostic.dominantEnergy] ?? C.purple};margin-bottom:5px">${diagnostic.dominantEnergy}</div>
        <p style="font-size:12px;margin:0">${ENERGY_TEAM_DESC[diagnostic.dominantEnergy] ?? ""}</p>
      </div>
      <div style="background:${C.grayLight};border-radius:10px;padding:15px">
        <div class="label" style="color:${C.navy};margin-bottom:7px">CHANGE RISK LEVEL</div>
        <div style="font-size:19px;font-weight:800;color:${diagnostic.riskLevel === "Low" ? C.green : diagnostic.riskLevel === "Moderate" ? C.amber : C.red};margin-bottom:5px">${diagnostic.riskLevel}</div>
        <p style="font-size:12px;margin:0">${RISK_LEVEL_DESC[diagnostic.riskLevel]}</p>
      </div>
    </div>

    <h3 style="margin-bottom:9px">MISSING ROLE IMPACT</h3>
    <div style="margin-bottom:18px">
      ${diagnostic.missingRoles.length > 0
        ? diagnostic.missingRoles.map((role: string) => `
          <div style="background:#FEF2F2;border-left:4px solid ${C.red};border-radius:0 9px 9px 0;padding:12px 14px;margin-bottom:7px">
            <div style="font-weight:700;margin-bottom:3px;color:#991B1B;font-size:13px">Missing: ${role}</div>
            <p style="margin:0;font-size:12px;color:#7F1D1D">${MISSING_ROLE_IMPACT[role] ?? ""}</p>
          </div>`).join("")
        : `<div style="background:#ECFDF5;border-left:4px solid ${C.green};padding:12px 14px;border-radius:0 9px 9px 0">
            <p style="margin:0;color:#065F46;font-size:13px">All four roles are represented — your team has a complete change capability profile. Focus on depth and collaboration between roles rather than filling gaps.</p>
           </div>`
      }
    </div>

    <h3 style="margin-bottom:9px">LEADERSHIP RISK ALERTS</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px">
      ${LEADERSHIP_RISKS.map(({ label, desc, flagged }) => {
        const active = flagged(diagnostic);
        return `
        <div style="background:${active ? "#FEF3C7" : C.grayLight};border-radius:10px;padding:13px;border-left:3px solid ${active ? C.amber : C.green}">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px">
            <span style="font-size:12px">${active ? "⚠️" : "✓"}</span>
            <div style="font-size:12px;font-weight:700;color:${active ? "#92400E" : C.navy}">${label}</div>
          </div>
          <p style="font-size:11px;margin:0;color:${active ? "#78350F" : C.gray}">${desc}</p>
        </div>`;
      }).join("")}
    </div>

    <h3 style="margin-bottom:9px">TEAM COMMUNICATION GUIDE</h3>
    <div style="display:flex;flex-direction:column;gap:7px">
      ${ROLE_COMM_GUIDE.filter(g => (diagnostic.roleDistribution[g.role as Role] ?? 0) > 0).map(g => `
        <div style="display:grid;grid-template-columns:88px 1fr 1fr;gap:10px;padding:11px 13px;background:${C.grayLight};border-radius:8px;align-items:start">
          <div style="font-weight:700;font-size:13px;color:${C.navy}">${g.role}</div>
          <div>
            <div class="label" style="color:${C.green};margin-bottom:3px">Motivated by</div>
            <p style="font-size:11px;margin:0">${g.motivates}</p>
          </div>
          <div>
            <div class="label" style="color:${C.red};margin-bottom:3px">Frustrated by</div>
            <p style="font-size:11px;margin:0">${g.frustrates}</p>
          </div>
        </div>`).join("")}
    </div>
  `, pageNum);
}

function roleTensionPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const tensions = buildTensionPatterns(diagnostic.roleDistribution);
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">TEAM DYNAMICS</div>
    <h2 style="margin-bottom:3px">Role Tension Forecast & Scalability Assessment</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">Predicted friction patterns between roles and how well your team is positioned to scale.</p>
    <div class="divider"></div>

    <h3 style="margin-bottom:9px;color:${C.amber}">LIKELY TENSION PATTERNS</h3>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${tensions.map(t => `
        <div style="background:#FEF3C7;border-left:4px solid ${C.amber};border-radius:0 9px 9px 0;padding:12px 14px">
          <div style="font-weight:700;margin-bottom:3px;color:#92400E;font-size:13px">${t.title}</div>
          <p style="margin:0;font-size:12px;color:#78350F">${t.desc}</p>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:9px">SCALABILITY ASSESSMENT</h3>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${SCALABILITY_DIMENSIONS.map(dim => {
        const score = getScalabilityScore(dim.key, diagnostic);
        const color = score >= 70 ? C.green : score >= 45 ? C.amber : C.red;
        return `
        <div style="margin-top:20px;padding:11px 13px;background:${color}08;border-radius:9px;border-left:3px solid ${color}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:13px;font-weight:700">${dim.label}</span>
            <span style="font-size:13px;font-weight:800;color:${color}">${score}/100</span>
          </div>
          ${scoreBar(score, color, 7)}
          <p style="font-size:11px;color:${C.gray};margin-top:5px;margin-bottom:0">${dim.desc}</p>
        </div>`;
      }).join("")}
    </div>

  `, pageNum);
}

function tier2LockedPage(pageNum: number): string {
  const features = [
    { label: "Full Execution Diagnostics™",          desc: "Deep analysis of where execution is breaking down across delegation, communication, and accountability." },
    { label: "Team Pressure Heatmap™",               desc: "Visual map of team performance across six critical organizational dimensions under pressure." },
    { label: "Leadership Compatibility Analysis™",   desc: "Strongest pairings, highest tension combinations, and how to manage them for sustained performance." },
    { label: "Hiring Intelligence™",                 desc: "Role-specific ideal hire with detailed impact analysis for your exact team composition." },
    { label: "Team Maturity Analysis™",              desc: "Five-stage maturity level with current position, active risks, and specific actions to reach the next stage." },
    { label: "Full 90-Day Transformation Roadmap™", desc: "Phase-by-phase transformation plan tied directly to your role gaps, ADAPTS scores, and friction patterns." },
  ];
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">PREMIUM FEATURES</div>
    <h2 style="margin-bottom:3px">Organizational Intelligence Preview</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:16px">These features unlock when your team reaches 8 or more members — revealing executive-level organisational intelligence.</p>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:16px">
      ${features.map(f => lockedCard(f.label, f.desc)).join("")}
    </div>

    ${upgradeCTA(
      "Unlock Full Organizational Intelligence™",
      "Add 8 or more team members to unlock advanced execution diagnostics, scaling intelligence, hiring recommendations, and full transformation insights."
    )}
  `, pageNum);
}

function executionBottleneckPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const bottlenecks = buildBottlenecks(diagnostic.roleDistribution, diagnostic.stageHealth, diagnostic.riskScore);
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">EXECUTION INTELLIGENCE</div>
    <h2 style="margin-bottom:3px">Execution Bottleneck Analysis</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">Where execution is breaking down and what it costs your team's performance and scale potential.</p>
    <div class="divider"></div>

    <h3 style="margin-bottom:9px">BOTTLENECK DIAGNOSTICS</h3>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${bottlenecks.map(b => `
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 14px;background:#FEF2F2;border-radius:9px;border-left:4px solid ${C.red}">
          <div style="flex-shrink:0;font-size:17px;margin-top:1px">${b.icon}</div>
          <div>
            <div style="font-weight:700;margin-bottom:3px;color:#991B1B;font-size:13px">${b.title}</div>
            <p style="margin:0;font-size:12px;color:#7F1D1D">${b.desc}</p>
          </div>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:9px">SCALABILITY DIAGNOSTICS</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${SCALABILITY_DIMENSIONS.map(dim => {
        const score = getScalabilityScore(dim.key, diagnostic);
        const color = score >= 70 ? C.green : score >= 45 ? C.amber : C.red;
        return `
        <div style="padding:11px 13px;background:${color}08;border-radius:9px;border-left:3px solid ${color}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:13px;font-weight:700">${dim.label}</span>
            <span style="font-size:13px;font-weight:800;color:${color}">${score}/100</span>
          </div>
          ${scoreBar(score, color, 7)}
          <p style="font-size:11px;color:${C.gray};margin-top:4px;margin-bottom:0">${dim.desc}</p>
        </div>`;
      }).join("")}
    </div>
  `, pageNum);
}

function pressureAndMaturityPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const HEATMAP_DIMS = ["Trust","Communication","Execution","Sustainability","Innovation","Alignment"];
  const maturity = getTeamMaturity(diagnostic);
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">EXECUTION INTELLIGENCE</div>
    <h2 style="margin-bottom:3px">Pressure Response, Risk Heatmap & Team Maturity</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">How your team behaves under pressure, where your risk concentrations are, and your current maturity level.</p>
    <div class="divider"></div>

    <h3 style="margin-bottom:9px">EXECUTION RISK HEATMAP</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
      ${HEATMAP_DIMS.map(dim => {
        const score = getHeatmapScore(dim, diagnostic);
        const color = score >= 70 ? C.green : score >= 45 ? C.amber : C.red;
        return `
        <div style="border-radius:10px;padding:13px;text-align:center;background:${color}12;border:2px solid ${color}">
          <div style="font-size:12px;font-weight:700;margin-bottom:3px;color:${C.navy}">${dim}</div>
          <div style="font-size:24px;font-weight:900;color:${color}">${score}</div>
          <div style="font-size:10px;color:${color};font-weight:700;margin-top:2px;margin-bottom:4px">${score >= 70 ? "Strong" : score >= 45 ? "Watch" : "Risk"}</div>
          ${scoreBar(score, color, 5)}
        </div>`;
      }).join("")}
    </div>

    <h3 style="margin-bottom:9px">PRESSURE RESPONSE ANALYSIS</h3>
    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:18px">
      ${PRESSURE_RESPONSES.filter(p => (diagnostic.roleDistribution[p.role as Role] ?? 0) > 0).map(p => `
        <div style="display:grid;grid-template-columns:88px 1fr;gap:11px;padding:11px 13px;background:${C.grayLight};border-radius:8px">
          <div>
            <div style="font-weight:700;font-size:13px">${p.role}</div>
            <div style="font-size:10px;color:${C.gray};margin-top:2px">${diagnostic.roleDistribution[p.role as Role]} member${(diagnostic.roleDistribution[p.role as Role] ?? 0) > 1 ? "s" : ""}</div>
          </div>
          <div>
            <div class="label" style="color:${C.amber};margin-bottom:3px">Under Pressure</div>
            <p style="font-size:12px;margin:0">${p.response}</p>
          </div>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:9px">TEAM MATURITY LEVEL</h3>
    <div style="background:${C.navy};border-radius:12px;padding:18px 22px;color:white">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:9px">
        <div>
          <div class="label" style="color:${C.gold};margin-bottom:4px">CURRENT LEVEL</div>
          <div style="font-size:19px;font-weight:800">${maturity.level}</div>
        </div>
        <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:7px 12px;font-size:12px;color:rgba(255,255,255,0.65)">
          Avg Score: ${Math.round(Object.values(diagnostic.stageScores).reduce((a,b)=>a+b,0)/6)}/100
        </div>
      </div>
      <p style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:9px">${maturity.description}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:10px 13px">
          <div class="label" style="color:${C.gold};margin-bottom:3px">RISKS AT THIS STAGE</div>
          <p style="font-size:11px;color:rgba(255,255,255,0.7);margin:0">${maturity.risks}</p>
        </div>
        <div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:10px 13px">
          <div class="label" style="color:${C.gold};margin-bottom:3px">NEXT GROWTH STAGE</div>
          <p style="font-size:11px;color:rgba(255,255,255,0.7);margin:0">${maturity.nextStage}</p>
        </div>
      </div>
    </div>
  `, pageNum);
}

function hireAndCompatibilityPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const idealHire = getIdealHire(diagnostic);
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">ORGANIZATIONAL INTELLIGENCE</div>
    <h2 style="margin-bottom:3px">Hiring Intelligence, Compatibility & Culture Profile</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">Your ideal next hire, how leadership pairings will perform together, and your team's cultural profile.</p>
    <div class="divider"></div>

    <h3 style="margin-bottom:9px">IDEAL NEXT HIRE</h3>
    <div style="background:#EFF6FF;border-radius:12px;padding:18px 20px;border-left:5px solid #3B82F6;margin-bottom:18px">
      <div style="font-size:19px;font-weight:800;color:#1E40AF;margin-bottom:7px">${idealHire.role}</div>
      <p style="font-size:13px;color:#1E3A8A;margin-bottom:10px">${idealHire.reason}</p>
      <div style="background:#DBEAFE;border-radius:8px;padding:11px 13px">
        <div class="label" style="color:#3B82F6;margin-bottom:4px">WHAT IMPROVES AFTER HIRING</div>
        <p style="font-size:12px;color:#1E40AF;margin:0">${idealHire.improvement}</p>
      </div>
    </div>

    <h3 style="margin-bottom:9px">LEADERSHIP COMPATIBILITY ANALYSIS</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:18px">
      <div style="background:#ECFDF5;border-radius:10px;padding:14px;border-top:3px solid ${C.green}">
        <div class="label" style="color:${C.green};margin-bottom:8px">STRONGEST PAIRINGS</div>
        ${getCompatibilityPairings(diagnostic, "strong").length > 0
          ? getCompatibilityPairings(diagnostic, "strong").map(p => `<div style="font-size:12px;padding:5px 0;font-weight:600;border-bottom:1px solid ${C.grayLight}">${p}</div>`).join("")
          : `<p style="font-size:12px;color:${C.gray};margin:0">Expand team to reveal pairing analysis.</p>`}
      </div>
      <div style="background:#FEF2F2;border-radius:10px;padding:14px;border-top:3px solid ${C.red}">
        <div class="label" style="color:${C.red};margin-bottom:8px">HIGHEST TENSION</div>
        ${getCompatibilityPairings(diagnostic, "tension").length > 0
          ? getCompatibilityPairings(diagnostic, "tension").map(p => `<div style="font-size:12px;padding:5px 0;font-weight:600;border-bottom:1px solid ${C.grayLight}">${p}</div>`).join("")
          : `<p style="font-size:12px;color:${C.gray};margin:0">No high-tension pairings in current composition.</p>`}
      </div>
    </div>

    <h3 style="margin-bottom:9px">CULTURE & EXECUTION PROFILE</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
      <div style="background:${C.grayLight};border-radius:10px;padding:13px">
        <div class="label" style="color:${C.navy};margin-bottom:5px">EMOTIONAL CLIMATE</div>
        <p style="font-size:12px;margin:0">${ENERGY_TEAM_DESC[diagnostic.dominantEnergy] ?? "Balanced energy profile across the team."}</p>
      </div>
      <div style="background:${C.grayLight};border-radius:10px;padding:13px">
        <div class="label" style="color:${C.navy};margin-bottom:5px">ACCOUNTABILITY STYLE</div>
        <p style="font-size:12px;margin:0">${(diagnostic.roleDistribution["Driver"] ?? 0) > 1
          ? "Results-first accountability. The team holds itself to measurable standards — but may underinvest in relational trust and psychological safety."
          : (diagnostic.roleDistribution["Connector"] ?? 0) > 1
          ? "Relationship-first accountability. Trust is high but direct performance conversations may be softened or avoided to preserve harmony."
          : "Balanced accountability. Structure and relationships are weighted relatively equally across the team."}</p>
      </div>
      <div style="background:${C.grayLight};border-radius:10px;padding:13px">
        <div class="label" style="color:${C.navy};margin-bottom:5px">CONFLICT TENDENCY</div>
        <p style="font-size:12px;margin:0">${(diagnostic.roleDistribution["Connector"] ?? 0) === 0
          ? "High risk of unresolved conflict. No Connector to facilitate difficult conversations or maintain relational safety under pressure."
          : "Moderate conflict handling. Connectors provide a buffer — but Drivers may escalate faster than Connectors can absorb in high-pressure periods."}</p>
      </div>
      <div style="background:${C.grayLight};border-radius:10px;padding:13px">
        <div class="label" style="color:${C.navy};margin-bottom:5px">COLLABORATION BEHAVIOUR</div>
        <p style="font-size:12px;margin:0">${(diagnostic.roleDistribution["Architect"] ?? 0) > 0
          ? "Process-anchored collaboration. The team works best with defined roles, clear handoffs, and structured workflows."
          : "Fluid collaboration. The team adapts quickly but may lack structure needed for complex multi-person execution and consistent delivery."}</p>
      </div>
    </div>
  `, pageNum);
}

function fullRoadmapPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const { rollout90Days, missingRoles, frictionPatterns } = diagnostic;
  const phases = [
    { label: "Days 1–30",  color: C.purple, icon: "🧭", items: rollout90Days.filter((_, i) => i === 0) },
    { label: "Days 31–60", color: C.amber,  icon: "⚙️", items: rollout90Days.filter((_, i) => i === 1 || i === 2) },
    { label: "Days 61–90", color: C.green,  icon: "🚀", items: rollout90Days.filter((_, i) => i === 3) },
  ];

  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:5px">TRANSFORMATION ROADMAP</div>
    <h2 style="margin-bottom:3px">Full 90-Day Transformation Roadmap™</h2>
    <p style="color:${C.gray};font-size:12px;margin-bottom:0">A phase-by-phase plan built from your team's specific role gaps, ADAPTS scores, and friction patterns.</p>
    <div class="divider"></div>

    ${phases.map(phase => `
      <div style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;padding-bottom:7px;border-bottom:2px solid ${phase.color}22">
          <span style="font-size:17px">${phase.icon}</span>
          <div style="font-size:14px;font-weight:800;color:${phase.color}">${phase.label}</div>
        </div>
        <div style="border-left:3px solid ${phase.color};padding-left:13px;display:flex;flex-direction:column;gap:6px">
          ${phase.items.map(item => `
            <div style="background:${C.grayLight};border-radius:8px;padding:12px 13px">
              <p style="margin:0;font-size:13px">${item}</p>
            </div>`).join("")}
        </div>
      </div>`).join("")}

    <div style="display:grid;grid-template-columns:${missingRoles.length > 0 && frictionPatterns.length > 0 ? "1fr 1fr" : "1fr"};gap:11px;margin-top:6px">
      ${missingRoles.length > 0 ? `
        <div style="background:#EFF6FF;border-radius:10px;padding:14px 16px;border-left:4px solid #3B82F6">
          <div class="label" style="color:#3B82F6;margin-bottom:6px">PRIORITY HIRING GAPS</div>
          <p style="font-size:12px;color:#1E40AF;margin-bottom:8px">Missing roles — <strong>${missingRoles.join(", ")}</strong> — create compounding execution risk that grows with team size. Address within 60 days.</p>
          ${missingRoles.map(r => `<div style="font-size:11px;color:#3B82F6;padding:4px 0;border-top:1px solid #BFDBFE">→ Hire or develop <strong>${r}</strong> capability</div>`).join("")}
        </div>` : ""}
      ${frictionPatterns.length > 0 ? `
        <div style="background:#FEF3C7;border-radius:10px;padding:14px 16px;border-left:4px solid ${C.amber}">
          <div class="label" style="color:${C.amber};margin-bottom:6px">FRICTION TO RESOLVE</div>
          ${frictionPatterns.map(f => `<p style="font-size:12px;color:#92400E;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid #FDE68A">• ${f}</p>`).join("")}
        </div>` : ""}
    </div>
  `, pageNum);
}

// ── Main export ────────────────────────────────────────────────

export function buildTeamReportHTML(input: TeamReportInput): string {
  const { teamName, diagnostic, memberNames, date } = input;
  const { stageScores, energyScores, roleDistribution, riskScore, frictionPatterns, rollout90Days } = diagnostic;

  const memberCount        = memberNames.length;
  const teamChangeCapacity = 100 - riskScore;
  const tier: 2 | 3   = memberCount >= 8 ? 3 : memberCount >= 3 ? 2 : 2;
  const tierLabel          =  tier === 2 ? "Team Change Map" : "Full Organizational Intelligence";

  const pages: string[] = [];
  let p = 0;

  pages.push(coverPage(teamName, memberCount, teamChangeCapacity, date, tierLabel, diagnostic));
  pages.push(adaptsCoveragePage(stageScores, roleDistribution, energyScores, p++));
  if(tier !== 3){
    pages.push(frictionAndRecommendationsPage(frictionPatterns, rollout90Days, p++, tier));
  }

  // if (tier === 1) {
  //   pages.push(tier1LockedPage(p++));
  // }

  if (tier >= 2) {
    pages.push(teamDynamicsPage(diagnostic, p++));
    pages.push(roleTensionPage(diagnostic, p++));
  }

  if (tier === 2) {
    pages.push(tier2LockedPage(p++));
  }

  if (tier === 3) {
    pages.push(executionBottleneckPage(diagnostic, p++));
    pages.push(pressureAndMaturityPage(diagnostic, p++));
    pages.push(hireAndCompatibilityPage(diagnostic, p++));
    pages.push(fullRoadmapPage(diagnostic, p++));
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Change Genius™ Team Report — ${teamName}</title>
  <style>${BASE_CSS}</style>
</head>
<body>
  ${pages.join("\n")}
</body>
</html>`;
}
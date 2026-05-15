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

// ── Shared helpers ─────────────────────────────────────────────

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F8F9FB; }
  .page {
    width: 794px; min-height: 1123px; background: white;
    margin: 0 auto 32px; padding: 48px 52px;
    page-break-after: always; position: relative;
  }
  h2 { font-size: 26px; color: ${C.navy}; font-weight: 800; }
  h3 { font-size: 15px; color: ${C.navy}; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  p  { font-size: 13px; color: #374151; line-height: 1.6; }
  .label { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .divider { height: 2px; background: ${C.grayLight}; margin: 12px 0 20px; }
  .locked-card {
    position: relative; border-radius: 12px; overflow: hidden;
    border: 2px dashed #D1D5DB; padding: 24px;
    background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
  }
  .locked-overlay {
    position: absolute; inset: 0; backdrop-filter: blur(3px);
    background: rgba(255,255,255,0.55);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  }
  .lock-badge {
    background: ${C.navy}; color: white; font-size: 11px; font-weight: 700;
    padding: 6px 14px; border-radius: 20px; letter-spacing: .08em;
  }
  .upgrade-cta {
    background: linear-gradient(135deg, ${C.navy} 0%, #1e3a6e 100%);
    border-radius: 12px; padding: 22px 26px; color: white; text-align: center;
    margin-top: 20px;
  }
  .cta-btn {
    display: inline-block; margin-top: 12px;
    background: ${C.gold}; color: ${C.navy}; font-weight: 800;
    font-size: 12px; letter-spacing: .08em; padding: 10px 22px;
    border-radius: 20px; text-transform: uppercase;
  }
  @media print { .page { margin: 0; page-break-after: always; } }
`;

function page(content: string, pageNum?: number): string {
  const footer = pageNum !== undefined ? `
    <div style="position:absolute;bottom:28px;left:52px;right:52px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:10px;color:${C.gray}">Change Genius™ · Team Change Map™</span>
      <span style="font-size:10px;color:${C.gray}">Page ${pageNum + 1}</span>
    </div>` : "";
  return `<div class="page">${content}${footer}</div>`;
}

function scoreBar(value: number, color: string, height = 8): string {
  return `
    <div style="background:${C.grayLight};border-radius:99px;height:${height}px;overflow:hidden">
      <div style="width:${value}%;height:100%;background:${color};border-radius:99px;transition:width .3s"></div>
    </div>`;
}

function lockedCard(label: string, previewLines: string[] = []): string {
  return `
    <div class="locked-card">
      <div style="opacity:0.25">
        <div class="label" style="margin-bottom:10px">${label}</div>
        ${previewLines.map(l => `<div style="height:10px;background:#D1D5DB;border-radius:4px;margin-bottom:6px;width:${l}"></div>`).join("")}
      </div>
      <div class="locked-overlay">
        <span style="font-size:20px">🔒</span>
        <span class="lock-badge">LOCKED</span>
      </div>
    </div>`;
}

function upgradeCTA(headline: string, body: string): string {
  return `
    <div class="upgrade-cta">
      <div class="label" style="color:${C.gold};margin-bottom:6px">UPGRADE TO UNLOCK</div>
      <div style="font-size:16px;font-weight:800;margin-bottom:8px">${headline}</div>
      <p style="font-size:12px;color:rgba(255,255,255,0.75)">${body}</p>
      <span class="cta-btn">Unlock Full Intelligence →</span>
    </div>`;
}

// ── Shared pages (all tiers) ───────────────────────────────────

function coverPage(teamName: string, memberCount: number, capacityScore: number, date: string, tierLabel: string): string {
  return page(`
    <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:40px">
      <div>
        <div class="label" style="color:${C.purple};margin-bottom:24px">TEAM ASSESSMENT REPORT · ${tierLabel.toUpperCase()}</div>
        <h1 style="color:${C.navy};font-size:44px;line-height:1.1;margin-bottom:8px">TEAM CHANGE MAP™</h1>
        <div style="width:60px;height:4px;background:${C.gold};margin:20px 0 28px"></div>
        <p style="font-size:18px;color:${C.gray};font-weight:300">${teamName}</p>
      </div>

      <div style="background:${C.navy};border-radius:12px;padding:28px 32px;color:white;margin-top:40px;">
        <div class="label" style="color:rgba(255,255,255,0.6);margin-bottom:16px">TEAM SUMMARY</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
          <div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">TEAM SIZE</div>
            <div style="font-size:24px;font-weight:800">${memberCount}</div>
          </div>
          <div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">TEAM CAPACITY SCORE™</div>
            <div style="font-size:24px;font-weight:800;color:${C.gold}">${capacityScore}<span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.5)">/100</span></div>
          </div>
          <div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">DATE</div>
            <div style="font-size:16px;font-weight:700">${date}</div>
          </div>
        </div>
      </div>

      <p style="font-size:12px;color:${C.gray};text-align:center">Prepared for team development and organisational insight · changegeniusai.com</p>
    </div>
  `);
}

function stageCoveragePage(
  stageScores: Record<string, number>,
  roleDistribution: Record<string, number>,
  energyScores: Record<string, number>,
  pageNum: number
): string {
  const sorted    = Object.entries(stageScores).sort((a, b) => b[1] - a[1]);
  const topStages = sorted.slice(0, 2).map(([s]) => s);
  const botStages = sorted.slice(-2).map(([s]) => s);

  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">TEAM RESULTS</div>
    <h2 style="margin-bottom:4px">Team ADAPTS™ Coverage</h2>
    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
      ${sorted.map(([stage, avg]) => {
        const isTop = topStages.includes(stage);
        const isBot = botStages.includes(stage);
        const color = isTop ? C.green : isBot ? C.red : C.purple;
        return `
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:13px;font-weight:600">${stage}${isTop ? " ✦" : isBot ? " ⚠" : ""}</span>
            <span style="font-size:11px;color:${color};font-weight:700">${isTop ? "Team Strength" : isBot ? "Coverage Gap" : "Solid"} · ${Math.round(avg)}</span>
          </div>
          ${scoreBar(Math.round(avg), color)}
        </div>`;
      }).join("")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      <div style="background:${C.grayLight};border-radius:10px;padding:16px;border-left:4px solid ${C.green}">
        <div class="label" style="color:${C.green};margin-bottom:8px">TEAM STRENGTHS</div>
        ${topStages.map(s => `<div style="font-size:13px;font-weight:600;padding:3px 0">${s}</div>`).join("")}
      </div>
      <div style="background:${C.grayLight};border-radius:10px;padding:16px;border-left:4px solid ${C.red}">
        <div class="label" style="color:${C.red};margin-bottom:8px">COVERAGE GAPS</div>
        ${botStages.map(s => `<div style="font-size:13px;font-weight:600;padding:3px 0">${s}</div>`).join("")}
      </div>
    </div>

    <h3 style="margin-bottom:10px">Team Role Map</h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">
      ${Object.entries(roleDistribution).map(([role, count]) => `
        <div style="background:${C.grayLight};border-radius:10px;padding:12px;text-align:center">
          <div style="width:36px;height:36px;border-radius:50%;background:${C.navy};color:white;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 6px">${role[0]}</div>
          <div style="font-size:12px;font-weight:700">${role}</div>
          <div style="font-size:20px;font-weight:800;color:${count === 0 ? C.red : C.purple};margin-top:2px">${count}</div>
          <div style="font-size:10px;color:${C.gray}">${count === 0 ? "MISSING" : count === 1 ? "member" : "members"}</div>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:10px">Team Energy Mix</h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      ${Object.entries(energyScores).map(([energy, avg]) => {
        const color = ENERGY_COLORS[energy] ?? C.purple;
        return `
        <div style="background:${C.grayLight};border-radius:10px;padding:12px;text-align:center;border-top:3px solid ${color}">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px;color:${color}">${energy}</div>
          <div style="font-size:22px;font-weight:800;color:${color}">${Math.round(avg)}</div>
          <div style="font-size:10px;color:${C.gray}">avg score</div>
        </div>`;
      }).join("")}
    </div>
  `, pageNum);
}


function frictionPage(
  frictionPatterns: string[],
  rollout90Days: string[],
  pageNum: number,
  tier: 1 | 2 | 3
): string {
  // Tier 1: show 1 friction, 1 recommendation; lock the rest
  // Tier 2+: show all
  const visibleFriction = tier === 1 ? frictionPatterns.slice(0, 1) : frictionPatterns;
  const visibleRollout  = tier === 1 ? rollout90Days.slice(0, 1) : rollout90Days;
  const lockedFrictionCount = tier === 1 ? Math.max(0, frictionPatterns.length - 1) : 0;

  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">TEAM DIAGNOSTICS</div>
    <h2 style="margin-bottom:4px">Friction Patterns & Recommendations</h2>
    <div class="divider"></div>

    <h3 style="margin-bottom:12px;color:${C.amber}">DETECTED FRICTION PATTERNS</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:${tier === 1 ? "16px" : "24px"}">
      ${visibleFriction.length > 0
        ? visibleFriction.map(f => `
          <div style="background:#FEF3C7;border-left:4px solid ${C.amber};border-radius:0 8px 8px 0;padding:14px 16px">
            <p style="margin:0;color:#92400E">${f}</p>
          </div>`).join("")
        : `<div style="background:#ECFDF5;border-left:4px solid ${C.green};border-radius:0 8px 8px 0;padding:14px 16px">
            <p style="margin:0;color:#065F46">No significant friction patterns detected. Your team has a well-balanced profile.</p>
           </div>`
      }
      ${lockedFrictionCount > 0 ? lockedCard(`+${lockedFrictionCount} more friction pattern${lockedFrictionCount > 1 ? "s" : ""} detected`, ["80%","60%","70%"]) : ""}
    </div>

    <h3 style="margin-bottom:12px">RECOMMENDATIONS</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${visibleRollout.map((r, i) => `
        <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;background:${C.grayLight};border-radius:8px">
          <div style="width:28px;height:28px;border-radius:50%;background:${C.navy};color:white;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i + 1}</div>
          <p style="margin:0">${r}</p>
        </div>`).join("")}
    </div>

    ${tier === 1 ? upgradeCTA(
      "Unlock Full Team Intelligence",
      "Add more team members to unlock deeper diagnostics, leadership insights, execution bottlenecks, and scaling recommendations."
    ) : ""}
  `, pageNum);
}

// ── Tier 1 locked preview page ─────────────────────────────────

function tier1LockedPage(pageNum: number): string {
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">LOCKED FEATURES</div>
    <h2 style="margin-bottom:4px">Full Team Intelligence Preview</h2>
    <div class="divider"></div>
    <p style="color:${C.gray};margin-bottom:20px">The following insights unlock as your team grows. Add members to reveal deeper organizational intelligence.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      ${[
        "Team Bottleneck Analysis",
        "Leadership Dynamics",
        "Scaling Diagnostics",
        "Hiring Recommendations",
        "Pressure Response Analysis",
        "Team Maturity Level",
        "Full 90-Day Roadmap",
        "Role Tension Forecast",
      ].map(label => lockedCard(label, ["90%", "70%", "55%"])).join("")}
    </div>

    ${upgradeCTA(
      "Unlock Full Team Intelligence",
      "Add more team members to unlock deeper diagnostics, leadership insights, execution bottlenecks, and scaling recommendations."
    )}
  `, pageNum);
}

// ── Tier 2 pages ───────────────────────────────────────────────

function teamDynamicsPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const { dominantEnergy, missingRoles, overweightRoles, riskLevel } = diagnostic;
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">TEAM DYNAMICS</div>
    <h2 style="margin-bottom:4px">Team Identity & Communication Analysis</h2>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      <div style="background:${C.grayLight};border-radius:10px;padding:18px">
        <div class="label" style="color:${C.navy};margin-bottom:10px">DOMINANT ENERGY</div>
        <div style="font-size:22px;font-weight:800;color:${ENERGY_COLORS[dominantEnergy] ?? C.purple}">${dominantEnergy}</div>
        <p style="margin-top:8px;font-size:12px">${ENERGY_TEAM_DESC[dominantEnergy] ?? ""}</p>
      </div>
      <div style="background:${C.grayLight};border-radius:10px;padding:18px">
        <div class="label" style="color:${C.navy};margin-bottom:10px">CHANGE RISK LEVEL</div>
        <div style="font-size:22px;font-weight:800;color:${riskLevel === "Low" ? C.green : riskLevel === "Moderate" ? C.amber : C.red}">${riskLevel}</div>
        <p style="margin-top:8px;font-size:12px">${RISK_LEVEL_DESC[riskLevel]}</p>
      </div>
    </div>

    <h3 style="margin-bottom:12px">MISSING ROLE IMPACT</h3>
    ${missingRoles.length > 0
      ? `<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
          ${missingRoles.map((role: string) => `
            <div style="background:#FEF2F2;border-left:4px solid ${C.red};border-radius:0 8px 8px 0;padding:14px 16px">
              <div style="font-weight:700;margin-bottom:4px;color:#991B1B">Missing: ${role}</div>
              <p style="margin:0;font-size:12px;color:#7F1D1D">${MISSING_ROLE_IMPACT[role] ?? ""}</p>
            </div>`).join("")}
        </div>`
      : `<div style="background:#ECFDF5;border-left:4px solid ${C.green};padding:14px 16px;border-radius:0 8px 8px 0;margin-bottom:20px">
          <p style="margin:0;color:#065F46">All four roles are represented — your team has a complete change capability profile.</p>
         </div>`
    }

    <h3 style="margin-bottom:12px">LEADERSHIP RISK ALERTS</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${LEADERSHIP_RISKS.map(({ label, desc, flagged }) => `
        <div style="background:${flagged(diagnostic) ? "#FEF3C7" : C.grayLight};border-radius:10px;padding:14px;border-left:3px solid ${flagged(diagnostic) ? C.amber : C.green}">
          <div style="font-size:12px;font-weight:700;margin-bottom:4px">${label}</div>
          <p style="font-size:11px;margin:0;color:${C.gray}">${desc}</p>
        </div>`).join("")}
    </div>
  `, pageNum);
}

function roleTensionPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const { roleDistribution } = diagnostic;
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">TEAM DYNAMICS</div>
    <h2 style="margin-bottom:4px">Role Tension Forecast & Communication Guide</h2>
    <div class="divider"></div>

    <h3 style="margin-bottom:12px;color:${C.amber}">LIKELY TENSION PATTERNS</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
      ${buildTensionPatterns(roleDistribution).map(t => `
        <div style="background:#FEF3C7;border-left:4px solid ${C.amber};border-radius:0 8px 8px 0;padding:14px 16px">
          <div style="font-weight:700;margin-bottom:4px;color:#92400E">${t.title}</div>
          <p style="margin:0;font-size:12px;color:#78350F">${t.desc}</p>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:12px">TEAM COMMUNICATION GUIDE</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${ROLE_COMM_GUIDE.map(g => `
        <div style="display:grid;grid-template-columns:100px 1fr 1fr;gap:12px;padding:12px;background:${C.grayLight};border-radius:8px;align-items:start">
          <div style="font-weight:700;font-size:13px">${g.role}</div>
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

    ${upgradeCTA(
      "Unlock Full Organizational Intelligence™",
      "Add 8 or more team members to unlock advanced execution diagnostics, scaling intelligence, hiring recommendations, and full transformation insights."
    )}
  `, pageNum);
}

function tier2LockedPage(pageNum: number): string {
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">PREMIUM FEATURES</div>
    <h2 style="margin-bottom:4px">Organizational Intelligence Preview</h2>
    <div class="divider"></div>
    <p style="color:${C.gray};margin-bottom:20px">These features unlock when your team reaches 8 or more members.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      ${[
        "Full Execution Diagnostics™",
        "Team Pressure Heatmap™",
        "Leadership Compatibility Analysis™",
        "Hiring Intelligence™",
        "Team Maturity Analysis™",
        "Full 90-Day Transformation Roadmap™",
      ].map(label => lockedCard(label, ["90%", "70%", "55%"])).join("")}
    </div>

    ${upgradeCTA(
      "Unlock Full Organizational Intelligence™",
      "Add 8 or more team members to unlock advanced execution diagnostics, scaling intelligence, hiring recommendations, and full transformation insights."
    )}
  `, pageNum);
}

// ── Tier 3 pages ───────────────────────────────────────────────

function buildBottlenecks(
  roleDistribution: Record<string, number>,
  stageHealth: Record<string, string>,
  riskScore: number,
): Array<{ icon: string; title: string; desc: string }> {
  const bottlenecks: Array<{ icon: string; title: string; desc: string }> = [];

  if ((roleDistribution["Driver"] ?? 0) === 0) {
    bottlenecks.push({
      icon: "⚡",
      title: "Execution Vacuum",
      desc: "No Driver role present. Plans and strategies are unlikely to be converted into consistent momentum. Delivery depends on whoever has the most urgency on any given day.",
    });
  }

  if ((roleDistribution["Connector"] ?? 0) === 0) {
    bottlenecks.push({
      icon: "🔗",
      title: "Communication Bottleneck",
      desc: "No Connector role present. Information flow is fragmented and trust is not being actively maintained. Misalignment accumulates silently until it surfaces as conflict.",
    });
  }

  if ((roleDistribution["Architect"] ?? 0) === 0) {
    bottlenecks.push({
      icon: "🏗️",
      title: "Systems & Process Gap",
      desc: "No Architect role present. Execution is ad hoc and processes are likely undocumented. The team is rebuilding the same solutions repeatedly without a scalable foundation.",
    });
  }

  if (stageHealth["Sustain"] === "Critical" || stageHealth["Sustain"] === "At Risk") {
    bottlenecks.push({
      icon: "📉",
      title: "Sustainability Breakdown",
      desc: "The Sustain stage is critically weak. Improvements are not being institutionalised — the team reverts to old patterns after each change sprint ends.",
    });
  }

  if (stageHealth["Align"] === "Critical" || stageHealth["Align"] === "At Risk") {
    bottlenecks.push({
      icon: "🗣️",
      title: "Alignment Deficit",
      desc: "The Align stage is weak. Decisions are being made without sufficient buy-in, and dissenting voices are not being surfaced before execution begins.",
    });
  }

  if (riskScore >= 60) {
    bottlenecks.push({
      icon: "🚨",
      title: "High Organisational Risk",
      desc: "Your team's overall risk score indicates multiple compounding gaps. Without structural intervention, execution quality will degrade as team size and project complexity increase.",
    });
  }

  if (bottlenecks.length === 0) {
    bottlenecks.push({
      icon: "✅",
      title: "No Critical Bottlenecks Detected",
      desc: "Your team has a well-rounded profile with no major execution bottlenecks. Focus on sustaining current strengths and deepening capability in your lowest-scoring ADAPTS stages.",
    });
  }

  return bottlenecks;
}

function executionBottleneckPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const { roleDistribution, stageHealth, riskScore } = diagnostic;
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">EXECUTION INTELLIGENCE</div>
    <h2 style="margin-bottom:4px">Execution Bottleneck Analysis</h2>
    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
      ${buildBottlenecks(roleDistribution, stageHealth, riskScore).map((b: any) => `
        <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;background:#FEF2F2;border-radius:8px;border-left:4px solid ${C.red}">
          <div style="flex-shrink:0;font-size:18px">${b.icon}</div>
          <div>
            <div style="font-weight:700;margin-bottom:4px;color:#991B1B">${b.title}</div>
            <p style="margin:0;font-size:12px;color:#7F1D1D">${b.desc}</p>
          </div>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:12px">SCALABILITY DIAGNOSTICS</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${SCALABILITY_DIMENSIONS.map(dim => {
        const score = getScalabilityScore(dim.key, diagnostic);
        const color = score >= 70 ? C.green : score >= 45 ? C.amber : C.red;
        return `
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:13px;font-weight:600">${dim.label}</span>
            <span style="font-size:11px;font-weight:700;color:${color}">${score}/100</span>
          </div>
          ${scoreBar(score, color)}
          <p style="font-size:11px;color:${C.gray};margin-top:4px">${dim.desc}</p>
        </div>`;
      }).join("")}
    </div>
  `, pageNum);
}

function pressureHeatmapPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const { roleDistribution } = diagnostic;
  const HEATMAP_DIMS = ["Trust","Communication","Execution","Sustainability","Innovation","Alignment"];
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">EXECUTION INTELLIGENCE</div>
    <h2 style="margin-bottom:4px">Execution Risk Heatmap & Pressure Response</h2>
    <div class="divider"></div>

    <h3 style="margin-bottom:14px">EXECUTION RISK HEATMAP</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px">
      ${HEATMAP_DIMS.map(dim => {
        const score = getHeatmapScore(dim, diagnostic);
        const color = score >= 70 ? C.green : score >= 45 ? C.amber : C.red;
        const label = score >= 70 ? "Strong" : score >= 45 ? "Watch" : "Risk";
        return `
        <div style="border-radius:10px;padding:16px;text-align:center;background:${color}18;border:2px solid ${color}">
          <div style="font-size:12px;font-weight:700;margin-bottom:4px">${dim}</div>
          <div style="font-size:26px;font-weight:800;color:${color}">${score}</div>
          <div style="font-size:10px;color:${color};font-weight:700">${label}</div>
        </div>`;
      }).join("")}
    </div>

    <h3 style="margin-bottom:14px">PRESSURE RESPONSE ANALYSIS</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${PRESSURE_RESPONSES.filter((p: any) => (roleDistribution[p.role as Role] as any ?? 0) > 0).map(p => `
        <div style="display:grid;grid-template-columns:100px 1fr;gap:14px;padding:14px;background:${C.grayLight};border-radius:8px">
          <div>
            <div style="font-weight:700;font-size:13px">${p.role}</div>
            <div style="font-size:10px;color:${C.gray}">${roleDistribution[p.role as Role]} member${(roleDistribution[p.role as Role] ?? 0) > 1 ? "s" : ""}</div>
          </div>
          <div>
            <div class="label" style="color:${C.amber};margin-bottom:4px">UNDER PRESSURE</div>
            <p style="font-size:12px;margin:0">${p.response}</p>
          </div>
        </div>`).join("")}
    </div>
  `, pageNum);
}

function maturityHirePage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const maturity = getTeamMaturity(diagnostic);
  const idealHire = getIdealHire(diagnostic);
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">ORGANIZATIONAL INTELLIGENCE</div>
    <h2 style="margin-bottom:4px">Team Maturity & Ideal Next Hire</h2>
    <div class="divider"></div>

    <div style="background:${C.navy};border-radius:12px;padding:24px 28px;color:white;margin-bottom:24px">
      <div class="label" style="color:${C.gold};margin-bottom:8px">TEAM MATURITY LEVEL</div>
      <div style="font-size:26px;font-weight:800;margin-bottom:10px">${maturity.level}</div>
      <p style="font-size:13px;color:rgba(255,255,255,0.8);margin-bottom:12px">${maturity.description}</p>
      <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:12px">
        <div class="label" style="color:${C.gold};margin-bottom:6px">NEXT GROWTH STAGE</div>
        <p style="font-size:12px;color:rgba(255,255,255,0.75);margin:0">${maturity.nextStage}</p>
      </div>
    </div>

    <h3 style="margin-bottom:12px">IDEAL NEXT HIRE</h3>
    <div style="background:#EFF6FF;border-radius:10px;padding:20px;border-left:4px solid #3B82F6;margin-bottom:24px">
      <div style="font-size:18px;font-weight:800;color:#1E40AF;margin-bottom:8px">${idealHire.role}</div>
      <p style="font-size:13px;color:#1E3A8A;margin-bottom:10px">${idealHire.reason}</p>
      <div class="label" style="color:#3B82F6;margin-bottom:6px">WHAT IMPROVES AFTER HIRING</div>
      <p style="font-size:12px;color:#1E40AF;margin:0">${idealHire.improvement}</p>
    </div>

    <h3 style="margin-bottom:12px">LEADERSHIP COMPATIBILITY</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#ECFDF5;border-radius:10px;padding:16px;border-top:3px solid ${C.green}">
        <div class="label" style="color:${C.green};margin-bottom:8px">STRONGEST PAIRINGS</div>
        ${getCompatibilityPairings(diagnostic, "strong").map(p => `<div style="font-size:12px;padding:3px 0;font-weight:600">${p}</div>`).join("")}
      </div>
      <div style="background:#FEF2F2;border-radius:10px;padding:16px;border-top:3px solid ${C.red}">
        <div class="label" style="color:${C.red};margin-bottom:8px">HIGHEST TENSION</div>
        ${getCompatibilityPairings(diagnostic, "tension").map(p => `<div style="font-size:12px;padding:3px 0;font-weight:600">${p}</div>`).join("")}
      </div>
    </div>
  `, pageNum);
}

function fullRoadmapPage(diagnostic: TeamDiagnostic, pageNum: number): string {
  const { rollout90Days, missingRoles, frictionPatterns } = diagnostic;
  const phases = [
    { label: "Days 1–30", color: C.purple, icon: "🧭", items: rollout90Days.filter((_: any, i: number) => i === 0) },
    { label: "Days 31–60", color: C.amber,  icon: "⚙️", items: rollout90Days.filter((_: any, i: number) => i === 1 || i === 2) },
    { label: "Days 61–90", color: C.green,  icon: "🚀", items: rollout90Days.filter((_: any, i: number) => i === 3) },
  ];
  return page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">TRANSFORMATION ROADMAP</div>
    <h2 style="margin-bottom:4px">Full 90-Day Transformation Roadmap™</h2>
    <div class="divider"></div>

    ${phases.map(phase => `
      <div style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span style="font-size:20px">${phase.icon}</span>
          <div style="font-size:15px;font-weight:800;color:${phase.color}">${phase.label}</div>
        </div>
        <div style="border-left:3px solid ${phase.color};padding-left:16px;display:flex;flex-direction:column;gap:8px">
          ${phase.items.map((item: any) => `
            <div style="background:${C.grayLight};border-radius:8px;padding:14px">
              <p style="margin:0;font-size:13px">${item}</p>
            </div>`).join("")}
        </div>
      </div>`).join("")}

    ${missingRoles.length > 0 ? `
      <div style="background:#EFF6FF;border-radius:10px;padding:18px;margin-top:8px">
        <div class="label" style="color:#3B82F6;margin-bottom:8px">PRIORITY HIRING GAPS</div>
        <p style="font-size:12px;color:#1E40AF">Missing roles — ${missingRoles.join(", ")} — should be addressed as part of your 90-day plan. These gaps create compounding execution risk.</p>
      </div>` : ""}

    ${frictionPatterns.length > 0 ? `
      <div style="background:#FEF3C7;border-radius:10px;padding:18px;margin-top:12px">
        <div class="label" style="color:${C.amber};margin-bottom:8px">FRICTION TO RESOLVE</div>
        ${frictionPatterns.map((f: string)=> `<p style="font-size:12px;color:#92400E;margin-bottom:6px">• ${f}</p>`).join("")}
      </div>` : ""}
  `, pageNum);
}

// ── Supplementary data ─────────────────────────────────────────

const ENERGY_TEAM_DESC: Record<string, string> = {
  Achiever:  "This team moves fast and values visible results. Communication should be direct, goal-oriented, and tied to outcomes.",
  Unifier:   "This team prioritises people and trust. Decisions land better when relationships are considered and voices are heard.",
  Organizer: "This team values structure and reliability. They respond well to clear processes, defined roles, and logical planning.",
  Innovator: "This team is idea-driven and future-focused. They need space for creative thinking but benefit from execution support.",
};

const RISK_LEVEL_DESC: Record<string, string> = {
  Low:      "Your team has a well-balanced profile with low execution risk. Maintain current strengths.",
  Moderate: "Some gaps exist that could create friction as complexity grows. Address proactively.",
  High:     "Significant role or stage gaps are creating active execution risk. Prioritise interventions.",
  Critical: "Multiple critical gaps are present. Immediate structural attention is recommended.",
};

const MISSING_ROLE_IMPACT: Record<string, string> = {
  Driver:    "Without a Driver, the team may struggle to convert alignment and planning into consistent execution momentum. Deadlines slip, initiatives stall.",
  Connector: "Without a Connector, trust erodes under pressure. Misalignment builds silently until it surfaces as conflict or disengagement.",
  Architect: "Without an Architect, good ideas lack operational structure. Execution is ad hoc, processes are unclear, and scale becomes difficult.",
  Spotter:   "Without a Spotter, the team may execute confidently in the wrong direction. Strategic blind spots accumulate unnoticed.",
};

const LEADERSHIP_RISKS = [
  {
    label: "Alignment Breakdown Risk™",
    desc:  "Misalignment forming between team members due to communication or role gaps.",
    flagged: (d: TeamDiagnostic) => (d.stageScores["Align"] ?? 100) < 50,
  },
  {
    label: "Execution Drift Risk™",
    desc:  "Execution losing consistency or focus without clear accountability structures.",
    flagged: (d: TeamDiagnostic) => (d.stageScores["Transform"] ?? 100) < 50,
  },
  {
    label: "Founder Dependency Risk™",
    desc:  "Over-reliance on one or two people to drive delivery and decisions.",
    flagged: (d: TeamDiagnostic) => (d.roleDistribution["Driver"] ?? 0) <= 1,
  },
  {
    label: "Communication Fragmentation™",
    desc:  "Breakdown in information flow between roles or functional areas.",
    flagged: (d: TeamDiagnostic) => (d.roleDistribution["Connector"] ?? 0) === 0,
  },
];

const ROLE_COMM_GUIDE = [
  { role: "Driver",    motivates: "Clear goals, visible progress, accountability, speed",        frustrates: "Slow decisions, endless discussion, lack of follow-through" },
  { role: "Connector", motivates: "Trust, inclusion, being heard, collaborative decisions",       frustrates: "Rushed decisions, ignored input, conflict avoidance" },
  { role: "Architect", motivates: "Clear process, logical structure, reliable systems",           frustrates: "Ambiguity, last-minute changes, skipping steps" },
  { role: "Spotter",   motivates: "New challenges, strategic questions, intellectual freedom",    frustrates: "Repetition, over-structure, being locked into one approach" },
];

function buildTensionPatterns(roleDistribution: Record<string, number>) {
  const tensions = [];
  if ((roleDistribution["Driver"] ?? 0) > 0 && (roleDistribution["Architect"] ?? 0) > 0)
    tensions.push({ title: "Driver vs Architect", desc: "Drivers push for speed; Architects want the plan right before moving. This creates friction around launch timing and quality standards." });
  if ((roleDistribution["Spotter"] ?? 0) > 0 && (roleDistribution["Driver"] ?? 0) > 0)
    tensions.push({ title: "Spotter vs Driver", desc: "Spotters want to explore new directions; Drivers want to finish what's started. This creates tension around pivoting vs committing." });
  if ((roleDistribution["Connector"] ?? 0) > 0 && (roleDistribution["Driver"] ?? 0) > 0)
    tensions.push({ title: "Connector vs Driver", desc: "Connectors prioritise consensus and trust; Drivers prioritise outcomes and speed. This creates friction around decision pace and inclusion." });
  if (tensions.length === 0)
    tensions.push({ title: "No Major Tension Detected", desc: "Your current role mix does not show strong predictive tension patterns. Monitor as team grows." });
  return tensions;
}

const PRESSURE_RESPONSES = [
  { role: "Driver",    response: "Drivers become forceful — pushing harder, raising urgency, and sometimes steamrolling team input. Watch for communication breakdown under delivery pressure." },
  { role: "Connector", response: "Connectors avoid conflict — staying quiet about concerns, smoothing over issues, and delaying necessary difficult conversations. Watch for silent disengagement." },
  { role: "Architect", response: "Architects overanalyse — diving deeper into planning, requesting more data, and hesitating to commit without complete information. Watch for execution paralysis." },
  { role: "Spotter",   response: "Spotters become critical — pointing out everything that could go wrong, reframing the problem instead of solving it, and questioning current direction. Watch for destabilisation." },
];

const SCALABILITY_DIMENSIONS = [
  { key: "leadership",     label: "Leadership Scalability",     desc: "Can the team sustain delivery without founder overload?" },
  { key: "communication",  label: "Communication Scalability",  desc: "Can information flow reliably as the team grows?" },
  { key: "operational",    label: "Operational Scalability",    desc: "Are systems in place to support more volume without breakdown?" },
  { key: "sustainability", label: "Sustainability Scalability", desc: "Will improvements hold after the change sprint ends?" },
  { key: "innovation",     label: "Innovation Scalability",     desc: "Can the team continue generating and testing new ideas at scale?" },
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
  if (avg >= 75) return { level: "Strategic Leadership Team",  description: "This team operates with high trust, clear execution, and strong change capability.", nextStage: "Focus on innovation, external market positioning, and scaling leadership depth." };
  if (avg >= 60) return { level: "High-Trust Team",            description: "Trust and communication are strong. Execution is mostly consistent.", nextStage: "Build sustainability systems and scale operational capacity." };
  if (avg >= 45) return { level: "Scaling Team",               description: "The team has functional foundations but faces growing pains under pressure.", nextStage: "Strengthen alignment and execution consistency before adding complexity." };
  if (avg >= 30) return { level: "Functional Team",            description: "Core roles are in place but capability gaps are creating friction.", nextStage: "Address missing roles and improve dialogue and preparation disciplines." };
  return              { level: "Emerging Team",                description: "The team is in early formation — foundations are being built.", nextStage: "Focus on role clarity, communication, and establishing shared operating norms." };
}

function getIdealHire(d: TeamDiagnostic) {
  if ((d.roleDistribution["Connector"] ?? 0) === 0) return {
    role: "Connector / Culture Lead",
    reason: "Your team has no trust-builder or alignment anchor. As the team scales, conflict and silent disengagement will become your biggest risks.",
    improvement: "Faster alignment, healthier conflict resolution, stronger retention, and improved cross-team communication.",
  };
  if ((d.roleDistribution["Architect"] ?? 0) === 0) return {
    role: "Architect / Operations Lead",
    reason: "Your team lacks a systems thinker. Good ideas are being executed inconsistently and processes are likely ad hoc.",
    improvement: "Reliable delivery, scalable processes, reduced rework, and clearer operational ownership.",
  };
  if ((d.roleDistribution["Spotter"] ?? 0) === 0) return {
    role: "Spotter / Strategy Advisor",
    reason: "Your team has no strategic radar. You may be executing effectively but missing shifts in the market or better approaches.",
    improvement: "Improved strategic positioning, earlier detection of risk, and better-informed pivots.",
  };
  return {
    role: "Driver / Execution Lead",
    reason: "Adding another Driver increases delivery capacity, especially as projects grow in complexity and volume.",
    improvement: "Higher execution throughput, reduced bottlenecks, and stronger accountability culture.",
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
    .slice(0, 3);
}

// ── Main export ────────────────────────────────────────────────

export function buildTeamReportHTML(input: TeamReportInput): string {
  const { teamName, diagnostic, memberNames, date } = input;
  const { stageScores, energyScores, roleDistribution, riskScore, frictionPatterns, rollout90Days } = diagnostic;

  const memberCount         = memberNames.length;
  const teamChangeCapacity  = 100 - riskScore;
  const tier: 1 | 2 | 3    = memberCount >= 8 ? 3 : memberCount >= 3 ? 2 : 1;
  const tierLabel           = tier === 1 ? "Core Team Snapshot" : tier === 2 ? "Team Change Map" : "Full Organizational Intelligence";

  const pages: string[] = [];
  let pageNum = 0;

  // ── All tiers ──────────────────────────────────────────────
  pages.push(coverPage(teamName, memberCount, teamChangeCapacity, date, tierLabel));
  pages.push(stageCoveragePage(diagnostic.stageScores, diagnostic.roleDistribution, diagnostic.energyScores, 1));
  pages.push(frictionPage(frictionPatterns, rollout90Days, pageNum++, tier));

  // ── Tier 1: locked preview only ───────────────────────────
  if (tier === 1) {
    pages.push(tier1LockedPage(pageNum++));
  }

  // ── Tier 2: team dynamics + locked Tier 3 preview ─────────
  if (tier >= 2) {
    pages.push(teamDynamicsPage(diagnostic, pageNum++));
    pages.push(roleTensionPage(diagnostic, pageNum++));
  }
  if (tier === 2) {
    pages.push(tier2LockedPage(pageNum++));
  }

  // ── Tier 3: full intelligence ─────────────────────────────
  if (tier === 3) {
    pages.push(executionBottleneckPage(diagnostic, pageNum++));
    pages.push(pressureHeatmapPage(diagnostic, pageNum++));
    pages.push(maturityHirePage(diagnostic, pageNum++));
    pages.push(fullRoadmapPage(diagnostic, pageNum++));
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
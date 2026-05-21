/**
 * Change Genius™ — PDF Generator v3
 *
 * FINAL ROLES (4): Driver, Connector, Architect, Spotter
 * FINAL ENERGIES (4): Achiever, Unifier, Organizer, Innovator
 * FINAL ADAPTS STAGES (6): Alert, Diagnose, Prepare, Align, Transform, Sustain
 */

import type { ScoreResult, StageBand } from "@/lib/assessment/scoring";
import type { Narrative } from "@/lib/assessment/narratives";
import type { TeamDiagnostic } from "@/lib/assessment/team-diagnostic";

// ── Colour palette ─────────────────────────────────────────────
const C = {
  navy:       "#1B2A4A",
  purple:     "#6B4FBB",
  purpleLight:"#8B6FDB",
  gold:       "#C9A84C",
  green:      "#2E7D52",
  red:        "#C0392B",
  amber:      "#E67E22",
  gray:       "#64748B",
  grayLight:  "#F1F5F9",
  white:      "#FFFFFF",
  border:     "#E2E8F0",
};

// ── Energy colours (4 final energies) ─────────────────────────
const ENERGY_COLORS: Record<string, string> = {
  Achiever:  C.purple,
  Unifier:   "#E84393",
  Organizer: C.green,
  Innovator: C.gold,
};

const ADAPTS_ORDER = [
  "Alert",
  "Diagnose",
  "Prepare",
  "Align",
  "Transform",
  "Sustain",
] as const;

// ── Band → colour ──────────────────────────────────────────────
function bandColor(band: StageBand): string {
  switch (band) {
    case "Strategic Signature Strength": return C.green;
    case "Strong Functional Strength":   return "#27AE60";
    case "Solid Capacity":               return C.purple;
    case "Situational Capacity":         return C.gold;
    case "Fragile Capacity":             return C.amber;
    case "High-Risk Breakdown Zone":     return C.red;
  }
}

// ── Score bar ──────────────────────────────────────────────────
function scoreBar(score: number, color = C.purple): string {
  return `
    <div style="display:flex;align-items:center;gap:10px;margin:4px 0">
      <div style="flex:1;height:10px;background:#E2E8F0;border-radius:5px;overflow:hidden">
        <div style="width:${score}%;height:100%;background:${color};border-radius:5px"></div>
      </div>
      <span style="font-size:13px;font-weight:700;color:${color};min-width:36px;text-align:right">${score}</span>
    </div>`;
}

// ── Base CSS ───────────────────────────────────────────────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: ${C.navy};
    background: ${C.white};
    line-height: 1.6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 794px;
    min-height: 1123px;
    padding: 60px 64px;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }
  h1 { font-size:38px; font-weight:800; line-height:1.15; }
  h2 { font-size:24px; font-weight:700; margin-bottom:8px; }
  h3 { font-size:17px; font-weight:600; margin-bottom:6px; }
  p  { font-size:14px; line-height:1.7; color:#374151; }
  .label { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:${C.gray}; }
  .chip {
    display:inline-block; padding:4px 12px; border-radius:20px;
    font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase;
  }
  .divider { height:1px; background:${C.border}; margin:24px 0; }
  .card {
    background:${C.grayLight}; border-radius:12px; padding:24px;
    border-left:4px solid ${C.purple};
  }
  .tag-bar { position:absolute; top:0; left:0; right:0; height:6px; background:${C.purple}; }
  .footer {
    position:absolute; bottom:32px; left:64px; right:64px;
    display:flex; justify-content:space-between; align-items:center;
    border-top:1px solid ${C.border}; padding-top:12px;
    font-size:11px; color:${C.gray};
  }
  ul.bullets { list-style:none; padding:0; }
  ul.bullets li {
    padding:6px 0 6px 20px; position:relative;
    font-size:14px; line-height:1.6; color:#374151;
    border-bottom:1px solid ${C.border};
  }
  ul.bullets li:last-child { border-bottom:none; }
  ul.bullets li::before {
    content:''; position:absolute; left:0; top:14px;
    width:8px; height:8px; border-radius:50%; background:${C.purple};
  }
  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { page-break-after:always; }
  }
`;

// ── Page wrapper ───────────────────────────────────────────────
function page(content: string, pageNum?: number, sectionLabel = "CHANGE GENIUS™"): string {
  return `
  <div class="page">
    <div class="tag-bar"></div>
    ${content}
    ${pageNum !== undefined ? `
    <div class="footer">
      <span style="font-weight:600;color:${C.purple}">${sectionLabel}</span>
      <span>changegeniusai.com</span>
      <span>Page ${pageNum}</span>
    </div>` : ""}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// INDIVIDUAL REPORT
// ══════════════════════════════════════════════════════════════

export interface IndividualReportInput {
  fullName: string | null;
  scores: ScoreResult;
  narrative: Narrative;
  completedAt: string;
}

export function adaptsOverviewPage(): string {
  const stages: Array<{
    letter: string
    name: string
    full: string
    description: string
    color: string
  }> = [
    {
      letter: 'A',
      name: 'Alert the System',
      full: 'A — Alert the System',
      description:
        'Recognize signals, risks, opportunities, resistance, pressure points, and the need for change before problems escalate.',
      color: C.purple,
    },
    {
      letter: 'D',
      name: 'Diagnose the Gaps',
      full: 'D — Diagnose the Gaps',
      description:
        'Identify root causes, leadership breakdowns, execution barriers, system weaknesses, misalignment, and hidden performance gaps.',
      color: C.navy,
    },
    {
      letter: 'A',
      name: 'Assess Readiness',
      full: 'A — Assess Readiness',
      description:
        'Evaluate the people, culture, leadership capacity, emotional readiness, resources, systems, and execution capability required for sustainable change.',
      color: C.gold,
    },
    {
      letter: 'P',
      name: 'Participate Through Dialogue',
      full: 'P — Participate Through Dialogue',
      description:
        'Build trust, engagement, ownership, and collaboration through intentional communication, listening, feedback, and healthy conversations.',
      color: C.green,
    },
    {
      letter: 'T',
      name: 'Transform Through Alignment',
      full: 'T — Transform Through Alignment',
      description:
        'Execute change by aligning people, systems, priorities, leadership, structure, communication, and accountability toward a shared outcome.',
      color: C.amber,
    },
    {
      letter: 'S',
      name: 'Scale and Sustain',
      full: 'S — Scale and Sustain',
      description:
        'Reinforce long-term success through culture, habits, leadership development, learning systems, measurement, consistency, and continuous improvement.',
      color: C.red,
    },
  ]

  return page(`
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- Header -->
      <div>
        <div class="label" style="color:${C.purple};margin-bottom:10px">FRAMEWORK OVERVIEW</div>
        <h1 style="font-size:32px;line-height:1.1;margin-bottom:6px">ADAPTS™ OVERVIEW</h1>
        <div style="width:48px;height:3px;background:${C.gold};margin-bottom:12px"></div>
        <p style="font-size:13px;color:${C.gray};font-weight:300;max-width:540px">
          The ADAPTS™ framework is the six-stage model that powers Change Genius™. It describes how individuals, 
          teams, and organisations move through change — from early signal recognition through to long-term 
          sustainability. Understanding where you are in this journey helps leaders make smarter decisions, 
          reduce friction, and build lasting momentum.
        </p>
      </div>

      <!-- Stage cards -->
      <div style="display:flex;flex-direction:column;gap:10px">
        ${stages.map((s, i) => `
          <div style="display:flex;align-items:stretch;border-radius:10px;overflow:hidden;border:1px solid ${s.color}22">
            <!-- Letter badge -->
            <div style="
              min-width:52px;
              background:${s.color};
              display:flex;
              flex-direction:column;
              align-items:center;
              justify-content:center;
              padding:12px 0;
            ">
              <span style="font-size:26px;font-weight:900;color:white;line-height:1">${s.letter}</span>
              <span style="font-size:8px;color:rgba(255,255,255,0.6);margin-top:3px;text-transform:uppercase;letter-spacing:.06em">${String(i + 1).padStart(2, '0')}</span>
            </div>
            <!-- Content -->
            <div style="flex:1;padding:12px 16px;background:${s.color}08">
              <div style="font-size:12px;font-weight:800;color:${s.color};margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">${s.name}</div>
              <p style="font-size:11px;color:${C.navy};line-height:1.55;margin:0">${s.description}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer note -->
      <div style="background:${C.navy};border-radius:10px;padding:16px 20px;margin-top:4px">
        <div class="label" style="color:rgba(255,255,255,0.5);margin-bottom:8px">HOW TO READ YOUR SCORES</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          <div style="text-align:center">
            <div style="font-size:18px;font-weight:900;color:${C.green}">70–100</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:2px;text-transform:uppercase;letter-spacing:.06em">Strong</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:1px">This stage is a natural strength</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:18px;font-weight:900;color:${C.amber}">30–69</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:2px;text-transform:uppercase;letter-spacing:.06em">Developing</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:1px">Growth opportunity with intentional practice</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:18px;font-weight:900;color:${C.red}">0–29</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:2px;text-transform:uppercase;letter-spacing:.06em">Critical Gap</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:1px">Requires focused leadership attention</div>
          </div>
        </div>
      </div>

      <p style="font-size:10px;color:${C.gray};text-align:center;margin-top:4px">
        Change Genius™ · ADAPTS™ Framework · changegeniusai.com
      </p>
    </div>
  `)
}

export function buildIndividualReportHTML(input: IndividualReportInput): string {
  const { fullName, scores, narrative } = input;
  const name      = fullName ?? "Your";
  const firstName = name.split(" ")[0];
  const date      = new Date(input.completedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const { derived, stage_scores, stage_detail, role_scores, energy_scores } = scores;
  const { primary_role, secondary_role, role_pair_title, energy_profile, change_capacity_score } = derived;

  const pages: string[] = [];

  // ── Page 1: Cover ─────────────────────────────────────────
  pages.push(page(`
    <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:40px">
      <div>
        <div class="label" style="color:${C.purple};margin-bottom:24px">ASSESSMENT REPORT</div>
        <h1 style="color:${C.navy};font-size:48px;line-height:1.1;margin-bottom:8px">
          CHANGE GENIUS™
        </h1>
        <div style="width:60px;height:4px;background:${C.gold};margin:20px 0 28px"></div>
        <p style="font-size:18px;color:${C.gray};font-weight:300">${name}'s Change Genius™ Revealed</p>
      </div>

      <div style="text-align:center;margin:40px 0">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="72" stroke="${C.purple}" stroke-width="3" fill="none" opacity="0.15"/>
          <circle cx="80" cy="80" r="52" stroke="${C.purple}" stroke-width="3" fill="none" opacity="0.25"/>
          <circle cx="80" cy="80" r="32" fill="${C.purple}" opacity="0.9"/>
          <text x="80" y="87" font-family="Inter,sans-serif" font-size="22" font-weight="800" fill="white" text-anchor="middle">CG</text>
          ${[0,60,120,180,240,300].map(a => {
            const r=72, rx=80+r*Math.cos(a*Math.PI/180), ry=80+r*Math.sin(a*Math.PI/180);
            return `<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="7" fill="${C.purple}" opacity="0.6"/>`;
          }).join("")}
        </svg>
      </div>

      <div>
        <div style="background:${C.navy};border-radius:12px;padding:28px 32px;color:white">
          <div class="label" style="color:rgba(255,255,255,0.6);margin-bottom:16px">DISCOVER THE GIFTS YOU BRING TO CHANGE</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">CHANGE GENIUS™</div>
              <div style="font-size:16px;font-weight:700">${primary_role} + ${secondary_role}</div>
            </div>
            <div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">ROLE PAIRING</div>
              <div style="font-size:16px;font-weight:700">${role_pair_title}</div>
            </div>
            <div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">DOMINANT ENERGY</div>
              <div style="font-size:16px;font-weight:700">${energy_profile.dominant}</div>
            </div>
            <div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">CHANGE CAPACITY SCORE™</div>
              <div style="font-size:24px;font-weight:800;color:${C.gold}">${change_capacity_score}<span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.5)">/100</span></div>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
          <span style="font-size:12px;color:${C.gray}">Completed: ${date}</span>
          <span style="font-size:12px;color:${C.gray}">Prepared for individual development and leadership insight</span>
        </div>
      </div>
    </div>
  `));

  // ── Page 2: Overview ───────────────────────────────────────
  // Updated: 4 roles, correct ADAPTS stage names, 3 systems explained
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">OVERVIEW</div>
    <h2 style="font-size:30px;margin-bottom:4px">A Brief Overview of Change Genius™</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">${narrative.what_is_change_genius}</p>

    <h3 style="margin-bottom:16px">THE 4 CHANGE GENIUS™ ROLES</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px">
      ${["Driver", "Connector", "Architect", "Spotter"].map(r => `
        <div style="background:${C.grayLight};border-radius:8px;padding:14px 16px;display:flex;align-items:center;gap:12px">
          <div style="width:36px;height:36px;border-radius:50%;background:${C.purple};display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:14px;flex-shrink:0">${r[0]}</div>
          <div style="font-weight:600;font-size:13px">${r}</div>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:12px">THE ADAPTS™ STAGES</h3>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:20px;flex-wrap:wrap">
      ${["Alert", "Diagnose", "Prepare", "Align", "Transform", "Sustain"].map((s, i) => `
        <div style="display:flex;align-items:center;gap:6px">
          <div style="background:${C.navy};color:white;border-radius:6px;padding:8px 14px;font-size:12px;font-weight:600">${s}</div>
          ${i < 5 ? `<div style="color:${C.gray};font-size:18px">→</div>` : ""}
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:12px">THE 4 PRODUCTIVITY ENERGIES</h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
      ${["Achiever", "Unifier", "Organizer", "Innovator"].map(e => `
        <div style="background:${C.grayLight};border-radius:8px;padding:12px;text-align:center;border-top:3px solid ${ENERGY_COLORS[e] ?? C.purple}">
          <div style="font-weight:700;font-size:12px;color:${ENERGY_COLORS[e] ?? C.purple}">${e}</div>
        </div>`).join("")}
    </div>

    <div class="card">
      <p style="font-size:13px;font-style:italic;color:${C.navy}">
        "Change Genius™ measures how you naturally contribute to change, what gives you energy, where execution may break down, and how you can increase your long-term impact."
      </p>
    </div>
  `, 1));

  pages.push(adaptsOverviewPage())

  // ── Page 3: Results summary ────────────────────────────────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:30px;margin-bottom:4px">Your Results</h2>
    <p style="margin-bottom:24px"><strong>${firstName},</strong> the information below summarises the results of your assessment.</p>

    <!-- Primary Role -->
    <div style="background:${C.navy};border-radius:12px;padding:24px 28px;margin-bottom:16px;color:white">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:42px;height:42px;border-radius:50%;background:${C.green};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:white;flex-shrink:0">${primary_role[0]}</div>
        <div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:0.08em;text-transform:uppercase">PRIMARY CHANGE GENIUS</div>
          <div style="font-size:20px;font-weight:800">${primary_role}</div>
        </div>
      </div>
      <p style="font-size:13px;color:rgba(255,255,255,0.85)">${narrative.role_summary}</p>
    </div>

    <!-- Secondary Role -->
    <div style="background:${C.grayLight};border-radius:12px;padding:24px 28px;margin-bottom:16px;border-left:4px solid ${C.gold}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:42px;height:42px;border-radius:50%;background:${C.gold};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:white;flex-shrink:0">${secondary_role[0]}</div>
        <div>
          <div class="label">SECONDARY CHANGE GENIUS — ADAPTIVE STRENGTH</div>
          <div style="font-size:20px;font-weight:800;color:${C.navy}">${secondary_role}</div>
        </div>
      </div>
      <p style="font-size:13px">${narrative.secondary_role_summary}</p>
    </div>

    <!-- Energy + CCS -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div style="background:${C.grayLight};border-radius:12px;padding:20px;border-left:4px solid ${C.purple}">
        <div class="label" style="margin-bottom:8px">DOMINANT ENERGY</div>
        <div style="font-size:20px;font-weight:800;color:${C.purple}">${energy_profile.dominant}</div>
        <div style="font-size:12px;color:${C.gray};margin-top:4px">Secondary: ${energy_profile.secondary} · Strain: ${energy_profile.strain}</div>
      </div>
      <div style="background:${C.grayLight};border-radius:12px;padding:20px;border-left:4px solid ${C.gold}">
        <div class="label" style="margin-bottom:8px">CHANGE CAPACITY SCORE™</div>
        <div style="font-size:32px;font-weight:800;color:${C.gold}">${change_capacity_score}<span style="font-size:14px;color:${C.gray}">/100</span></div>
      </div>
    </div>

    <!-- ADAPTS top/bottom -->
    <div style="background:${C.grayLight};border-radius:12px;padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <div class="label" style="color:${C.green};margin-bottom:10px">✦ STRONGEST STAGES</div>
        ${derived.top_adapts_stages.map(s => `
          <div style="font-size:13px;font-weight:600;padding:6px 0;border-bottom:1px solid ${C.border}">${s}</div>`).join("")}
      </div>
      <div>
        <div class="label" style="color:${C.red};margin-bottom:10px">⚠ DEVELOPMENT AREAS</div>
        ${derived.bottom_adapts_stages.map(s => `
          <div style="font-size:13px;font-weight:600;padding:6px 0;border-bottom:1px solid ${C.border}">${s}</div>`).join("")}
      </div>
    </div>
  `, 2));

  // ── Page 4: Primary role deep-dive ────────────────────────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Primary Change Genius</h2>
    <div class="divider"></div>

    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div style="width:60px;height:60px;border-radius:50%;background:${C.green};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:white;flex-shrink:0">${primary_role[0]}</div>
      <div>
        <div class="label">THE GENIUS OF</div>
        <div style="font-size:28px;font-weight:800;color:${C.navy}">${primary_role.toUpperCase()}</div>
      </div>
    </div>

    <p style="margin-bottom:20px">${narrative.role_detailed}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <h3 style="color:${C.green};margin-bottom:12px">BENEFITS OF THIS GENIUS</h3>
        <ul class="bullets">
          ${narrative.role_benefits.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};margin-bottom:12px">WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.role_watchouts.map(w => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="divider"></div>
    <div class="card">
      <div class="label" style="margin-bottom:8px">IN A TEAM CONTEXT</div>
      <p>${narrative.individual_in_team}</p>
    </div>
  `, 3));

  // ── Page 5: Secondary role (Part 1) — header + detailed + benefits/watchouts
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Secondary Change Genius</h2>
    <div class="divider"></div>

    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div style="width:60px;height:60px;border-radius:50%;background:${C.gold};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:white;flex-shrink:0">${secondary_role[0]}</div>
      <div>
        <div class="label">YOUR ADAPTIVE STRENGTH</div>
        <div style="font-size:28px;font-weight:800;color:${C.navy}">${secondary_role.toUpperCase()}</div>
      </div>
    </div>

    <p style="margin-bottom:24px">${narrative.secondary_role_detailed}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
      <div>
        <h3 style="color:${C.green};margin-bottom:12px">ADAPTIVE STRENGTHS</h3>
        <ul class="bullets">
          ${narrative.secondary_role_benefits.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};margin-bottom:12px">WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.secondary_role_watchouts.map(w => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>
  `, 4));

  // ── Page 6: Secondary role (Part 2) — role scores + note
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Secondary Change Genius <span style="font-size:16px;font-weight:400;color:${C.gray}">continued</span></h2>
    <div class="divider"></div>

    <h3 style="margin-bottom:16px">YOUR FULL ROLE PROFILE</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px">
      ${Object.entries(role_scores as Record<string, number>)
        .sort(([,a],[,b]) => (b as number) - (a as number))
        .map(([role, score]) => {
          const isTop    = role === primary_role;
          const isSecond = role === secondary_role;
          const color    = isTop ? C.green : isSecond ? C.gold : C.gray;
          return `
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:13px;font-weight:${isTop||isSecond?"700":"400"};color:${color}">${role}${isTop?" ★":isSecond?" ◆":""}</span>
            </div>
            ${scoreBar(Number(score), color)}
          </div>`;
        }).join("")}
    </div>

    <div class="card" style="border-left-color:${C.gold}">
      <div class="label" style="margin-bottom:8px">IMPORTANT NOTE</div>
      <p style="font-size:13px">Your secondary genius is an adaptive strength — not a backup role or a lesser ability. You apply it situationally and it genuinely complements your primary genius of <strong>${primary_role}</strong>. Your deepest energy and most natural contribution, however, comes from your primary role.</p>
    </div>
  `, 5));

  // ── Page 6: Pairing ────────────────────────────────────────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Unique Pairing</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">The combination of your two Change Genius™ roles is as important as each role individually. Below is a description of your pairing: <strong>${primary_role}</strong> and <strong>${secondary_role}</strong>.</p>

    <div style="background:${C.navy};border-radius:12px;padding:28px 32px;margin-bottom:20px;color:white">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="display:flex">
          <div style="width:44px;height:44px;border-radius:50%;background:${C.green};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:white">${primary_role[0]}</div>
          <div style="width:44px;height:44px;border-radius:50%;background:${C.gold};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:white;margin-left:-12px">${secondary_role[0]}</div>
        </div>
        <div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.08em">${primary_role[0]}${secondary_role[0]} | ${secondary_role[0]}${primary_role[0]}</div>
          <div style="font-size:22px;font-weight:800">${narrative.pairing_name}</div>
        </div>
      </div>
      <p style="font-size:13px;color:rgba(255,255,255,0.85)">${narrative.pairing_description}</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <h3 style="color:${C.green};margin-bottom:12px">PAIRING STRENGTHS</h3>
        <ul class="bullets">
          ${narrative.pairing_benefits.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};margin-bottom:12px">PAIRING WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.pairing_watchouts.map(w => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>
  `, 6));

  // ── Page 8: Energy profile (Part 1) — cards + score breakdown ─
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Productivity Energy Profile</h2>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      ${[
        { label: "DOMINANT ENERGY",  value: energy_profile.dominant,  color: C.purple, note: "Where you create the most impact" },
        { label: "SECONDARY ENERGY", value: energy_profile.secondary, color: C.gold,   note: "Reliable support mode" },
        { label: "STRAIN ZONE",      value: energy_profile.strain,    color: C.amber,  note: "Functions but at hidden cost" },
        { label: "DEPLETED ENERGY",  value: energy_profile.depleted,  color: C.red,    note: "Where energy is lost" },
      ].map(e => `
        <div style="background:${C.grayLight};border-radius:10px;padding:18px;border-left:4px solid ${e.color}">
          <div class="label" style="color:${e.color};margin-bottom:6px">${e.label}</div>
          <div style="font-size:20px;font-weight:800;color:${C.navy}">${e.value}</div>
          <div style="font-size:11px;color:${C.gray};margin-top:4px">${e.note}</div>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:14px">ENERGY SCORE BREAKDOWN</h3>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${Object.entries(energy_scores as Record<string, number>)
        .sort(([,a],[,b]) => (b as number)-(a as number))
        .map(([e, score]) => {
          const color = ENERGY_COLORS[e] ?? C.purple;
          return `<div>
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;color:${color}">${e}</div>
            ${scoreBar(Number(score), color)}
          </div>`;
        }).join("")}
    </div>
    <div class="divider"></div>

    <h3 style="margin-bottom:12px">${energy_profile.dominant.toUpperCase()} ENERGY</h3>
    <p style="margin-bottom:24px">${narrative.energy_detailed}</p>
  `, 7));

  // ── Page 9: Energy profile (Part 2) — dominant energy detail ──
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Productivity Energy Profile <span style="font-size:16px;font-weight:400;color:${C.gray}">continued</span></h2>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px">
      <div>
        <h3 style="color:${C.green};font-size:13px;margin-bottom:8px">BENEFITS</h3>
        <ul class="bullets">
          ${narrative.energy_benefits.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};font-size:13px;margin-bottom:8px">WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.energy_watchouts.map(w => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>
  `, 8));

  // ── Page 10: ADAPTS full profile ──────────────────────────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your ADAPTS™ Profile</h2>
    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:12px">
      ${ADAPTS_ORDER.map((stage) => {
        const score  = stage_scores[stage as keyof typeof stage_scores] ?? 0;
        const detail = stage_detail[stage as keyof typeof stage_detail];
        if (!detail) return ''; // guard against missing stage
        const color  = bandColor(detail.band);

        return `
          <div style="background:${C.grayLight};border-radius:10px;padding:16px 20px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <div>
                <span style="font-size:14px;font-weight:700">${stage}</span>
                <span class="chip" style="background:${color}20;color:${color};margin-left:10px">
                  ${detail.band}
                </span>
              </div>
              <span style="font-size:20px;font-weight:800;color:${color}">${score}</span>
            </div>
            ${scoreBar(Number(score), color)}
          </div>
        `;
      }).join("")}
    </div>
  `, 9));

  // ── Page 11: ADAPTS strengths & growth ────────────────────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Strongest ADAPTS™ Stages</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">${narrative.adapts_strengths_summary}</p>
    <p style="margin-bottom:28px">${narrative.adapts_strengths_detailed}</p>

    <h2 style="font-size:24px;margin-bottom:8px">Your Development Areas</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">${narrative.adapts_growth_summary}</p>
    <p style="margin-bottom:24px">${narrative.adapts_growth_detailed}</p>

    <div class="card" style="border-left-color:${C.amber}">
      <div class="label" style="color:${C.amber};margin-bottom:8px">NOTE ON DEVELOPMENT AREAS</div>
      <p style="font-size:13px">Development areas are not permanent limitations — they are growth opportunities and delegation signals. Some people become highly capable in their weaker stages through experience or focused development. However, sustained effort in these areas without support may lead to fatigue. Seek partners with complementary strengths to cover these stages.</p>
    </div>
  `, 10));

  // ── Page 12: Application (Part 1) — work from genius + team ──
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Applying Your Change Genius™</h2>
    <div class="divider"></div>

    <h3 style="margin-bottom:12px">WORK FROM YOUR GENIUS</h3>
    <ul class="bullets" style="margin-bottom:28px">
      ${narrative.how_to_apply_as_individual.map(a => `<li>${a}</li>`).join("")}
    </ul>

    <h3 style="margin-bottom:12px">USE CHANGE GENIUS™ AS A TEAM</h3>
    <ul class="bullets">
      ${narrative.how_to_apply_as_team.map(a => `<li>${a}</li>`).join("")}
    </ul>
  `, 11));

  // ── Page 13: Application (Part 2) — 30-day action plan ────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your 30-Day Action Plan</h2>
    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:14px">
      ${narrative.next_30_days.map((action, i) => `
        <div style="display:flex;gap:14px;align-items:flex-start;padding:16px;background:${C.grayLight};border-radius:8px">
          <div style="width:32px;height:32px;border-radius:50%;background:${C.purple};color:white;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
          <p style="font-size:14px;margin:0;line-height:1.7">${action}</p>
        </div>`).join("")}
    </div>
  `, 12));

  // ── Pages 14–16: Entrepreneur Application (3 pages) ───────
  const weakestStage  = derived.bottom_adapts_stages[0];
  const strongestStage = derived.top_adapts_stages[0];

  // Entrepreneur Part 1: growth pattern + leakage + strongest stage
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Entrepreneur Application</h2>
    <p style="font-size:13px;color:${C.gray};margin-bottom:4px;font-style:italic">
      Turn Your Genius Into a Thriving Business — Clear Offers, Consistent Execution, and Real Income
    </p>
    <div class="divider"></div>

    <div style="background:${C.navy};border-radius:12px;padding:28px 32px;margin-bottom:20px;color:white">
      <div class="label" style="color:rgba(255,255,255,0.6);margin-bottom:10px">YOUR BUSINESS GROWTH PATTERN</div>
      <p style="font-size:14px;color:rgba(255,255,255,0.9);margin:0;line-height:1.7">${narrative.entrepreneur_growth_pattern}</p>
    </div>

    <div style="background:${C.grayLight};border-radius:12px;padding:24px 28px;margin-bottom:20px;border-left:4px solid ${C.red}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div class="label" style="color:${C.red}">REVENUE LEAKAGE PATTERN™</div>
        <span class="chip" style="background:${C.red}20;color:${C.red};font-size:10px;white-space:nowrap;margin-left:16px">WEAKEST: ${weakestStage}</span>
      </div>
      <p style="font-size:14px;margin:0;line-height:1.7">${narrative.revenue_leakage_pattern}</p>
    </div>

    <div style="background:${C.grayLight};border-radius:12px;padding:20px 24px;margin-bottom:20px;border-left:4px solid ${C.green};display:flex;justify-content:space-between;align-items:center">
      <div>
        <div class="label" style="color:${C.green};margin-bottom:6px">YOUR STRONGEST STAGE</div>
        <p style="font-size:14px;margin:0;line-height:1.7">You are already strong in <strong>${strongestStage}</strong>. Build your offer and content around this — it is where you create the most natural value and credibility.</p>
      </div>
      <span class="chip" style="background:${C.green}20;color:${C.green};font-size:10px;white-space:nowrap;margin-left:20px">LEVERAGE THIS</span>
    </div>
  `, 13));

  // Entrepreneur Part 2: best focus + offer feedback + content direction
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Entrepreneur Application <span style="font-size:16px;font-weight:400;color:${C.gray}">continued</span></h2>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div style="background:${C.grayLight};border-radius:12px;padding:22px;border-left:4px solid ${C.gold}">
        <div class="label" style="color:${C.gold};margin-bottom:10px">YOUR BEST FOCUS RIGHT NOW</div>
        <p style="font-size:13px;margin:0;line-height:1.7;margin-bottom:14px">${narrative.best_business_focus}</p>
        <div style="font-size:12px;color:${C.gray};border-top:1px solid ${C.border};padding-top:10px">
          Lean into <strong>${strongestStage}</strong> while fixing <strong>${weakestStage}</strong>.
        </div>
      </div>
      <div style="background:${C.grayLight};border-radius:12px;padding:22px;border-left:4px solid ${C.purple}">
        <div class="label" style="color:${C.purple};margin-bottom:10px">OFFER FEEDBACK</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="font-size:13px"><span style="color:${C.gray};font-weight:600">Solve: </span>${narrative.offer_feedback.problem}</div>
          <div style="font-size:13px"><span style="color:${C.gray};font-weight:600">Serve: </span>${narrative.offer_feedback.audience}</div>
          <div style="font-size:13px"><span style="color:${C.gray};font-weight:600">Promise: </span>${narrative.offer_feedback.outcome}</div>
          <div style="font-size:13px"><span style="color:${C.gray};font-weight:600">Simplify: </span>${narrative.offer_feedback.simplify}</div>
          <div style="font-size:13px"><span style="color:${C.red};font-weight:600">Stop: </span>${narrative.offer_feedback.stop}</div>
        </div>
      </div>
    </div>

    <div style="background:${C.grayLight};border-radius:12px;padding:24px 28px">
      <div class="label" style="color:${C.purple};margin-bottom:14px">CONTENT DIRECTION</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div>
          <div style="font-size:11px;color:${C.gray};margin-bottom:6px;font-weight:600">STYLE</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:16px;line-height:1.5">${narrative.content_direction.style}</div>
          <div style="font-size:11px;color:${C.gray};margin-bottom:6px;font-weight:600">FREQUENCY</div>
          <div style="font-size:13px;margin-bottom:12px">${narrative.content_direction.frequency}</div>
          <div style="font-size:11px;color:${C.gray};margin-bottom:6px;font-weight:600">CALL TO ACTION</div>
          <div style="font-size:13px;color:${C.purple};font-weight:600">${narrative.content_direction.cta}</div>
        </div>
        <div>
          <div style="font-size:11px;color:${C.gray};margin-bottom:6px;font-weight:600">TOPICS TO COVER</div>
          <ul class="bullets" style="margin:0 0 14px 0">
            ${narrative.content_direction.topics.map(t => `<li style="font-size:13px;margin-bottom:4px">${t}</li>`).join("")}
          </ul>
          <div style="font-size:11px;color:${C.gray};margin-bottom:6px;font-weight:600">PAIN POINTS TO ADDRESS</div>
          <ul class="bullets" style="margin:0">
            ${narrative.content_direction.pain_points.map(t => `<li style="font-size:13px;margin-bottom:4px">${t}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `, 14));

  // Entrepreneur Part 3: execution support + next best move + CTA
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Entrepreneur Application <span style="font-size:16px;font-weight:400;color:${C.gray}">continued</span></h2>
    <div class="divider"></div>

    <div style="background:${C.grayLight};border-radius:12px;padding:24px 28px;margin-bottom:20px">
      <div class="label" style="color:${C.navy};margin-bottom:14px">EXECUTION SUPPORT</div>
      <div style="display:flex;flex-direction:column;gap:14px">
        ${narrative.execution_recommendations.map((rec, i) => `
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="width:28px;height:28px;border-radius:50%;background:${C.purple};color:white;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
            <p style="font-size:13px;margin:0;line-height:1.7;padding-top:4px">${rec}</p>
          </div>`).join("")}
      </div>
    </div>

    <div style="background:${C.navy};border-radius:12px;padding:28px 32px;margin-bottom:20px;color:white">
      <div class="label" style="color:rgba(255,255,255,0.6);margin-bottom:16px">YOUR NEXT BEST MOVE</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:16px">
          <div style="font-size:11px;color:${C.gold};font-weight:700;letter-spacing:0.08em;margin-bottom:8px">FIX FIRST</div>
          <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:0;line-height:1.6">${narrative.next_best_move.fix_first}</p>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:16px">
          <div style="font-size:11px;color:${C.red};font-weight:700;letter-spacing:0.08em;margin-bottom:8px">STOP DOING</div>
          <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:0;line-height:1.6">${narrative.next_best_move.stop_doing}</p>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:16px">
          <div style="font-size:11px;color:${C.green};font-weight:700;letter-spacing:0.08em;margin-bottom:8px">START DOING</div>
          <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:0;line-height:1.6">${narrative.next_best_move.start_doing}</p>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:16px">
          <div style="font-size:11px;color:${C.purple};font-weight:700;letter-spacing:0.08em;margin-bottom:8px">MONETIZATION OPPORTUNITY</div>
          <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:0;line-height:1.6">${narrative.next_best_move.monetization_opportunity}</p>
        </div>
      </div>
    </div>

    <div style="padding:20px 28px;background:${C.grayLight};border-radius:10px;border-top:3px solid ${C.gold};text-align:center">
      <div style="font-size:15px;font-weight:700;color:${C.navy};margin-bottom:6px">Build from your genius.</div>
      <p style="font-size:13px;color:${C.gray};margin:0;line-height:1.6">Your Change Genius™ is not just about self-awareness. It is a guide for turning your value into clear offers, consistent execution, and sustainable income.</p>
    </div>
  `, 15));

  // ── Page 17: What's next ───────────────────────────────────
  pages.push(page(`
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Want to Go Deeper?</h2>
    <div class="divider"></div>

    <p style="margin-bottom:28px">Taking the Change Genius™ Assessment is the first step. Here are the next steps to maximise your impact:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${[
        { title: "Team Change Map™",     desc: "Have your team take the assessment and build a complete team change profile. Unlock handoff risks, friction patterns, and role gaps.", cta: "Build Your Team Map" },
        { title: "Coaching & Facilitation", desc: "Work with a Change Genius™ certified facilitator to deepen your understanding and apply the framework in your organisation.", cta: "Find a Facilitator" },
        { title: "Certification",         desc: "Become a certified Change Genius™ practitioner and use the framework with your own clients and teams.", cta: "Get Certified" },
        { title: "90-Day Growth Path",    desc: "Follow your personalised development path to strengthen your vulnerable stages and maximise your primary genius.", cta: "Start Your Path" },
      ].map(card => `
        <div style="background:${C.grayLight};border-radius:12px;padding:22px;border-top:3px solid ${C.purple}">
          <h3 style="margin-bottom:8px">${card.title}</h3>
          <p style="font-size:13px;margin-bottom:16px">${card.desc}</p>
          <div style="background:${C.purple};color:white;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:600;display:inline-block">${card.cta}</div>
        </div>`).join("")}
    </div>

    <div style="margin-top:40px;text-align:center;padding:32px;background:${C.navy};border-radius:12px;color:white">
      <div style="font-size:24px;font-weight:800;margin-bottom:8px">Ready to see how your team functions together?</div>
      <p style="color:rgba(255,255,255,0.75);margin-bottom:0">Visit changegeniusai.com to build your Team Change Map™</p>
    </div>

    <div style="margin-top:20px;text-align:center;padding:24px 32px;background:${C.grayLight};border-radius:12px;border-top:3px solid ${C.gold}">
      <div style="font-size:13px;color:${C.gray};margin-bottom:8px">Have a question or want to get started?</div>
      <div style="font-size:16px;font-weight:700;color:${C.navy}">Reach us at</div>
      <a href="mailto:info@changegeniusai.com" style="display:inline-block;margin-top:8px;font-size:18px;font-weight:800;color:${C.purple};text-decoration:none">info@changegeniusai.com</a>
    </div>
  `, 16));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Change Genius™ Report — ${name}</title>
  <style>${BASE_CSS}</style>
</head>
<body>
  ${pages.join("\n")}
</body>
</html>`;
}


// ── PDF generator ──────────────────────────────────────────────
export async function generatePDF(html: string): Promise<Buffer> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const p = await browser.newPage();
    await p.setContent(html, { waitUntil: "networkidle" });
    const pdf = await p.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return Buffer.from(pdf);
  }

  const chromium = (await import("@sparticuz/chromium-min")).default;
  const { chromium: playwright } = await import("playwright-core");
  const executablePath = await chromium.executablePath(
    "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
  );
  const browser = await playwright.launch({ args: chromium.args, executablePath, headless: true });
  const p = await browser.newPage();
  await p.setContent(html, { waitUntil: "networkidle" });
  const pdf = await p.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return Buffer.from(pdf);
}
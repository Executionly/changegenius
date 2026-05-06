/**
 * Change Genius™ — PDF Generator
 * Builds premium HTML for individual and team reports, then renders via Puppeteer.
 *
 * Individual report mirrors the Working Genius layout:
 *   Cover → Overview → Results → Role deep-dive → Energy → ADAPTS → Pairing → Application
 *
 * Team report:
 *   Cover → Overview → Stage coverage → Role map → Energy mix → Gaps → 90-day plan
 */

import type { ScoreResult, StageBand } from "@/lib/assessment/scoring";
import type { Narrative } from "@/lib/assessment/narratives";
import type { TeamDiagnostic } from "@/lib/assessment/team-diagnostic";

// ── Colour palette (matches brand) ────────────────────────────
const C = {
  navy: "#1B2A4A",
  purple: "#6B4FBB",
  purpleLight: "#8B6FDB",
  gold: "#C9A84C",
  green: "#2E7D52",
  red: "#C0392B",
  amber: "#E67E22",
  gray: "#64748B",
  grayLight: "#F1F5F9",
  white: "#FFFFFF",
  border: "#E2E8F0",
};

// ── Band → colour ─────
function bandColor(band: StageBand): string {
  switch (band) {
    case "Strategic Signature Strength":
      return C.green;
    case "Strong Functional Strength":
      return "#27AE60";
    case "Solid Capacity":
      return C.purple;
    case "Situational Capacity":
      return C.gold;
    case "Fragile Capacity":
      return C.amber;
    case "High-Risk Breakdown Zone":
      return C.red;
  }
}

// ── Score bar HTML ────
function scoreBar(score: number, color = C.purple): string {
  return `
    <div style="display:flex;align-items:center;gap:10px;margin:4px 0">
      <div style="flex:1;height:10px;background:#E2E8F0;border-radius:5px;overflow:hidden">
        <div style="width:${score}%;height:100%;background:${color};border-radius:5px;transition:width 0.3s"></div>
      </div>
      <span style="font-size:13px;font-weight:700;color:${color};min-width:36px;text-align:right">${score}</span>
    </div>`;
}

// ── Shared CSS ────────
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
  .tag-bar {
    position:absolute; top:0; left:0; right:0; height:6px; background:${C.purple};
  }
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

// ── Page wrapper ──────
function page(
  content: string,
  pageNum?: number,
  sectionLabel = "CHANGE GENIUS™",
): string {
  return `
  <div class="page">
    <div class="tag-bar"></div>
    ${content}
    ${
      pageNum !== undefined
        ? `
    <div class="footer">
      <span style="font-weight:600;color:${C.purple}">${sectionLabel}</span>
      <span>changegeniusai.com</span>
      <span>Page ${pageNum}</span>
    </div>`
        : ""
    }
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

export function buildIndividualReportHTML(
  input: IndividualReportInput,
): string {
  const { fullName, scores, narrative } = input;
  const name = fullName ?? "Your";
  const firstName = name.split(" ")[0];
  const date = new Date(input.completedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { derived, stage_scores, stage_detail, role_scores, energy_scores } =
    scores;
  const {
    primary_role,
    secondary_role,
    role_pair_title,
    energy_profile,
    change_capacity_score,
  } = derived;

  const pages: string[] = [];

  // ── Page 1: Cover
  pages.push(
    page(`
    <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:40px">
      <div>
        <div class="label" style="color:${C.purple};margin-bottom:24px">ASSESSMENT REPORT</div>
        <h1 style="color:${C.navy};font-size:48px;line-height:1.1;margin-bottom:8px">
          CHANGE<br>GENIUS™
        </h1>
        <div style="width:60px;height:4px;background:${C.gold};margin:20px 0 28px"></div>
        <p style="font-size:18px;color:${C.gray};font-weight:300">
          ${name}'s Change Genius™ Revealed
        </p>
      </div>

      <!-- Gear motif -->
      <div style="text-align:center;margin:40px 0">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="72" stroke="${C.purple}" stroke-width="3" fill="none" opacity="0.15"/>
          <circle cx="80" cy="80" r="52" stroke="${C.purple}" stroke-width="3" fill="none" opacity="0.25"/>
          <circle cx="80" cy="80" r="32" fill="${C.purple}" opacity="0.9"/>
          <text x="80" y="87" font-family="Inter,sans-serif" font-size="22" font-weight="800"
                fill="white" text-anchor="middle">CG</text>
          ${[0, 60, 120, 180, 240, 300]
            .map((a) => {
              const r = 72,
                rx = 80 + r * Math.cos((a * Math.PI) / 180),
                ry = 80 + r * Math.sin((a * Math.PI) / 180);
              return `<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="7" fill="${C.purple}" opacity="0.6"/>`;
            })
            .join("")}
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
  `),
  );

  // ── Page 2: Overview ───────────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">OVERVIEW</div>
    <h2 style="font-size:30px;margin-bottom:4px">A Brief Overview of Change Genius™</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">${narrative.what_is_change_genius}</p>

    <h3 style="margin-bottom:16px">THE SIX CHANGE ROLES</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px">
      ${["Spotter", "Driver", "Preparer", "Unifier", "Activator", "Stabilizer"]
        .map(
          (r) => `
        <div style="background:${C.grayLight};border-radius:8px;padding:14px 16px;display:flex;align-items:center;gap:12px">
          <div style="width:36px;height:36px;border-radius:50%;background:${C.purple};display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:14px;flex-shrink:0">${r[0]}</div>
          <div>
            <div style="font-weight:600;font-size:13px">${r}</div>
          </div>
        </div>`,
        )
        .join("")}
    </div>

    <h3 style="margin-bottom:12px">THE ADAPTS MODEL</h3>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:20px;flex-wrap:wrap">
      ${["Alert", "Diagnose", "Access", "Participate", "Transform", "Scale"]
        .map(
          (s, i) => `
        <div style="display:flex;align-items:center;gap:6px">
          <div style="background:${C.navy};color:white;border-radius:6px;padding:8px 14px;font-size:12px;font-weight:600">${s}</div>
          ${i < 5 ? `<div style="color:${C.gray};font-size:18px">→</div>` : ""}
        </div>`,
        )
        .join("")}
    </div>

    <div class="card">
      <p style="font-size:13px;font-style:italic;color:${C.navy}">
        "Change Genius™ measures how you naturally contribute to change, where execution may break down, and how you can increase your long-term impact."
      </p>
    </div>
  `,
      1,
    ),
  );

  // ── Page 3: Results summary ────────────────────────────────
  pages.push(
    page(
      `
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
          <div class="label">SECONDARY CHANGE GENIUS</div>
          <div style="font-size:20px;font-weight:800;color:${C.navy}">${secondary_role}</div>
        </div>
      </div>
      <p style="font-size:13px">You are capable of and don't mind contributing through your ${secondary_role} strengths to support change execution.</p>
    </div>

    <!-- Energy + Stages -->
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
        ${derived.top_adapts_stages
          .map(
            (s) => `
          <div style="font-size:13px;font-weight:600;padding:6px 0;border-bottom:1px solid ${C.border}">${s}</div>`,
          )
          .join("")}
      </div>
      <div>
        <div class="label" style="color:${C.red};margin-bottom:10px">⚠ DEVELOPMENT AREAS</div>
        ${derived.bottom_adapts_stages
          .map(
            (s) => `
          <div style="font-size:13px;font-weight:600;padding:6px 0;border-bottom:1px solid ${C.border}">${s}</div>`,
          )
          .join("")}
      </div>
    </div>
  `,
      2,
    ),
  );

  // ── Page 4: Primary role deep-dive ────────────────────────
  pages.push(
    page(
      `
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
          ${narrative.role_benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};margin-bottom:12px">WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.role_watchouts.map((w) => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="divider"></div>
    <div class="card">
      <div class="label" style="margin-bottom:8px">IN A TEAM CONTEXT</div>
      <p>${narrative.individual_in_team}</p>
    </div>
  `,
      3,
    ),
  );

  // ── Page 5: Secondary role ─────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Secondary Change Genius</h2>
    <div class="divider"></div>

    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div style="width:60px;height:60px;border-radius:50%;background:${C.gold};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:white;flex-shrink:0">${secondary_role[0]}</div>
      <div>
        <div class="label">THE GENIUS OF</div>
        <div style="font-size:28px;font-weight:800;color:${C.navy}">${secondary_role.toUpperCase()}</div>
      </div>
    </div>

    <p style="margin-bottom:20px">Your secondary genius of <strong>${secondary_role}</strong> complements your primary ${primary_role} genius. You are capable of and don't mind applying these strengths when the situation calls for it.</p>

    <!-- Role scores visual -->
    <h3 style="margin-bottom:16px">YOUR FULL ROLE PROFILE</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
      ${Object.entries(role_scores as Record<string, number>)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([role, score]) => {
          const isTop = role === primary_role;
          const isSecond = role === secondary_role;
          const color = isTop ? C.green : isSecond ? C.gold : C.gray;
          return `
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:13px;font-weight:${isTop || isSecond ? "700" : "400"};color:${color}">${role}${isTop ? " ★" : isSecond ? " ◆" : ""}</span>
            </div>
            ${scoreBar(Number(score), color)}
          </div>`;
        })
        .join("")}
    </div>

    <div class="card" style="border-left-color:${C.gold}">
      <div class="label" style="margin-bottom:8px">NOTE</div>
      <p style="font-size:13px">Some people become quite good at activities within their secondary genius. However, you will derive your deepest joy and energy from your primary genius of <strong>${primary_role}</strong>.</p>
    </div>
  `,
      4,
    ),
  );

  // ── Page 6: Pairing ────────────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Unique Pairing</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">While each genius type is important on its own, the combination of your two Change Geniuses can be just as insightful. Below is a description of your pairing: <strong>${primary_role}</strong> and <strong>${secondary_role}</strong>.</p>

    <div style="background:${C.navy};border-radius:12px;padding:28px 32px;margin-bottom:20px;color:white">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="display:flex;gap:-8px">
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
          ${narrative.pairing_benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};margin-bottom:12px">PAIRING WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.pairing_watchouts.map((w) => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>
  `,
      5,
    ),
  );

  // ── Page 7: Energy profile ─────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Productivity Energy Profile</h2>
    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      ${[
        {
          label: "DOMINANT ENERGY",
          value: energy_profile.dominant,
          color: C.purple,
          note: "Where you create the most impact",
        },
        {
          label: "SECONDARY ENERGY",
          value: energy_profile.secondary,
          color: C.gold,
          note: "Reliable support mode",
        },
        {
          label: "STRAIN ZONE",
          value: energy_profile.strain,
          color: C.amber,
          note: "Functions but at hidden cost",
        },
        {
          label: "DEPLETED ENERGY",
          value: energy_profile.depleted,
          color: C.red,
          note: "Where energy is lost",
        },
      ]
        .map(
          (e) => `
        <div style="background:${C.grayLight};border-radius:10px;padding:18px;border-left:4px solid ${e.color}">
          <div class="label" style="color:${e.color};margin-bottom:6px">${e.label}</div>
          <div style="font-size:20px;font-weight:800;color:${C.navy}">${e.value}</div>
          <div style="font-size:11px;color:${C.gray};margin-top:4px">${e.note}</div>
        </div>`,
        )
        .join("")}
    </div>

    <!-- Energy bar chart -->
    <h3 style="margin-bottom:14px">ENERGY SCORE BREAKDOWN</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
      ${Object.entries(role_scores as Record<string, number>)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([e, score]) => {
          const color =
            e === energy_profile.dominant
              ? C.purple
              : e === energy_profile.secondary
                ? C.gold
                : e === energy_profile.strain
                  ? C.amber
                  : C.red;
          return `<div>
            <div style="font-size:13px;font-weight:600;margin-bottom:4px">${e}</div>
            ${scoreBar(Number(score), color)}
          </div>`;
        })
        .join("")}
    </div>

    <h3 style="margin-bottom:12px">${energy_profile.dominant.toUpperCase()} ENERGY</h3>
    <p style="margin-bottom:16px">${narrative.energy_detailed}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <h3 style="color:${C.green};font-size:13px;margin-bottom:8px">BENEFITS</h3>
        <ul class="bullets">
          ${narrative.energy_benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3 style="color:${C.amber};font-size:13px;margin-bottom:8px">WATCHOUTS</h3>
        <ul class="bullets">
          ${narrative.energy_watchouts.map((w) => `<li>${w}</li>`).join("")}
        </ul>
      </div>
    </div>
  `,
      6,
    ),
  );

  // ── Page 8: ADAPTS full profile ────────────────────────────
  const stageAbbrevs: Record<string, string> = {
    "Alert the System": "Alert",
    "Diagnose the Gaps": "Diagnose",
    "Access Readiness": "Readiness",
    "Participate Through Dialogue": "Participate",
    "Transform Through Alignment": "Transform",
    "Scale and Sustain": "Scale",
  };
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your ADAPTS Profile</h2>
    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:12px">
      ${Object.entries(stage_scores)
        .map(([stage, score]) => {
          const detail = stage_detail[stage as keyof typeof stage_detail];
          const color = bandColor(detail.band);
          const abbrev = stageAbbrevs[stage] ?? stage;
          return `
        <div style="background:${C.grayLight};border-radius:10px;padding:16px 20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div>
              <span style="font-size:14px;font-weight:700">${stage}</span>
              <span class="chip" style="background:${color}20;color:${color};margin-left:10px">${detail.band}</span>
            </div>
            <span style="font-size:20px;font-weight:800;color:${color}">${score}</span>
          </div>
          ${scoreBar(Number(score), color)}
          <div style="display:flex;gap:16px;margin-top:8px">
            <span style="font-size:11px;color:${C.gray}">Stability: <strong>${detail.stability}</strong></span>
            <span style="font-size:11px;color:${C.gray}">Integrity: <strong>${detail.integrity}</strong></span>
            <span style="font-size:11px;color:${detail.risk > 50 ? C.red : C.gray}">Risk: <strong>${detail.risk}</strong></span>
          </div>
        </div>`;
        })
        .join("")}
    </div>
  `,
      7,
    ),
  );

  // ── Page 9: ADAPTS strengths ───────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">RESULTS</div>
    <h2 style="font-size:28px;margin-bottom:4px">Your Strongest ADAPTS Stages</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">${narrative.adapts_strengths_summary}</p>
    <p style="margin-bottom:28px">${narrative.adapts_strengths_detailed}</p>

    <h2 style="font-size:24px;margin-bottom:8px">Your Development Areas</h2>
    <div class="divider"></div>

    <p style="margin-bottom:20px">${narrative.adapts_growth_summary}</p>
    <p style="margin-bottom:24px">${narrative.adapts_growth_detailed}</p>

    <div class="card" style="border-left-color:${C.amber}">
      <div class="label" style="color:${C.amber};margin-bottom:8px">NOTE ON DEVELOPMENT AREAS</div>
      <p style="font-size:13px">Keep in mind that some people can become adept in their development stages through experience or circumstance. However, focusing on these areas for extended periods without support may lead to fatigue. Seek partners with complementary strengths.</p>
    </div>
  `,
      8,
    ),
  );

  // ── Page 10: Application ───────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Applying Your Change Genius™</h2>
    <div class="divider"></div>

    <h3 style="margin-bottom:12px">WORK FROM YOUR GENIUS</h3>
    <ul class="bullets" style="margin-bottom:24px">
      ${narrative.how_to_apply_as_individual.map((a) => `<li>${a}</li>`).join("")}
    </ul>

    <h3 style="margin-bottom:12px">USE CHANGE GENIUS™ AS A TEAM</h3>
    <ul class="bullets" style="margin-bottom:24px">
      ${narrative.how_to_apply_as_team.map((a) => `<li>${a}</li>`).join("")}
    </ul>

    <h3 style="margin-bottom:12px">YOUR 30-DAY ACTION PLAN</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${narrative.next_30_days
        .map(
          (action, i) => `
        <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;background:${C.grayLight};border-radius:8px">
          <div style="width:28px;height:28px;border-radius:50%;background:${C.purple};color:white;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i + 1}</div>
          <p style="font-size:13px;margin:0">${action}</p>
        </div>`,
        )
        .join("")}
    </div>
  `,
      9,
    ),
  );

  // ── Page 11: What's next ───────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">APPLICATION</div>
    <h2 style="font-size:28px;margin-bottom:4px">Want to Go Deeper?</h2>
    <div class="divider"></div>

    <p style="margin-bottom:28px">Taking the Change Genius™ Assessment is the first step. Here are the next steps to maximise your impact:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${[
        {
          title: "Team Change Map™",
          desc: "Have your team take the assessment and build a complete team change profile. Unlock handoff risks, friction patterns, and role gaps.",
          cta: "Build Your Team Map",
        },
        {
          title: "Coaching & Facilitation",
          desc: "Work with a Change Genius™ certified facilitator to deepen your understanding and apply the framework in your organisation.",
          cta: "Find a Facilitator",
        },
        {
          title: "Certification",
          desc: "Become a certified Change Genius™ practitioner and use the framework with your own clients and teams.",
          cta: "Get Certified",
        },
        {
          title: "90-Day Growth Path",
          desc: "Follow your personalised development path to strengthen your vulnerable stages and maximise your primary genius.",
          cta: "Start Your Path",
        },
      ]
        .map(
          (card) => `
        <div style="background:${C.grayLight};border-radius:12px;padding:22px;border-top:3px solid ${C.purple}">
          <h3 style="margin-bottom:8px">${card.title}</h3>
          <p style="font-size:13px;margin-bottom:16px">${card.desc}</p>
          <div style="background:${C.purple};color:white;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:600;display:inline-block">${card.cta}</div>
        </div>`,
        )
        .join("")}
    </div>

    <div style="margin-top:40px;text-align:center;padding:32px;background:${C.navy};border-radius:12px;color:white">
      <div style="font-size:24px;font-weight:800;margin-bottom:8px">Ready to see how your team functions together?</div>
      <p style="color:rgba(255,255,255,0.75);margin-bottom:0">Visit changegeniusai.com to build your Team Change Map™</p>
    </div>
  `,
      10,
    ),
  );

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

// ══════════════════════════════════════════════════════════════
// TEAM REPORT
// ══════════════════════════════════════════════════════════════

export interface TeamReportInput {
  teamName: string;
  diagnostic: TeamDiagnostic;
  memberNames: string[];
  date: string;
}

export function buildTeamReportHTML(input: TeamReportInput): string {
  const { teamName, diagnostic, memberNames, date } = input;

  const {
    stageScores,
    energyScores,
    roleDistribution,
    riskScore,
    frictionPatterns,
    rollout90Days,
  } = diagnostic;

  const teamChangeCapacityScore = 100 - riskScore;

  const sortedStages = Object.entries(stageScores).sort((a, b) => b[1] - a[1]);

  const topStages = sortedStages.slice(0, 2).map(([s]) => s);
  const bottomStages = sortedStages.slice(-2).map(([s]) => s);

  const pages: string[] = [];

  // ── Page 1: Cover
  pages.push(
    page(`
    <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:40px">
      <div>
        <div class="label" style="color:${C.purple};margin-bottom:24px">
          TEAM ASSESSMENT REPORT
        </div>

        <h1 style="color:${C.navy};font-size:44px;line-height:1.1;margin-bottom:8px">
          TEAM<br>CHANGE MAP™
        </h1>

        <div style="width:60px;height:4px;background:${C.gold};margin:20px 0 28px"></div>

        <p style="font-size:18px;color:${C.gray};font-weight:300">
          ${teamName}
        </p>
      </div>

      <div style="background:${C.navy};border-radius:12px;padding:28px 32px;color:white">
        <div class="label" style="color:rgba(255,255,255,0.6);margin-bottom:16px">
          TEAM SUMMARY
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
          <div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">
              TEAM SIZE
            </div>

            <div style="font-size:24px;font-weight:800">
              ${memberNames.length}
            </div>
          </div>

          <div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">
              TEAM CAPACITY SCORE™
            </div>

            <div style="font-size:24px;font-weight:800;color:${C.gold}">
              ${teamChangeCapacityScore}
              <span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.5)">
                /100
              </span>
            </div>
          </div>

          <div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">
              DATE
            </div>

            <div style="font-size:16px;font-weight:700">
              ${date}
            </div>
          </div>
        </div>
      </div>

      <p style="font-size:12px;color:${C.gray};text-align:center">
        Prepared for team development and organisational insight · changegeniusai.com
      </p>
    </div>
  `),
  );

  // ── Page 2: Stage coverage ─────────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">
      TEAM RESULTS
    </div>

    <h2 style="font-size:28px;margin-bottom:4px">
      Team ADAPTS Coverage
    </h2>

    <div class="divider"></div>

    <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px">
      ${Object.entries(stageScores)
        .map(([stage, avg]) => {
          const isTop = topStages.includes(stage);
          const isBottom = bottomStages.includes(stage);

          const color = isTop ? C.green : isBottom ? C.red : C.purple;

          return `
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:13px;font-weight:600">
              ${stage}${isTop ? " ✦" : isBottom ? " ⚠" : ""}
            </span>

            <span style="font-size:11px;color:${color};font-weight:700">
              ${isTop ? "Team Strength" : isBottom ? "Coverage Gap" : "Solid"}
            </span>
          </div>

          ${scoreBar(Math.round(avg), color)}
        </div>
      `;
        })
        .join("")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div style="background:${C.grayLight};border-radius:10px;padding:18px;border-left:4px solid ${C.green}">
        <div class="label" style="color:${C.green};margin-bottom:10px">
          TEAM STRENGTHS
        </div>

        ${topStages
          .map(
            (s) => `
          <div style="font-size:13px;font-weight:600;padding:4px 0">
            ${s}
          </div>
        `,
          )
          .join("")}
      </div>

      <div style="background:${C.grayLight};border-radius:10px;padding:18px;border-left:4px solid ${C.red}">
        <div class="label" style="color:${C.red};margin-bottom:10px">
          COVERAGE GAPS
        </div>

        ${bottomStages
          .map(
            (s) => `
          <div style="font-size:13px;font-weight:600;padding:4px 0">
            ${s}
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
      1,
    ),
  );

  // ── Page 3: Role + energy map ──────────────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">
      TEAM RESULTS
    </div>

    <h2 style="font-size:28px;margin-bottom:4px">
      Team Role Map
    </h2>

    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px">
      ${Object.entries(roleDistribution)
        .map(
          ([role, count]) => `
        <div style="background:${C.grayLight};border-radius:10px;padding:16px;text-align:center">
          <div
            style="
              width:40px;
              height:40px;
              border-radius:50%;
              background:${C.navy};
              color:white;
              font-size:16px;
              font-weight:800;
              display:flex;
              align-items:center;
              justify-content:center;
              margin:0 auto 8px
            "
          >
            ${(role as string)[0]}
          </div>

          <div style="font-size:13px;font-weight:700">
            ${role}
          </div>

          <div style="font-size:22px;font-weight:800;color:${count === 0 ? C.red : C.purple};margin-top:4px">
            ${count}
          </div>

          <div style="font-size:10px;color:${C.gray}">
            ${count === 0 ? "MISSING" : count === 1 ? "member" : "members"}
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <h2 style="font-size:22px;margin-bottom:8px">
      Team Energy Mix
    </h2>

    <div class="divider"></div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
      ${Object.entries(energyScores)
        .map(([energy, avg]) => {
          const colors: Record<string, string> = {
            Spark: C.gold,
            Build: C.purple,
            Polish: C.green,
            Bond: "#E84393",
          };

          const color = colors[energy] ?? C.purple;

          return `
        <div
          style="
            background:${C.grayLight};
            border-radius:10px;
            padding:16px;
            text-align:center;
            border-top:3px solid ${color}
          "
        >
          <div style="font-size:14px;font-weight:700;margin-bottom:6px">
            ${energy}
          </div>

          <div style="font-size:26px;font-weight:800;color:${color}">
            ${Math.round(avg as number)}
          </div>

          <div style="font-size:10px;color:${C.gray}">
            avg score
          </div>
        </div>
      `;
        })
        .join("")}
    </div>
  `,
      2,
    ),
  );

  // ── Page 4: Friction + recommendations ────────────────────
  pages.push(
    page(
      `
    <div class="label" style="color:${C.purple};margin-bottom:6px">
      TEAM DIAGNOSTICS
    </div>

    <h2 style="font-size:28px;margin-bottom:4px">
      Friction Patterns & Recommendations
    </h2>

    <div class="divider"></div>

    ${
      frictionPatterns && frictionPatterns.length > 0
        ? `
      <h3 style="margin-bottom:12px;color:${C.amber}">
        DETECTED FRICTION PATTERNS
      </h3>

      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
        ${frictionPatterns
          .map(
            (f) => `
          <div
            style="
              background:#FEF3C7;
              border-left:4px solid ${C.amber};
              border-radius:0 8px 8px 0;
              padding:14px 16px
            "
          >
            <p style="font-size:13px;margin:0;color:#92400E">
              ${f}
            </p>
          </div>
        `,
          )
          .join("")}
      </div>
    `
        : `
      <div
        style="
          background:#ECFDF5;
          border-left:4px solid ${C.green};
          border-radius:0 8px 8px 0;
          padding:14px 16px;
          margin-bottom:24px
        "
      >
        <p style="font-size:13px;margin:0;color:#065F46">
          No significant friction patterns detected.
          Your team has a well-balanced profile.
        </p>
      </div>
    `
    }

    <h3 style="margin-bottom:12px">
      90-DAY TEAM RECOMMENDATIONS
    </h3>

    <div style="display:flex;flex-direction:column;gap:10px">
      ${(rollout90Days ?? [])
        .map(
          (r, i) => `
        <div
          style="
            display:flex;
            gap:14px;
            align-items:flex-start;
            padding:14px;
            background:${C.grayLight};
            border-radius:8px
          "
        >
          <div
            style="
              width:28px;
              height:28px;
              border-radius:50%;
              background:${C.navy};
              color:white;
              font-weight:700;
              font-size:13px;
              display:flex;
              align-items:center;
              justify-content:center;
              flex-shrink:0
            "
          >
            ${i + 1}
          </div>

          <p style="font-size:13px;margin:0">
            ${r}
          </p>
        </div>
      `,
        )
        .join("")}
    </div>
  `,
      3,
    ),
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1"
  />

  <title>
    Change Genius™ Team Report — ${teamName}
  </title>

  <style>${BASE_CSS}</style>
</head>

<body>
  ${pages.join("\n")}
</body>
</html>`;
}

// ── Puppeteer PDF renderer
// export async function generatePDF(html: string): Promise<Buffer> {
//   // Dynamic import so the server doesn't crash if Chromium isn't installed
//   const puppeteer = await import('puppeteer').catch(() => null)
//     ?? await import('puppeteer-core').catch(() => null)

//   if (!puppeteer) throw new Error('Puppeteer not available')

//   const browser = await (puppeteer as any).launch({
//     headless: true,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-gpu',
//       '--font-render-hinting=none',
//     ],
//   })

//   try {
//     const browserPage = await browser.newPage()
//     await browserPage.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
//     const pdf = await browserPage.pdf({
//       format:           'A4',
//       printBackground:  true,
//       margin:           { top: '0', right: '0', bottom: '0', left: '0' },
//       preferCSSPageSize: false,
//     })
//     return Buffer.from(pdf)
//   } finally {
//     await browser.close()
//   }
// }

export async function generatePDF(html: string): Promise<Buffer> {
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdf = await page.pdf({ format: 'A4', printBackground: true })
    await browser.close()
    return Buffer.from(pdf)
  }

  const chromium = (await import('@sparticuz/chromium-min')).default
  const { chromium: playwright } = await import('playwright-core')

  const executablePath = await chromium.executablePath(
    'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
  )

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()
  return Buffer.from(pdf)
}

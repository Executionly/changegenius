/**
 * Change Genius™ — Scoring Engine v3
 *
 * FINAL ROLES (4): Driver, Connector, Architect, Spotter
 * FINAL ENERGIES (4): Achiever, Unifier, Organizer, Innovator
 * FINAL ADAPTS STAGES (6): Alert, Diagnose, Prepare, Align, Transform, Sustain
 *
 * Role → Energy connections (tendencies, not fixed rules):
 *   Driver    → Achiever
 *   Connector → Unifier
 *   Architect → Organizer
 *   Spotter   → Innovator
 */

import {
  QUESTIONS,
  ROLES,
  STAGES,
  ENERGIES,
  type Role,
  type AdaptsStage,
  type Energy,
  type ItemType,
} from "./questions";

export type Responses = Record<string, number>; // { questionId: 1-5 }

// ── Output types ───────────────────────────────────────────────

export interface RoleScores extends Record<Role, number> {}
export interface StageScores extends Record<AdaptsStage, number> {}
export interface EnergyScores extends Record<Energy, number> {}

export type StageBand =
  | "Strategic Signature Strength" // 90–100
  | "Strong Functional Strength"   // 75–89
  | "Solid Capacity"               // 60–74
  | "Situational Capacity"         // 45–59
  | "Fragile Capacity"             // 30–44
  | "High-Risk Breakdown Zone";    // 0–29

export interface StageDetail {
  score: number;
  band: StageBand;
  stability: number; // 0–100
  integrity: number; // 0–100
  risk: number;      // 0–100
}

export interface EnergyProfile {
  dominant: Energy;
  secondary: Energy;
  depleted: Energy;
  strain: Energy;
  scores: EnergyScores;
}

export interface DerivedResults {
  primary_role: Role;
  secondary_role: Role;
  role_pair_title: string;
  energy_profile: EnergyProfile;
  top_adapts_stages: AdaptsStage[];   // top 2
  bottom_adapts_stages: AdaptsStage[]; // bottom 2
  change_capacity_score: number;       // CCS 0–100
}

export interface ScoreResult {
  role_scores: RoleScores;
  stage_scores: StageScores;
  stage_detail: Record<AdaptsStage, StageDetail>;
  energy_scores: EnergyScores;
  derived: DerivedResults;
}

// ── Role pair titles ───────────────────────────────────────────

const ROLE_PAIR_TITLES: Partial<Record<string, string>> = {
  // Driver combinations
  "Driver+Connector": "The People-Driven Leader",
  "Driver+Architect": "The Execution Specialist",
  "Driver+Spotter":   "The Momentum Builder",
  // Connector combinations
  "Connector+Driver":    "The Relationship Driver",
  "Connector+Architect": "The Collaborative Architect",
  "Connector+Spotter":   "The Empathetic Visionary",
  // Architect combinations
  "Architect+Driver":    "The Delivery Architect",
  "Architect+Connector": "The Systems Connector",
  "Architect+Spotter":   "The Structured Strategist",
  // Spotter combinations
  "Spotter+Driver":    "The Visionary Driver",
  "Spotter+Connector": "The Visionary Connector",
  "Spotter+Architect": "The Strategic Architect",
};

function getRolePairTitle(primary: Role, secondary: Role): string {
  return (
    ROLE_PAIR_TITLES[`${primary}+${secondary}`] ?? `The ${primary} ${secondary}`
  );
}

// ── Helpers ────────────────────────────────────────────────────

function applyPolarity(value: number, reverse: boolean): number {
  return reverse ? 6 - value : value;
}

function normalize(avg: number): number {
  return Math.round(((avg - 1) / 4) * 100);
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 1;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function variance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
}

function rankKeys<T extends string>(scores: Record<T, number>): T[] {
  return (Object.keys(scores) as T[]).sort((a, b) => {
    const diff = scores[b] - scores[a];
    return diff !== 0 ? diff : a.localeCompare(b);
  });
}

// ── Stage band classification ──────────────────────────────────

export function getStageBand(score: number): StageBand {
  if (score >= 90) return "Strategic Signature Strength";
  if (score >= 75) return "Strong Functional Strength";
  if (score >= 60) return "Solid Capacity";
  if (score >= 45) return "Situational Capacity";
  if (score >= 30) return "Fragile Capacity";
  return "High-Risk Breakdown Zone";
}

// ── Weighted stage scoring ─────────────────────────────────────

const STAGE_WEIGHTS: Record<ItemType, number> = {
  preference: 0.25,
  behavior:   0.30,
  pressure:   0.25,
  reverse:    0.20,
};

interface StageRaw {
  preference: number[];
  behavior:   number[];
  pressure:   number[];
  reverse:    number[];
}

function computeWeightedStageScore(raw: StageRaw): number {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const type of Object.keys(STAGE_WEIGHTS) as ItemType[]) {
    const arr = raw[type];
    if (arr.length === 0) continue;
    weightedSum += mean(arr) * STAGE_WEIGHTS[type];
    weightTotal += STAGE_WEIGHTS[type];
  }

  if (weightTotal === 0) return 0;
  const weightedAvg = weightedSum / weightTotal;
  return normalize(weightedAvg);
}

// ── Advanced stage metrics ─────────────────────────────────────

function computeStability(raw: StageRaw): number {
  if (raw.preference.length === 0 || raw.pressure.length === 0) {
    const all = [...raw.behavior];
    if (all.length < 2) return 75;
    return Math.round(Math.max(0, 100 - (variance(all) / 4) * 100));
  }
  const gap = Math.abs(mean(raw.preference) - mean(raw.pressure));
  const sensitivity = 2.5;
  return Math.round(Math.max(0, Math.min(100, (1 - gap / sensitivity) * 100)));
}

function computeIntegrity(raw: StageRaw): number {
  const normalItems = [...raw.preference, ...raw.behavior, ...raw.pressure];
  const reverseItems = raw.reverse;

  if (normalItems.length === 0 || reverseItems.length === 0) {
    const all = normalItems.length > 0 ? normalItems : reverseItems;
    if (all.length < 2) return 75;
    const v = variance(all);
    return Math.round(Math.max(0, 100 - (v / 4) * 100));
  }

  const gap = Math.abs(mean(normalItems) - mean(reverseItems));
  const sensitivity = 2.5;
  return Math.round(Math.max(0, Math.min(100, (1 - gap / sensitivity) * 100)));
}

function computeRisk(score: number, stability: number, integrity: number): number {
  const scorePenalty     = (100 - score)     * 0.5;
  const stabilityPenalty = (100 - stability) * 0.25;
  const integrityPenalty = (100 - integrity) * 0.25;
  return Math.round(Math.min(100, scorePenalty + stabilityPenalty + integrityPenalty));
}

// ── Energy profile ─────────────────────────────────────────────

function computeEnergyProfile(energy_scores: EnergyScores): EnergyProfile {
  const ranked = rankKeys(energy_scores);
  return {
    dominant:  ranked[0] as Energy,
    secondary: ranked[1] as Energy,
    strain:    ranked[2] as Energy,
    depleted:  ranked[3] as Energy,
    scores:    energy_scores,
  };
}

// ── Change Capacity Score™ (CCS) ───────────────────────────────

function computeCCS(
  stage_scores: StageScores,
  stage_detail: Record<AdaptsStage, StageDetail>,
  energy_scores: EnergyScores,
): number {
  const scores = STAGES.map((s) => stage_scores[s]);

  const meanStage    = mean(scores);
  const stageVariance = variance(scores);
  const maxVariance   = (100 / 2) ** 2;
  const balanceIndex  = Math.max(0, 100 - (stageVariance / maxVariance) * 100);
  const stabilityMean = mean(STAGES.map((s) => stage_detail[s].stability));

  const energyValues   = ENERGIES.map((e) => energy_scores[e]);
  const energyVariance = variance(energyValues);
  const energyAlignment = Math.max(0, 100 - (energyVariance / maxVariance) * 100);

  const riskMean   = mean(STAGES.map((s) => stage_detail[s].risk));
  const confidence = 100;

  const ccs =
    meanStage     * 0.35 +
    balanceIndex  * 0.20 +
    stabilityMean * 0.15 +
    energyAlignment * 0.10 -
    riskMean      * 0.10 +
    confidence    * 0.10;

  return Math.round(Math.max(0, Math.min(100, ccs)));
}

// ── Main export ────────────────────────────────────────────────

export function calculateScores(responses: Responses): ScoreResult {
  const roleRaw  = {} as Record<Role, number[]>;
  const stageRaw = {} as Record<AdaptsStage, StageRaw>;
  const energyRaw = {} as Record<Energy, number[]>;

  for (const r of ROLES)   roleRaw[r]  = [];
  for (const e of ENERGIES) energyRaw[e] = [];
  for (const s of STAGES) {
    stageRaw[s] = { preference: [], behavior: [], pressure: [], reverse: [] };
  }

  for (const q of QUESTIONS) {
    const raw = responses[q.id];
    if (raw == null) continue;

    const adjusted = applyPolarity(raw, q.reverse);

    roleRaw[q.role].push(adjusted);
    stageRaw[q.stage][q.item_type].push(adjusted);
    energyRaw[q.energy].push(adjusted);
  }

  // Role scores
  const role_scores = Object.fromEntries(
    ROLES.map((r) => [r, normalize(mean(roleRaw[r]))]),
  ) as RoleScores;

  // Stage scores + metrics
  const stage_scores = {} as StageScores;
  const stage_detail = {} as Record<AdaptsStage, StageDetail>;

  for (const s of STAGES) {
    const raw       = stageRaw[s];
    const score     = computeWeightedStageScore(raw);
    const stability = computeStability(raw);
    const integrity = computeIntegrity(raw);
    const risk      = computeRisk(score, stability, integrity);

    stage_scores[s] = score;
    stage_detail[s] = { score, band: getStageBand(score), stability, integrity, risk };
  }

  // Energy scores
  const energy_scores = Object.fromEntries(
    ENERGIES.map((e) => [e, normalize(mean(energyRaw[e]))]),
  ) as EnergyScores;

  // Derive results
  const rankedRoles        = rankKeys(role_scores);
  const primary_role       = rankedRoles[0] as Role;
  const secondary_role     = rankedRoles[1] as Role;

  const rankedStages       = rankKeys(stage_scores);
  const top_adapts_stages  = rankedStages.slice(0, 2) as AdaptsStage[];
  const bottom_adapts_stages = [...rankedStages].reverse().slice(0, 2) as AdaptsStage[];

  const energy_profile         = computeEnergyProfile(energy_scores);
  const change_capacity_score  = computeCCS(stage_scores, stage_detail, energy_scores);

  const derived: DerivedResults = {
    primary_role,
    secondary_role,
    role_pair_title: getRolePairTitle(primary_role, secondary_role),
    energy_profile,
    top_adapts_stages,
    bottom_adapts_stages,
    change_capacity_score,
  };

  return { role_scores, stage_scores, stage_detail, energy_scores, derived };
}
/**
 * Change Genius™ — Scoring Engine v2
 *
 * Implements the full premium scoring spec:
 * - Weighted stage scores by item_type (preference/behavior/pressure/reverse)
 * - Stage interpretation bands (6 levels)
 * - Advanced metrics: stability, integrity, risk per stage
 * - Full energy profile: dominant, secondary, depleted, strain
 * - Change Capacity Score™ (CCS)
 * - Primary + secondary role from top role scores
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
} from './questions'

export type Responses = Record<string, number> // { questionId: 1-5 }

// ── Output types ───────────────────────────────────────────────

export interface RoleScores   extends Record<Role, number> {}
export interface StageScores  extends Record<AdaptsStage, number> {}
export interface EnergyScores extends Record<Energy, number> {}

export type StageBand =
  | 'Strategic Signature Strength'   // 90–100
  | 'Strong Functional Strength'     // 75–89
  | 'Solid Capacity'                 // 60–74
  | 'Situational Capacity'           // 45–59
  | 'Fragile Capacity'               // 30–44
  | 'High-Risk Breakdown Zone'       // 0–29

export interface StageDetail {
  score:      number
  band:       StageBand
  stability:  number   // 0–100: how consistent under pressure vs preference
  integrity:  number   // 0–100: how consistent reverse vs normal items
  risk:       number   // 0–100: composite breakdown risk (higher = more risk)
}

export interface EnergyProfile {
  dominant:   Energy
  secondary:  Energy
  depleted:   Energy
  strain:     Energy   // second-lowest — functions at hidden cost
  scores:     EnergyScores
}

export interface DerivedResults {
  primary_role:         Role
  secondary_role:       Role
  role_pair_title:      string
  energy_profile:       EnergyProfile
  top_adapts_stages:    AdaptsStage[]   // top 2
  bottom_adapts_stages: AdaptsStage[]   // bottom 2
  change_capacity_score: number         // CCS 0–100
}

export interface ScoreResult {
  role_scores:   RoleScores
  stage_scores:  StageScores
  stage_detail:  Record<AdaptsStage, StageDetail>
  energy_scores: EnergyScores
  derived:       DerivedResults
}

// ── Role pair titles ───────────────────────────────────────────

const ROLE_PAIR_TITLES: Partial<Record<string, string>> = {
  'Innovator+Achiever':   'The Change Driver',
  'Innovator+Organizer':  'The Strategic Inventor',
  'Innovator+Unifier':    'The Visionary Connector',
  'Innovator+Builder':    'The Architect of Change',
  'Innovator+Refiner':    'The Creative Improver',
  'Achiever+Innovator':   'The Momentum Builder',
  'Achiever+Organizer':   'The Execution Specialist',
  'Achiever+Unifier':     'The People-Driven Leader',
  'Achiever+Builder':     'The Strategic Executor',
  'Achiever+Refiner':     'The Results-Focused Optimizer',
  'Organizer+Innovator':  'The Structured Strategist',
  'Organizer+Achiever':   'The Delivery Architect',
  'Organizer+Unifier':    'The Systems Unifier',
  'Organizer+Builder':    'The Master Planner',
  'Organizer+Refiner':    'The Precision Operator',
  'Unifier+Innovator':    'The Empathetic Visionary',
  'Unifier+Achiever':     'The Relationship Driver',
  'Unifier+Organizer':    'The Collaborative Organizer',
  'Unifier+Builder':      'The Trust Builder',
  'Unifier+Refiner':      'The Inclusive Improver',
  'Builder+Innovator':    'The Bridge Builder',
  'Builder+Achiever':     'The Strategic Activator',
  'Builder+Organizer':    'The Systems Architect',
  'Builder+Unifier':      'The Alignment Champion',
  'Builder+Refiner':      'The Operational Excellence Leader',
  'Refiner+Innovator':    'The Continuous Innovator',
  'Refiner+Achiever':     'The Performance Optimizer',
  'Refiner+Organizer':    'The Systems Perfectionist',
  'Refiner+Unifier':      'The Culture Steward',
  'Refiner+Builder':      'The Sustainable Change Leader',
}

function getRolePairTitle(primary: Role, secondary: Role): string {
  return ROLE_PAIR_TITLES[`${primary}+${secondary}`] ?? `The ${primary} ${secondary}`
}

// ── Helpers ────────────────────────────────────────────────────

function applyPolarity(value: number, reverse: boolean): number {
  return reverse ? 6 - value : value
}

/** Normalize a raw 1–5 average to 0–100 */
function normalize(avg: number): number {
  return Math.round(((avg - 1) / 4) * 100)
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 1
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function variance(arr: number[]): number {
  if (arr.length < 2) return 0
  const m = mean(arr)
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length
}

/** Sort keys of a score map descending, ties broken alphabetically */
function rankKeys<T extends string>(scores: Record<T, number>): T[] {
  return (Object.keys(scores) as T[]).sort((a, b) => {
    const diff = scores[b] - scores[a]
    return diff !== 0 ? diff : a.localeCompare(b)
  })
}

// ── Stage band classification ──────────────────────────────────

export function getStageBand(score: number): StageBand {
  if (score >= 90) return 'Strategic Signature Strength'
  if (score >= 75) return 'Strong Functional Strength'
  if (score >= 60) return 'Solid Capacity'
  if (score >= 45) return 'Situational Capacity'
  if (score >= 30) return 'Fragile Capacity'
  return 'High-Risk Breakdown Zone'
}

// ── Weighted stage scoring ─────────────────────────────────────
//
// Stage Score = (preference_avg × 0.25)
//             + (behavior_avg  × 0.30)
//             + (pressure_avg  × 0.25)
//             + (reverse_avg   × 0.20)   ← reverse items already polarity-adjusted
//
// Each sub-average is on a 1–5 scale. Final weighted avg is then normalized to 0–100.

const STAGE_WEIGHTS: Record<ItemType, number> = {
  preference: 0.25,
  behavior:   0.30,
  pressure:   0.25,
  reverse:    0.20,
}

interface StageRaw {
  preference: number[]
  behavior:   number[]
  pressure:   number[]
  reverse:    number[]
}

function computeWeightedStageScore(raw: StageRaw): number {
  let weightedSum  = 0
  let weightTotal  = 0

  for (const type of Object.keys(STAGE_WEIGHTS) as ItemType[]) {
    const arr = raw[type]
    if (arr.length === 0) continue
    weightedSum += mean(arr) * STAGE_WEIGHTS[type]
    weightTotal += STAGE_WEIGHTS[type]
  }

  if (weightTotal === 0) return 0
  // Re-normalize to account for missing item types
  const weightedAvg = weightedSum / weightTotal
  return normalize(weightedAvg)
}

// ── Advanced stage metrics ─────────────────────────────────────

/**
 * Stability: how well pressure behavior matches preference
 * High variance between the two → lower stability
 * Returns 0–100 (100 = fully stable)
 */
function computeStability(raw: StageRaw): number {
  const prefAvg  = raw.preference.length > 0 ? mean(raw.preference) : null
  const pressAvg = raw.pressure.length > 0   ? mean(raw.pressure)   : null

  if (prefAvg === null || pressAvg === null) return 50 // not enough data

  const gap = Math.abs(prefAvg - pressAvg)
  // Max possible gap on a 1–5 scale is 4
  return Math.round((1 - gap / 4) * 100)
}

/**
 * Integrity: consistency between normal items and reverse-coded items
 * If reverse scores (after polarity flip) are close to normal scores → high integrity
 * Returns 0–100 (100 = fully consistent)
 */
function computeIntegrity(raw: StageRaw): number {
  const normalItems = [...raw.preference, ...raw.behavior, ...raw.pressure]
  const reverseItems = raw.reverse

  if (normalItems.length === 0 || reverseItems.length === 0) return 50

  const normalAvg  = mean(normalItems)
  const reverseAvg = mean(reverseItems) // already polarity-adjusted

  const gap = Math.abs(normalAvg - reverseAvg)
  return Math.round((1 - gap / 4) * 100)
}

/**
 * Risk: composite of low score + high variance + integrity gap
 * Returns 0–100 (100 = highest risk)
 */
function computeRisk(score: number, stability: number, integrity: number): number {
  const scorePenalty     = (100 - score) * 0.50
  const stabilityPenalty = (100 - stability) * 0.25
  const integrityPenalty = (100 - integrity) * 0.25
  return Math.round(Math.min(100, scorePenalty + stabilityPenalty + integrityPenalty))
}

// ── Energy score calculation ───────────────────────────────────
//
// The questions bank maps each question to an energy.
// We compute a simple normalized average per energy (same as before).
// For a future v3, split energy questions into preference/sustainability/effectiveness
// sub-types and apply:
//   Energy Score = (preference × 0.45) + (sustainability × 0.25) + (effectiveness × 0.20)
//                + (forced_choice × 0.10)

function computeEnergyProfile(energy_scores: EnergyScores): EnergyProfile {
  const ranked = rankKeys(energy_scores)
  return {
    dominant:  ranked[0] as Energy,
    secondary: ranked[1] as Energy,
    strain:    ranked[2] as Energy,  // functions but at hidden cost
    depleted:  ranked[3] as Energy,  // lowest
    scores:    energy_scores,
  }
}

// ── Change Capacity Score™ (CCS) ───────────────────────────────
//
// CCS = (mean_stage_score × 0.35)
//     + (balance_index    × 0.20)
//     + (stability_mean   × 0.15)
//     + (energy_alignment × 0.10)
//     - (risk_penalty     × 0.10)
//     + (confidence       × 0.10)   ← confidence fixed at 1.0 until response quality scoring added

function computeCCS(
  stage_scores: StageScores,
  stage_detail: Record<AdaptsStage, StageDetail>,
  energy_scores: EnergyScores,
): number {
  const scores = STAGES.map(s => stage_scores[s])

  // Mean stage score (0–100)
  const meanStage = mean(scores)

  // Balance index: penalizes high variance between stages
  const stageVariance = variance(scores)
  const maxVariance   = (100 / 2) ** 2  // rough upper bound
  const balanceIndex  = Math.max(0, 100 - (stageVariance / maxVariance) * 100)

  // Stability: mean of all stage stabilities
  const stabilityMean = mean(
    STAGES.map(s => stage_detail[s].stability)
  )

  // Energy alignment: how balanced the top energy is relative to all
  const energyValues   = ENERGIES.map(e => energy_scores[e])
  const energyVariance = variance(energyValues)
  const energyAlignment = Math.max(0, 100 - (energyVariance / maxVariance) * 100)

  // Risk penalty: mean of all stage risks
  const riskMean = mean(STAGES.map(s => stage_detail[s].risk))

  // Confidence placeholder — replace with real response quality score later
  const confidence = 100

  const ccs =
    (meanStage       * 0.35) +
    (balanceIndex    * 0.20) +
    (stabilityMean   * 0.15) +
    (energyAlignment * 0.10) -
    (riskMean        * 0.10) +
    (confidence      * 0.10)

  return Math.round(Math.max(0, Math.min(100, ccs)))
}

// ── Main export ────────────────────────────────────────────────

export function calculateScores(responses: Responses): ScoreResult {

  // ── Step 1: bucket raw scores by role, stage (with item_type), energy ──

  const roleRaw   = {} as Record<Role, number[]>
  const stageRaw  = {} as Record<AdaptsStage, StageRaw>
  const energyRaw = {} as Record<Energy, number[]>

  for (const r of ROLES)  roleRaw[r]  = []
  for (const e of ENERGIES) energyRaw[e] = []
  for (const s of STAGES) {
    stageRaw[s] = { preference: [], behavior: [], pressure: [], reverse: [] }
  }

  for (const q of QUESTIONS) {
    const raw = responses[q.id]
    if (raw == null) continue

    const adjusted = applyPolarity(raw, q.reverse)

    roleRaw[q.role].push(adjusted)
    stageRaw[q.stage][q.item_type].push(adjusted)
    energyRaw[q.energy].push(adjusted)
  }

  // ── Step 2: compute role scores (simple normalized average) ──

  const role_scores = Object.fromEntries(
    ROLES.map(r => [r, normalize(mean(roleRaw[r]))])
  ) as RoleScores

  // ── Step 3: compute weighted stage scores + advanced metrics ──

  const stage_scores  = {} as StageScores
  const stage_detail  = {} as Record<AdaptsStage, StageDetail>

  for (const s of STAGES) {
    const raw   = stageRaw[s]
    const score = computeWeightedStageScore(raw)
    const stability  = computeStability(raw)
    const integrity  = computeIntegrity(raw)
    const risk       = computeRisk(score, stability, integrity)

    stage_scores[s] = score
    stage_detail[s] = { score, band: getStageBand(score), stability, integrity, risk }
  }

  // ── Step 4: compute energy scores ────────────────────────────

  const energy_scores = Object.fromEntries(
    ENERGIES.map(e => [e, normalize(mean(energyRaw[e]))])
  ) as EnergyScores

  // ── Step 5: derive results ────────────────────────────────────

  const rankedRoles   = rankKeys(role_scores)
  const primary_role   = rankedRoles[0] as Role
  const secondary_role = rankedRoles[1] as Role

  const rankedStages        = rankKeys(stage_scores)
  const top_adapts_stages   = rankedStages.slice(0, 2) as AdaptsStage[]
  const bottom_adapts_stages = [...rankedStages].reverse().slice(0, 2) as AdaptsStage[]

  const energy_profile = computeEnergyProfile(energy_scores)

  const change_capacity_score = computeCCS(stage_scores, stage_detail, energy_scores)

  const derived: DerivedResults = {
    primary_role,
    secondary_role,
    role_pair_title:       getRolePairTitle(primary_role, secondary_role),
    energy_profile,
    top_adapts_stages,
    bottom_adapts_stages,
    change_capacity_score,
  }

  return { role_scores, stage_scores, stage_detail, energy_scores, derived }
}
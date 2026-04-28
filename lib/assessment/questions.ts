/**
 * Change Genius™ — Question Bank v2
 *
 * 72 questions across 6 ADAPTS stages (12 each)
 * Each stage has: 3 Preference + 4 Behavior + 3 Pressure + 2 Reverse
 *
 * Role and Energy are derived from question mappings.
 * Response scale: 1=Strongly Disagree … 5=Strongly Agree
 * reverse: true → score = 6 - value before use
 */

export type Role = 'Innovator' | 'Achiever' | 'Organizer' | 'Unifier' | 'Builder' | 'Refiner'

export type AdaptsStage =
  | 'Alert the System'
  | 'Diagnose the Gaps'
  | 'Access Readiness'
  | 'Participate Through Dialogue'
  | 'Transform Through Alignment'
  | 'Scale and Sustain'

export type Energy = 'Spark' | 'Build' | 'Polish' | 'Bond'

export type ItemType = 'preference' | 'behavior' | 'pressure' | 'reverse'

export interface Question {
  id: string
  text: string
  role: Role
  stage: AdaptsStage
  energy: Energy
  item_type: ItemType
  reverse: boolean   // always true when item_type === 'reverse'
  order: number
}

export const QUESTIONS: Question[] = [

  // ══════════════════════════════════════════════════════════
  // STAGE 1: ALERT THE SYSTEM (12 items)
  // ══════════════════════════════════════════════════════════

  // Preference (3)
  {
    id: 'ALERT_P1', order: 1,
    text: 'I naturally pay attention to early signals, patterns, and subtle changes in my environment, even before others begin to notice them.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'ALERT_P2', order: 2,
    text: 'I enjoy thinking ahead about what could shift in the future and how those changes might affect outcomes.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'ALERT_P3', order: 3,
    text: 'I find it energizing to observe trends, behaviors, and signals that may indicate upcoming opportunities or risks.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'preference', reverse: false,
  },

  // Behavior (4)
  {
    id: 'ALERT_B1', order: 4,
    text: 'I consistently monitor my environment for emerging patterns that could impact decisions, performance, or direction.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'ALERT_B2', order: 5,
    text: 'I speak up when I notice early warning signs, even when others are not yet convinced there is an issue.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'ALERT_B3', order: 6,
    text: 'I connect information from different sources to identify possible future developments or disruptions.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'ALERT_B4', order: 7,
    text: 'I regularly question current assumptions to ensure we are not overlooking important signals.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'behavior', reverse: false,
  },

  // Pressure (3)
  {
    id: 'ALERT_PR1', order: 8,
    text: 'When situations become uncertain or high-pressure, I remain attentive to early indicators that others may miss.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'ALERT_PR2', order: 9,
    text: 'Under pressure, I continue to scan for risks and opportunities rather than focusing only on immediate tasks.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'ALERT_PR3', order: 10,
    text: 'In fast-changing situations, I maintain awareness of both visible and hidden signals that could affect outcomes.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'pressure', reverse: false,
  },

  // Reverse (2)
  {
    id: 'ALERT_R1', order: 11,
    text: 'I usually wait until a problem becomes obvious before I begin to pay attention to it.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'reverse', reverse: true,
  },
  {
    id: 'ALERT_R2', order: 12,
    text: 'I tend to focus only on what is directly in front of me rather than thinking about what may change in the future.',
    role: 'Innovator', stage: 'Alert the System', energy: 'Spark',
    item_type: 'reverse', reverse: true,
  },

  // ══════════════════════════════════════════════════════════
  // STAGE 2: DIAGNOSE THE GAPS (12 items)
  // ══════════════════════════════════════════════════════════

  // Preference (3)
  {
    id: 'DIAG_P1', order: 13,
    text: 'I am naturally inclined to analyze situations deeply in order to understand the root causes behind problems or outcomes.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'DIAG_P2', order: 14,
    text: 'I enjoy breaking down complex issues into smaller components so that they can be clearly understood.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'DIAG_P3', order: 15,
    text: 'I prefer to gain clarity and insight before taking action, even if it requires additional time and effort.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'preference', reverse: false,
  },

  // Behavior (4)
  {
    id: 'DIAG_B1', order: 16,
    text: 'I ask thoughtful and probing questions to uncover what is really happening beneath the surface of a situation.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'DIAG_B2', order: 17,
    text: 'I examine patterns, data, and evidence to ensure that conclusions are based on accurate understanding.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'DIAG_B3', order: 18,
    text: 'I challenge assumptions when they appear incomplete, unclear, or unsupported by evidence.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'DIAG_B4', order: 19,
    text: 'I take time to verify information before making recommendations or decisions.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },

  // Pressure (3)
  {
    id: 'DIAG_PR1', order: 20,
    text: 'When under pressure, I remain committed to understanding the problem fully rather than rushing into action.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'DIAG_PR2', order: 21,
    text: 'In high-stakes situations, I continue to ask clarifying questions to avoid making incorrect assumptions.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'DIAG_PR3', order: 22,
    text: 'Even when urgency increases, I maintain focus on identifying the real issue instead of reacting quickly.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'pressure', reverse: false,
  },

  // Reverse (2)
  {
    id: 'DIAG_R1', order: 23,
    text: 'I often take action before I fully understand the underlying cause of a problem.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'reverse', reverse: true,
  },
  {
    id: 'DIAG_R2', order: 24,
    text: 'I rely more on instinct or quick judgment than careful analysis when making decisions.',
    role: 'Refiner', stage: 'Diagnose the Gaps', energy: 'Polish',
    item_type: 'reverse', reverse: true,
  },

  // ══════════════════════════════════════════════════════════
  // STAGE 3: ACCESS READINESS (12 items)
  // ══════════════════════════════════════════════════════════

  // Preference (3)
  {
    id: 'READY_P1', order: 25,
    text: 'I naturally focus on ensuring that people, systems, and resources are prepared before execution begins.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'READY_P2', order: 26,
    text: 'I believe that proper preparation significantly increases the likelihood of successful outcomes.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'READY_P3', order: 27,
    text: 'I enjoy organizing people, processes, and tools so that execution can happen smoothly.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'preference', reverse: false,
  },

  // Behavior (4)
  {
    id: 'READY_B1', order: 28,
    text: 'I ensure that individuals clearly understand their roles and responsibilities before starting any initiative.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'READY_B2', order: 29,
    text: 'I identify gaps in skills, resources, or systems that could prevent successful execution.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'READY_B3', order: 30,
    text: 'I create structure, plans, and frameworks to support effective implementation.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'READY_B4', order: 31,
    text: 'I evaluate whether conditions are suitable before committing to action.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },

  // Pressure (3)
  {
    id: 'READY_PR1', order: 32,
    text: 'Under pressure, I still prioritize preparation rather than rushing into execution prematurely.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'READY_PR2', order: 33,
    text: 'When timelines are tight, I focus on ensuring that key elements are in place before proceeding.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'READY_PR3', order: 34,
    text: 'Even in urgent situations, I assess readiness to avoid unnecessary failure.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'pressure', reverse: false,
  },

  // Reverse (2)
  {
    id: 'READY_R1', order: 35,
    text: 'I believe it is better to start quickly and figure things out later rather than spend time preparing.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'reverse', reverse: true,
  },
  {
    id: 'READY_R2', order: 36,
    text: 'I often move into action without ensuring that the necessary structures are in place.',
    role: 'Organizer', stage: 'Access Readiness', energy: 'Build',
    item_type: 'reverse', reverse: true,
  },

  // ══════════════════════════════════════════════════════════
  // STAGE 4: PARTICIPATE THROUGH DIALOGUE (12 items)
  // ══════════════════════════════════════════════════════════

  // Preference (3)
  {
    id: 'DIAL_P1', order: 37,
    text: 'I naturally focus on ensuring that people are aligned, engaged, and working toward a shared direction.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'DIAL_P2', order: 38,
    text: 'I value clarity, trust, and mutual understanding within teams and organizations.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'DIAL_P3', order: 39,
    text: 'I am drawn to facilitating conversations that bring people together around common goals.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'preference', reverse: false,
  },

  // Behavior (4)
  {
    id: 'DIAL_B1', order: 40,
    text: 'I actively ensure that expectations, roles, and objectives are clearly communicated to everyone involved.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'DIAL_B2', order: 41,
    text: 'I address misunderstandings or misalignment before they become larger issues.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'DIAL_B3', order: 42,
    text: 'I create opportunities for dialogue so that people can contribute and feel included.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'DIAL_B4', order: 43,
    text: 'I ensure that decisions are understood and supported by the people responsible for execution.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'behavior', reverse: false,
  },

  // Pressure (3)
  {
    id: 'DIAL_PR1', order: 44,
    text: 'Under pressure, I prioritize alignment and communication rather than forcing quick decisions without clarity.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'DIAL_PR2', order: 45,
    text: 'In tense situations, I address conflict directly to maintain trust and cohesion.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'DIAL_PR3', order: 46,
    text: 'When challenges arise, I ensure that people remain connected and focused on shared outcomes.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'pressure', reverse: false,
  },

  // Reverse (2)
  {
    id: 'DIAL_R1', order: 47,
    text: 'I avoid difficult conversations, even when misalignment is affecting results.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'reverse', reverse: true,
  },
  {
    id: 'DIAL_R2', order: 48,
    text: 'I assume that people understand expectations without verifying alignment.',
    role: 'Unifier', stage: 'Participate Through Dialogue', energy: 'Bond',
    item_type: 'reverse', reverse: true,
  },

  // ══════════════════════════════════════════════════════════
  // STAGE 5: TRANSFORM THROUGH ALIGNMENT (12 items)
  // ══════════════════════════════════════════════════════════

  // Preference (3)
  {
    id: 'TRANS_P1', order: 49,
    text: 'I am naturally energized by turning ideas, plans, and strategies into tangible results.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'TRANS_P2', order: 50,
    text: 'I enjoy driving progress and ensuring that work moves forward consistently.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'TRANS_P3', order: 51,
    text: 'I focus on achieving outcomes and delivering measurable impact.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'preference', reverse: false,
  },

  // Behavior (4)
  {
    id: 'TRANS_B1', order: 52,
    text: 'I take ownership of moving initiatives from planning into execution.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'TRANS_B2', order: 53,
    text: 'I maintain momentum and ensure that progress continues despite obstacles.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'TRANS_B3', order: 54,
    text: 'I hold myself and others accountable for delivering results.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'TRANS_B4', order: 55,
    text: 'I track progress and adjust actions to ensure goals are achieved.',
    role: 'Builder', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'behavior', reverse: false,
  },

  // Pressure (3)
  {
    id: 'TRANS_PR1', order: 56,
    text: 'Under pressure, I increase focus and effort to ensure that results are delivered.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'TRANS_PR2', order: 57,
    text: 'In demanding situations, I remain committed to execution rather than withdrawing or delaying.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'TRANS_PR3', order: 58,
    text: 'When challenges arise, I adapt quickly to keep progress moving forward.',
    role: 'Builder', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'pressure', reverse: false,
  },

  // Reverse (2)
  {
    id: 'TRANS_R1', order: 59,
    text: 'I often struggle to follow through on plans once execution becomes difficult.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'reverse', reverse: true,
  },
  {
    id: 'TRANS_R2', order: 60,
    text: 'I lose momentum when obstacles or resistance appear during implementation.',
    role: 'Achiever', stage: 'Transform Through Alignment', energy: 'Build',
    item_type: 'reverse', reverse: true,
  },

  // ══════════════════════════════════════════════════════════
  // STAGE 6: SCALE AND SUSTAIN (12 items)
  // ══════════════════════════════════════════════════════════

  // Preference (3)
  {
    id: 'SUST_P1', order: 61,
    text: 'I naturally focus on maintaining systems, processes, and results over the long term.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'SUST_P2', order: 62,
    text: 'I value consistency, discipline, and long-term impact over short-term success.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'preference', reverse: false,
  },
  {
    id: 'SUST_P3', order: 63,
    text: 'I enjoy ensuring that what is built continues to function effectively over time.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'preference', reverse: false,
  },

  // Behavior (4)
  {
    id: 'SUST_B1', order: 64,
    text: 'I monitor performance to ensure that systems continue to deliver expected results.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'SUST_B2', order: 65,
    text: 'I reinforce habits, standards, and processes that support sustainability.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'SUST_B3', order: 66,
    text: 'I identify risks that could weaken long-term stability.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },
  {
    id: 'SUST_B4', order: 67,
    text: 'I maintain discipline to ensure consistency over time.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'behavior', reverse: false,
  },

  // Pressure (3)
  {
    id: 'SUST_PR1', order: 68,
    text: 'Under pressure, I protect long-term outcomes rather than sacrificing them for short-term gains.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'SUST_PR2', order: 69,
    text: 'In difficult situations, I remain committed to maintaining systems and structures.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'pressure', reverse: false,
  },
  {
    id: 'SUST_PR3', order: 70,
    text: 'When faced with trade-offs, I prioritize sustainability and long-term value.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'pressure', reverse: false,
  },

  // Reverse (2)
  {
    id: 'SUST_R1', order: 71,
    text: 'I tend to lose interest once something has been successfully launched.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'reverse', reverse: true,
  },
  {
    id: 'SUST_R2', order: 72,
    text: 'I focus more on starting new initiatives than maintaining existing ones.',
    role: 'Refiner', stage: 'Scale and Sustain', energy: 'Polish',
    item_type: 'reverse', reverse: true,
  },
]

export const ORDERED_QUESTIONS = [...QUESTIONS].sort((a, b) => a.order - b.order)

export const TOTAL_QUESTIONS = QUESTIONS.length // 72

export const ROLES: Role[] = ['Innovator', 'Achiever', 'Organizer', 'Unifier', 'Builder', 'Refiner']

export const STAGES: AdaptsStage[] = [
  'Alert the System',
  'Diagnose the Gaps',
  'Access Readiness',
  'Participate Through Dialogue',
  'Transform Through Alignment',
  'Scale and Sustain',
]

export const ENERGIES: Energy[] = ['Spark', 'Build', 'Polish', 'Bond']

/** Items per stage broken down by type — useful for weighted scoring */
export const STAGE_ITEM_COUNTS = {
  preference: 3,
  behavior:   4,
  pressure:   3,
  reverse:    2,
} as const
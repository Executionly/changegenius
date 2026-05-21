import { TeamDiagnostic } from './assessment/team-diagnostic'
import { openai } from './openai'

interface AdaptsInsightInput {
  dialogue: number
  alignment: number
  execution: number
  momentum: number

  previousDialogue?: number | null
  previousAlignment?: number | null
  previousExecution?: number | null
  previousMomentum?: number | null

  weekNumber: number
  teamName: string
  diagnostic: TeamDiagnostic
}

/**
 * Determines which ADAPTS™ stage most needs attention this week,
 * based on pulse scores + team profile.
 */
function resolveAdaptsStageInFocus(
  dialogue: number,
  alignment: number,
  execution: number,
  momentum: number,
  stageScores: Record<string, number>
): { stage: string; reason: string } {
  // Rule-based triage — order matters (most urgent first)
  if (dialogue < 45 && alignment < 50) {
    return {
      stage: 'Participate Through Dialogue',
      reason:
        'Low dialogue and alignment scores signal that the team is not communicating or trusting enough to move together. Conversation quality is the root issue.',
    }
  }
  if (execution < 45 && momentum < 50) {
    return {
      stage: 'Transform Through Alignment',
      reason:
        'Low execution with weak momentum indicates that plans exist but are not being converted into action. The team needs structural alignment around priorities and accountability.',
    }
  }
  if (alignment > 70 && execution < 45) {
    return {
      stage: 'Assess Readiness',
      reason:
        'The team is aligned in intent but not converting that alignment into execution. A readiness gap — capacity, clarity, or confidence — is blocking progress.',
    }
  }
  if (momentum > 70 && stageScores['Sustain'] != null && stageScores['Sustain'] < 45) {
    return {
      stage: 'Scale and Sustain',
      reason:
        'High momentum without strong Sustain scores is a sustainability risk. The team is moving fast but may not have the systems to maintain that pace long-term.',
    }
  }
  if (stageScores['Alert'] != null && stageScores['Alert'] < 45) {
    return {
      stage: 'Alert the System',
      reason:
        'Weak Alert scores mean the team is likely missing early signals of risk, resistance, or opportunity. Leaders need to sharpen environmental awareness this week.',
    }
  }
  if (stageScores['Diagnose'] != null && stageScores['Diagnose'] < 45) {
    return {
      stage: 'Diagnose the Gaps',
      reason:
        'The team may be treating symptoms rather than root causes. Diagnosis capability needs strengthening before execution efforts will hold.',
    }
  }

  // Default: lowest scoring ADAPTS stage
  const sorted = Object.entries(stageScores).sort((a, b) => a[1] - b[1])
  const [lowestStage] = sorted[0]
  return {
    stage: lowestStage,
    reason: `The ${lowestStage} stage has the lowest score in the team's ADAPTS™ profile and represents the most constrained area of change capacity this week.`,
  }
}

export async function generateAdaptsLeadershipInsight(input: AdaptsInsightInput) {
  const { diagnostic, teamName, weekNumber } = input

  const stageFocus = resolveAdaptsStageInFocus(
    input.dialogue,
    input.alignment,
    input.execution,
    input.momentum,
    diagnostic.stageScores
  )

  const stageLines = Object.entries(diagnostic.stageScores)
    .map(([s, v]) => `  ${s}: ${Math.round(v)}/100`)
    .join('\n')

  const energyLines = Object.entries(diagnostic.energyScores)
    .map(([e, v]) => `  ${e}: ${Math.round(v)}/100`)
    .join('\n')

  const roleLines = Object.entries(diagnostic.roleDistribution)
    .map(([r, c]) => `  ${r}: ${c} member${c !== 1 ? 's' : ''}`)
    .join('\n')

  const deltaLines = [
    input.previousDialogue != null
      ? `Dialogue: ${input.previousDialogue} → ${input.dialogue}`
      : null,
    input.previousAlignment != null
      ? `Alignment: ${input.previousAlignment} → ${input.alignment}`
      : null,
    input.previousExecution != null
      ? `Execution: ${input.previousExecution} → ${input.execution}`
      : null,
    input.previousMomentum != null
      ? `Momentum: ${input.previousMomentum} → ${input.momentum}`
      : null,
  ]
    .filter(Boolean)
    .join('\n  ')

  const prompt = `
You are the Change Genius™ Leadership Intelligence Engine — a world-class executive coaching system that helps team leaders understand what is happening inside their team and what to do about it.

Your role is to generate a structured weekly leadership interpretation for the admin of the team below. This is NOT a general summary. Every section must be grounded in this team's actual Change Genius™ profile, this week's pulse scores, and the ADAPTS™ stage identified as needing attention.

━━━━━━━━━━━━━━━━━━━━━
TEAM: ${teamName}
WEEK: ${weekNumber}
━━━━━━━━━━━━━━━━━━━━━

WEEKLY PULSE SCORES:
  Dialogue:  ${input.dialogue}/100
  Alignment: ${input.alignment}/100
  Execution: ${input.execution}/100
  Momentum:  ${input.momentum}/100

WEEK-OVER-WEEK CHANGES:
  ${deltaLines || 'No previous data.'}

CHANGE GENIUS™ ROLE DISTRIBUTION:
${roleLines}
Missing roles: ${diagnostic.missingRoles.length ? diagnostic.missingRoles.join(', ') : 'None'}
Overweight roles: ${diagnostic.overweightRoles.length ? diagnostic.overweightRoles.join(', ') : 'None'}

ADAPTS™ STAGE SCORES:
${stageLines}

ENERGY SCORES:
${energyLines}
Dominant energy: ${diagnostic.dominantEnergy}

FRICTION PATTERNS:
${diagnostic.frictionPatterns.length ? diagnostic.frictionPatterns.map(f => `  - ${f}`).join('\n') : '  None detected'}

RISK LEVEL: ${diagnostic.riskLevel} (score: ${diagnostic.riskScore}/100)

━━━━━━━━━━━━━━━━━━━━━
ADAPTS™ STAGE REQUIRING ATTENTION THIS WEEK
━━━━━━━━━━━━━━━━━━━━━
Stage: ${stageFocus.stage}
Why: ${stageFocus.reason}

━━━━━━━━━━━━━━━━━━━━━
ADAPTS™ FRAMEWORK REFERENCE
━━━━━━━━━━━━━━━━━━━━━
A — Alert the System: Recognize signals, risks, opportunities, resistance, pressure points, and the need for change before problems escalate.
D — Diagnose the Gaps: Identify root causes, leadership breakdowns, execution barriers, system weaknesses, misalignment, and hidden performance gaps.
A — Assess Readiness: Evaluate people, culture, leadership capacity, emotional readiness, resources, systems, and execution capability required for sustainable change.
P — Participate Through Dialogue: Build trust, engagement, ownership, and collaboration through intentional communication, listening, feedback, and healthy conversations.
T — Transform Through Alignment: Execute change by aligning people, systems, priorities, leadership, structure, communication, and accountability toward a shared outcome.
S — Scale and Sustain: Reinforce long-term success through culture, habits, leadership development, learning systems, measurement, consistency, and continuous improvement.

━━━━━━━━━━━━━━━━━━━━━
YOUR OUTPUT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━
Generate exactly ONE structured leadership insight object with these six fields:

1. teamFlavorSummary
   A 2–3 sentence interpretation of what this team's Change Genius™ profile + this week's pulse data reveals about how the team is currently operating. Reference specific roles, energies, or ADAPTS stage patterns. Make it feel like a sharp, accurate read of the team — not a summary of numbers.

2. adaptsStageInFocus
   The stage name (use exactly: "Alert the System", "Diagnose the Gaps", "Assess Readiness", "Participate Through Dialogue", "Transform Through Alignment", or "Scale and Sustain") and a 1–2 sentence explanation of why this stage needs leadership attention this week, tied to the team's real profile and pulse scores.

3. opportunityForGrowth
   A specific growth opportunity the leader can act on this week — tied to the team's dominant energy, role strengths, or a high-scoring ADAPTS stage. Keep it practical and forward-looking.

4. potentialRiskIfIgnored
   What specifically risks getting worse if the leader takes no action this week, given this team's role composition and score patterns. Be direct but constructive — no doom, just clarity.

5. recommendedLeadershipAction
   One clear, specific action the team leader should take this week. Not generic ("communicate more"). Reference the team's actual profile (e.g. "Your Connectors should lead a 20-minute alignment check-in focused on X"). Make it immediately actionable.

6. sustainabilityOrScalingRecommendation
   A forward-looking recommendation about how the team sustains momentum, builds healthier systems, or prepares for scaling — based on their current trajectory and profile.

Return ONLY a valid JSON object in this exact shape. No markdown, no explanation, no preamble:

{
  "teamFlavorSummary": "string",
  "adaptsStageInFocus": {
    "stage": "string",
    "explanation": "string"
  },
  "opportunityForGrowth": "string",
  "potentialRiskIfIgnored": "string",
  "recommendedLeadershipAction": "string",
  "sustainabilityOrScalingRecommendation": "string"
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are the Change Genius™ Leadership Intelligence Engine. You generate precise, profile-aware weekly leadership insights for organizational leaders. Every insight must be grounded in the team\'s actual role composition, ADAPTS™ stage scores, energy profile, and pulse data. Never give generic advice.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 1,
  })

  const raw = response.choices[0].message.content || '{}'
  const parsed = JSON.parse(raw)

  // Return this as a single structured feed item with type "leadership_insight"
  // so it slots into the existing feeds array cleanly
  return {
    type: 'leadership_insight',
    title: `Week ${weekNumber} Leadership Intelligence`,
    content: parsed.teamFlavorSummary,
    cta: parsed.recommendedLeadershipAction,
    tone: 'positive',
    priority: 0, // always surfaces first
    metadata: {
      adaptsStageInFocus: parsed.adaptsStageInFocus,
      opportunityForGrowth: parsed.opportunityForGrowth,
      potentialRiskIfIgnored: parsed.potentialRiskIfIgnored,
      sustainabilityOrScalingRecommendation: parsed.sustainabilityOrScalingRecommendation,
    },
  }
}
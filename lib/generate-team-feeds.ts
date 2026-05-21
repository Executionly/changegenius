import { TeamDiagnostic } from './assessment/team-diagnostic'
import { openai } from './openai'

interface Input {
  // Pulse scores (0-100)
  dialogue: number
  alignment: number
  execution: number
  momentum: number

  previousMomentum?: number | null
  previousDialogue?: number | null
  previousAlignment?: number | null
  previousExecution?: number | null

  weekNumber: number

  // Change Genius™ team profile
  diagnostic: TeamDiagnostic
  teamName: string
}

function buildDiagnosticSummary(d: TeamDiagnostic, teamName: string): string {
  const sorted       = Object.entries(d.stageScores).sort((a, b) => b[1] - a[1])
  const topStages    = sorted.slice(0, 2).map(([s]) => s)
  const bottomStages = sorted.slice(-2).map(([s]) => s)

  const presentRoles  = Object.entries(d.roleDistribution).filter(([, c]) => c > 0).map(([r, c]) => `${r} (${c})`)
  const missingRoles  = d.missingRoles.length > 0 ? d.missingRoles.join(', ') : 'None'
  const overweight    = d.overweightRoles.length > 0 ? d.overweightRoles.join(', ') : 'None'

  const stageLines = Object.entries(d.stageScores)
    .map(([stage, score]) => `  - ${stage}: ${Math.round(score)}/100 (${d.stageHealth[stage as keyof typeof d.stageHealth]})`)
    .join('\n')

  const energyLines = Object.entries(d.energyScores)
    .map(([e, score]) => `  - ${e}: ${Math.round(score)}/100`)
    .join('\n')

  return `
TEAM: ${teamName}
RISK LEVEL: ${d.riskLevel} (score: ${d.riskScore}/100)
TEAM SIZE: ${d.memberCount} members (${d.completedCount} completed assessment)

ROLE DISTRIBUTION:
  Present: ${presentRoles.join(', ')}
  Missing: ${missingRoles}
  Overweight: ${overweight}

ADAPTS™ STAGE SCORES:
${stageLines}

TOP STAGES (strengths): ${topStages.join(', ')}
BOTTOM STAGES (gaps): ${bottomStages.join(', ')}

ENERGY SCORES:
${energyLines}
DOMINANT ENERGY: ${d.dominantEnergy}

FRICTION PATTERNS DETECTED:
${d.frictionPatterns.length > 0 ? d.frictionPatterns.map(f => `  - ${f}`).join('\n') : '  None detected'}
`
}

function buildDelta(
  current: number,
  previous: number | null | undefined,
  label: string
): string {
  if (previous == null || previous === 0) return ''
  const diff = current - previous
  if (diff === 0) return `${label} held steady at ${current}.`
  return `${label} ${diff > 0 ? 'rose' : 'dropped'} by ${Math.abs(diff)} points (${previous} → ${current}).`
}

export async function generateTeamFeeds(input: Input) {
  const { diagnostic, teamName } = input

  const sorted       = Object.entries(diagnostic.stageScores).sort((a, b) => b[1] - a[1])
  const bottomStages = sorted.slice(-2).map(([s]) => s)
  const topStages    = sorted.slice(0, 2).map(([s]) => s)

  const deltas = [
    buildDelta(input.dialogue,  input.previousDialogue,  'Dialogue'),
    buildDelta(input.alignment, input.previousAlignment, 'Alignment'),
    buildDelta(input.execution, input.previousExecution, 'Execution'),
    buildDelta(input.momentum,  input.previousMomentum,  'Momentum'),
  ].filter(Boolean).join(' ')

  const profileSummary = buildDiagnosticSummary(diagnostic, teamName)

  const prompt = `
You are the intelligence engine behind Change Genius™ — an elite AI platform that helps teams understand how they drive change together.

Your job is to generate smart, specific, actionable feed items for the ADMIN of this team's dashboard.

These feeds are NOT generic HR updates. They are grounded in this team's actual Change Genius™ profile — their role makeup, ADAPTS™ stage scores, energy, and friction patterns — combined with this week's pulse check-in data.

The admin should read these feeds and immediately know:
- What is happening in their team right now
- What their specific role or ADAPTS gaps are costing them
- What action to take this week
- Where momentum is shifting and why

━━━━━━━━━━━━━━━━━━━━━
TEAM CHANGE GENIUS™ PROFILE
━━━━━━━━━━━━━━━━━━━━━
${profileSummary}

━━━━━━━━━━━━━━━━━━━━━
WEEKLY PULSE CHECK-IN (Week ${input.weekNumber})
━━━━━━━━━━━━━━━━━━━━━
Current scores:
- Dialogue:  ${input.dialogue}/100
- Alignment: ${input.alignment}/100
- Execution: ${input.execution}/100
- Momentum:  ${input.momentum}/100

Week-over-week changes: ${deltas || 'No previous data available.'}

━━━━━━━━━━━━━━━━━━━━━
GENERATION RULES
━━━━━━━━━━━━━━━━━━━━━

Generate 7–10 feed items. Each feed must:

1. Reference the team's ACTUAL profile data — mention specific roles (Driver, Connector, Architect, Spotter), real ADAPTS stage names (Alert, Diagnose, Prepare, Align, Transform, Sustain), actual gaps or strengths, and real friction patterns where relevant.

2. Connect the pulse scores to the profile — e.g. if Alignment pulse is low AND the team is missing a Connector, the feed should say so. If Execution pulse dropped AND the Sustain stage is weak, connect those dots.

3. Be admin-facing — give the team lead or manager a specific action, observation, or coaching insight they can act on THIS WEEK.

4. Use professional, intelligent language — like a world-class executive coach who also understands organizational systems. No corporate jargon. No filler. No generic advice.

5. Vary the feed types across:
   - "insight"     → connects profile + pulse to reveal something non-obvious
   - "action"      → a specific thing the admin should do this week
   - "warning"     → risk forming based on profile + pulse combination
   - "coaching"    → leadership or team behavior guidance tied to their role mix
   - "celebration" → genuine strength or positive trend to acknowledge (only if warranted)
   - "trend"       → a pattern forming over weeks (use delta data if available)

6. Do NOT generate generic advice like "communicate more" or "set clear goals" — tie every feed to their specific roles, stage gaps, energy profile, or friction pattern.

7. Do NOT restate raw numbers — interpret them. Say what they mean for THIS team given their profile.

EXAMPLE of a good feed (for reference only — do not copy):
{
  "type": "warning",
  "title": "Alignment gap is compounding your missing Connector",
  "content": "Your Alignment pulse sits below 50 this week, and your team has no Connector role to facilitate trust and buy-in. These two gaps reinforce each other — without someone actively bridging communication, decisions will continue being made without genuine team alignment. This is your highest risk area right now.",
  "cta": "Identify who on the team could temporarily take on the Connector function — even informally — for the next two weeks.",
  "tone": "warning",
  "priority": 1
}

Now generate 5–8 feeds for this specific team. Return ONLY valid JSON in this exact format:

{
  "feeds": [
    {
      "type": "insight | action | warning | coaching | celebration | trend",
      "title": "string",
      "content": "string",
      "cta": "string or null",
      "tone": "positive | neutral | warning",
      "priority": 1
    }
  ]
}

Sort by priority (1 = most urgent). No markdown, no explanation, only the JSON object.
`

  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are the Change Genius™ intelligence engine. You generate precise, profile-aware team coaching feeds for organizational leaders. You always ground your output in the team\'s actual role composition, ADAPTS stage scores, and energy profile. Never give generic advice.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 1,
  })

  const raw    = response.choices[0].message.content || '{}'
  const parsed = JSON.parse(raw)

  return Array.isArray(parsed) ? parsed : (parsed.feeds || [])
}
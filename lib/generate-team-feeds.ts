import { openai } from './openai'

interface Input {
    dialogue: number
    alignment: number
    execution: number
    momentum: number

    previousMomentum?: number | null
    previousDialogue?: number | null
    previousAlignment?: number | null
    previousExecution?: number | null

    weekNumber: number
}

export async function generateTeamFeeds(input: Input) {
    const prompt = `
    You are an elite AI organizational strategist and workplace coach.

    Your job is to generate engaging internal feed updates for a company's team dashboard.

    The feed should feel intelligent, modern, insightful, and actionable.

    Generate:
    - trends
    - observations
    - coaching insights
    - morale analysis
    - burnout warnings
    - leadership guidance
    - celebrations
    - execution analysis

    Avoid robotic wording.
    Avoid repeating metrics directly.
    Write naturally like a workplace intelligence platform.

    Current Week Data:
    - Dialogue: ${input.dialogue}/100
    - Alignment: ${input.alignment}/100
    - Execution: ${input.execution}/100
    - Momentum: ${input.momentum}/100

    Previous Week:
    - Dialogue: ${input.previousDialogue ?? 'N/A'}/100
    - Alignment: ${input.previousAlignment ?? 'N/A'}/100
    - Execution: ${input.previousExecution ?? 'N/A'}/100
    - Momentum: ${input.previousMomentum ?? 'N/A'}/100

    Generate 5-8 feed items.

    IMPORTANT:
    Include:
    - trend detection
    - team mood analysis
    - burnout detection
    - leadership coaching
    - operational insight
    - positive highlights if applicable

   Return ONLY a valid JSON object in this exact format:
    {
      "feeds": [
        {
          "type": "trend | insight | warning | coaching | celebration | burnout | leadership | mood",
          "title": "string",
          "content": "string",
          "cta": "string or null",
          "tone": "positive | neutral | warning",
          "priority": 1
        }
      ]
    }
    `

    const response = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: [
        {
            role: 'system',
            content: 'You generate world-class workplace intelligence feeds.',
        },
        {
            role: 'user',
            content: prompt,
        },
        ],
        response_format: {
            type: 'json_object',
        },
    })

    const raw = response.choices[0].message.content || '{}'

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : parsed.feeds || []
}
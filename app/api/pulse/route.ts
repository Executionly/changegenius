import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { generateTeamFeeds } from '@/lib/generate-team-feeds'
import { computeTeamDiagnostic, MemberScore } from '@/lib/assessment/team-diagnostic'
import { normalizeStageName } from '@/lib/assessment/narratives'
import { AdaptsStage, Energy, Role } from '@/lib/assessment/questions'
import { generateAdaptsLeadershipInsight } from '@/lib/generate-adapt-insight'

const schema = z.object({
  teamId: z.string().uuid(),
  weekNumber: z.number().int().min(1),

  dialogueScore: z.number().int().min(1).max(5),
  alignmentScore: z.number().int().min(1).max(5),
  executionScore: z.number().int().min(1).max(5),
})

function avg(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

async function createSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}


const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabase()

    const { data, error: authError } = await supabase.auth.getUser()

    if (authError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const session = data

    const body = await req.json()

    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const {
      teamId,
      weekNumber,
      dialogueScore,
      alignmentScore,
      executionScore,
    } = parsed.data

    const { data: team } = await supabase
    .from('teams')
    .select('id, name, organization, invite_code, owner_id')
    .eq('id', teamId)
    .single()

    if(!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 403 }
      )
    }

    // Verify membership
    const { data: member } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .single()

    if (!member) {
      return NextResponse.json(
        { error: 'Not a team member' },
        { status: 403 }
      )
    }

    // Save pulse entry
    const toScore = (v: number): 20 | 60 | 100 => {
      if (v <= 1) return 20
      if (v <= 3) return 60
      return 100
    }

    const { error } = await supabase
      .from('pulse_entries')
      .upsert(
        {
          team_id: teamId,
          user_id: session.user.id,
          week_number: weekNumber,
          dialogue_score:  toScore(dialogueScore),
          alignment_score: toScore(alignmentScore),
          execution_score: toScore(executionScore),
        },
        { onConflict: 'team_id,user_id,week_number' }
      )

    if (error) {
      console.error(error)

      return NextResponse.json(
        { error: 'Failed to save pulse' },
        { status: 500 }
      )
    }

    // Get all entries for current week
    const { data: currentEntries } = await supabase
      .from('pulse_entries')
      .select(
        `
        dialogue_score,
        alignment_score,
        execution_score
      `
      )
      .eq('team_id', teamId)
      .eq('week_number', weekNumber)

    const dialogueAvg = avg(
      currentEntries?.map((x) => x.dialogue_score) || []
    )

    const alignmentAvg = avg(
      currentEntries?.map((x) => x.alignment_score) || []
    )

    const executionAvg = avg(
      currentEntries?.map((x) => x.execution_score) || []
    )

    const momentum = Math.round(
      ((dialogueAvg + alignmentAvg + executionAvg) / 15) * 100
    )

    // Previous week
    const previousWeek = weekNumber - 1

    const { data: previousEntries } = await supabase
      .from('pulse_entries')
      .select(
        `
        dialogue_score,
        alignment_score,
        execution_score
      `
      )
      .eq('team_id', teamId)
      .eq('week_number', previousWeek)

    const previousDialogue = Math.round(
      avg(
        previousEntries?.map((x) => x.dialogue_score) || []
      ) * 20
    )

    const previousAlignment = Math.round(
      avg(
        previousEntries?.map((x) => x.alignment_score) || []
      ) * 20
    )

    const previousExecution = Math.round(
      avg(
        previousEntries?.map((x) => x.execution_score) || []
      ) * 20
    )

    const previousMomentum = Math.round(
      (
        (
          avg(
            previousEntries?.map(
              (x) => x.dialogue_score
            ) || []
          ) +
          avg(
            previousEntries?.map(
              (x) => x.alignment_score
            ) || []
          ) +
          avg(
            previousEntries?.map(
              (x) => x.execution_score
            ) || []
          )
        ) / 15
      ) * 100
    )

    // Prevent duplicate AI feeds
    const { data: existingFeed } = await supabase
      .from('team_ai_feeds')
      .select('id')
      .eq('team_id', teamId)
      .eq('week_number', weekNumber)
      .limit(1)

    let feeds = []

    if (!existingFeed?.length) {
      const { data: members } = await supabase
        .from('team_members')
        .select('user_id, status, assessment_status, primary_role, secondary_role, profiles(full_name, email, change_genius_role, change_genius_role_2)')
        .eq('team_id', teamId)
        .eq('assessment_status', 'completed')

      if (!members || members.length < 3) {
        return NextResponse.json({ error: 'Full report requires 3 completed members' }, { status: 403 })
      }

      const memberScores: MemberScore[] = []
      const memberNames: string[] = []
    
      for (const m of members) {
        const p = m.profiles as any
    
        const { data: assessment, error: assessmentError } = await supabase
          .from('assessments')
          .select('id')
          .eq('user_id', m.user_id)
          .eq('team_id', teamId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle()
    
        if (!assessment) continue
    
        const { data: scores, error: scoresError } = await supabase
          .from('scores')
          .select('stage_scores, energy_scores')
          .eq('assessment_id', assessment.id)
          .maybeSingle()
    
        if (!scores) continue
    
        const rawStageScores = scores.stage_scores as Record<string, number>
        const normalizedStageScores = Object.fromEntries(
          Object.entries(rawStageScores).map(([stage, score]) => [
            normalizeStageName(stage),
            score,
          ])
        ) as Record<AdaptsStage, number>
    
        memberScores.push({
          userId:        m.user_id,
          fullName:      p?.full_name ?? p?.email ?? 'Member',
          primaryRole:   m.primary_role as Role,
          secondaryRole: m.secondary_role as Role,
          stageScores:   normalizedStageScores,
          energyScores:  scores.energy_scores as Record<Energy, number>,
        })
        memberNames.push(p?.full_name ?? p?.email ?? 'Member')
      }
    
      const diagnostic = computeTeamDiagnostic(memberScores)
      const [existingFeeds, leadershipInsight] = await Promise.all([
        generateTeamFeeds({
          dialogue: Math.round(dialogueAvg * 20),
          alignment: Math.round(alignmentAvg * 20),
          execution: Math.round(executionAvg * 20),
          momentum,
          previousDialogue,
          previousAlignment,
          previousExecution,
          previousMomentum,
          weekNumber,
          teamName: team.name,
          diagnostic,
        }),
        generateAdaptsLeadershipInsight({
          dialogue: Math.round(dialogueAvg * 20),
          alignment: Math.round(alignmentAvg * 20),
          execution: Math.round(executionAvg * 20),
          momentum,
          previousDialogue,
          previousAlignment,
          previousExecution,
          previousMomentum,
          weekNumber,
          teamName: team.name,
          diagnostic,
        }),
      ])

      // Leadership insight is priority 0 — always first in the feed
      feeds = [leadershipInsight, ...existingFeeds]

      console.log('[pulse] generated feeds:', feeds.length)

      if (feeds.length) {
        const { error: feedError } = await adminSupabase.from('team_ai_feeds').insert(
          feeds.map((feed: any) => ({
            team_id: teamId,
            week_number: weekNumber,
            type: feed.type,
            title: feed.title,
            content: feed.content,
            cta: feed.cta,
            tone: feed.tone,
            metadata: {
              priority: feed.priority,
              ...(feed.metadata ?? {}),
            },
          }))
        )
        console.log('[pulse] feed insert error:', feedError)
      }
    }

    return NextResponse.json({
      success: true,
      weekNumber,
      momentum,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const teamId =
      req.nextUrl.searchParams.get('teamId')

    if (!teamId) {
      return NextResponse.json(
        { error: 'Missing teamId' },
        { status: 400 }
      )
    }

    const supabase = await createSupabase()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify membership
    const { data: member } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .single()

    if (!member) {
      return NextResponse.json(
        { error: 'Not a team member' },
        { status: 403 }
      )
    }

    // Latest pulse submitted by current user
    const { data: latestPulse } = await supabase
      .from('pulse_entries')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .order('week_number', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    // Weekly analytics
    const { data: entries } = await supabase
      .from('pulse_entries')
      .select(
        `
        week_number,
        dialogue_score,
        alignment_score,
        execution_score
      `
      )
      .eq('team_id', teamId)
      .order('week_number', {
        ascending: true,
      })

    const grouped: Record<
      number,
      {
        d: number[]
        a: number[]
        e: number[]
      }
    > = {}

    for (const entry of entries || []) {
      if (!grouped[entry.week_number]) {
        grouped[entry.week_number] = {
          d: [],
          a: [],
          e: [],
        }
      }

      grouped[entry.week_number].d.push(
        entry.dialogue_score
      )

      grouped[entry.week_number].a.push(
        entry.alignment_score
      )

      grouped[entry.week_number].e.push(
        entry.execution_score
      )
    }

    const weeks = Object.entries(grouped).map(
      ([week, scores]) => {
        const d = avg(scores.d)
        const a = avg(scores.a)
        const e = avg(scores.e)

        return {
          week: Number(week),

          dialogue: Math.round(d * 20),
          alignment: Math.round(a * 20),
          execution: Math.round(e * 20),

          momentum: Math.round(
            ((d + a + e) / 15) * 100
          ),

          respondents: scores.d.length,
        }
      }
    )

    // AI feeds
    const { data: feeds } = await adminSupabase
    .from('team_ai_feeds')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      latestPulse,
      analytics: weeks,
      feeds,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
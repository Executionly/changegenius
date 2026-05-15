import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { computeTeamDiagnostic, type MemberScore } from '@/lib/assessment/team-diagnostic'
import type { Role, AdaptsStage, Energy } from '@/lib/assessment/questions'
import { normalizeStageName } from '@/lib/assessment/narratives'

interface IMemberScore {
  userId:      string
  fullName:    string | null
  primaryRole?: Role | null
  secondaryRole?: Role | null
  stageScores?: Record<AdaptsStage, number> | null
  energyScores?: Record<Energy, number> | null
}

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get('teamId')
  if (!teamId) return NextResponse.json({ error: 'Missing teamId' }, { status: 400 })

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (s) => s.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify user is owner or member
  const { data: team } = await supabase
    .from('teams')
    .select('id, name, organization, invite_code, owner_id')
    .eq('id', teamId)
    .single()

  if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

  const isOwner = team.owner_id === session.user.id
  if (!isOwner) {
    const { data: membership } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .single()
    if (!membership) return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
  }

  // Get all members + their scores

  const { data: members } = await supabase
  .from('team_members')
  .select(`
    user_id, status, assessment_status, completed_at,
    primary_role, secondary_role, role_pair_title,
    primary_energy, top_adapts_stages, bottom_adapts_stages,
    profiles(full_name, email)
  `)
  .eq('team_id', teamId)

  const completedMembers = (members ?? []).filter(m => m.assessment_status === 'completed')
  const memberScores: IMemberScore[] = []

  for (const member of members ?? []) {
    const profile = member.profiles as any  // already joined, no second fetch needed

    let stageScores: Record<AdaptsStage, number> | null = null
    let energyScores: Record<Energy, number> | null = null

    // Scope to team_id so we get the right assessment
    const { data: assessment } = await supabase
      .from('assessments')
      .select('id')
      .eq('user_id', member.user_id)
      .eq('team_id', teamId) 
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (assessment) {
      const { data: scores } = await supabase
        .from('scores')
        .select('stage_scores, energy_scores')
        .eq('assessment_id', assessment.id)
        .maybeSingle()

      if (scores) {
        // Normalize old long stage names → new short names
        const rawStageScores = scores.stage_scores as Record<string, number>
        const normalizedStageScores = {} as Record<AdaptsStage, number>
        for (const [stage, score] of Object.entries(rawStageScores)) {
          const normalized = normalizeStageName(stage) as AdaptsStage
          normalizedStageScores[normalized] = score
        }
        stageScores = normalizedStageScores
        energyScores = scores.energy_scores as Record<Energy, number>
      }
    }

    memberScores.push({
      userId:       member.user_id,
      fullName:     (member.profiles as any)?.full_name ?? (member.profiles as any)?.email ?? 'Member',
      primaryRole:  (member.primary_role ?? null) as Role | null,
      secondaryRole:(member.secondary_role ?? null) as Role | null,
      stageScores,
      energyScores,
    })
  }

  const totalMembers    = (members ?? []).length
  const completedCount  = completedMembers.length
  const appUrl          = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Enforce minimum threshold
  const BASIC_THRESHOLD = 3
  const FULL_THRESHOLD  = 5

  const unlocked     = completedCount >= BASIC_THRESHOLD
  const fullUnlocked = completedCount >= FULL_THRESHOLD

  // Only run diagnostic if enough members
  const diagnostic = unlocked ? computeTeamDiagnostic(memberScores as unknown as MemberScore[]) : null

  // Save/update team report if full unlock
  if (fullUnlocked && diagnostic) {
    await supabase.from('team_reports').upsert({
      team_id:      teamId,
      report_json:  diagnostic,
      member_count: totalMembers,
      risk_score:   diagnostic.riskScore,
      last_updated: new Date().toISOString(),
    }, { onConflict: 'team_id' })
  }

  return NextResponse.json({
    team: {
      id:          team.id,
      name:        team.name,
      organization: team.organization,
      inviteCode:  team.invite_code,
      inviteLink:  `${appUrl}/teams/join?code=${team.invite_code}`,
      isOwner,
    },
    members: (members ?? []).map(m => ({
      userId: m.user_id,
      status: m.status,
      assessmentStatus: m.assessment_status ?? 'not_started',
      role: m.user_id === team.owner_id ? "Admin" : "Member",
      completedAt: m.completed_at,
      isOwner: m.user_id === team.owner_id,
      fullName: (m.profiles as any)?.full_name ?? (m.profiles as any)?.email ?? 'Member',
      primaryRole: m.primary_role ?? null,
      secondaryRole: m.secondary_role ?? null,
      rolePairTitle:       m.role_pair_title ?? null,
      energy_profile:       m.primary_energy ?? null,
      topAdaptsStages:     m.top_adapts_stages ?? [],
      bottomAdaptsStages:  m.bottom_adapts_stages ?? [],
    })),
    totalMembers,
    completedCount,
    unlocked,
    fullUnlocked,
    nextThreshold: !unlocked ? BASIC_THRESHOLD : !fullUnlocked ? FULL_THRESHOLD : null,
    diagnostic,
  })
}

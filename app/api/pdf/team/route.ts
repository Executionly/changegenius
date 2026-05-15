import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { computeTeamDiagnostic, type MemberScore } from '@/lib/assessment/team-diagnostic'
import type { Role, AdaptsStage, Energy } from '@/lib/assessment/questions'
import { buildTeamReportHTML } from '@/lib/pdf/team-generator'
import { generatePDF } from '@/lib/pdf/generator'
import { normalizeStageName } from '@/lib/assessment/narratives'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60 // PDF generation can be slow
export const runtime = 'nodejs' // not 'edge'

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get('teamId')
  if (!teamId) return NextResponse.json({ error: 'Missing teamId' }, { status: 400 })

  const cookieStore = await cookies()
  // Auth check with anon client
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (s) => s.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { session } } = await supabaseAuth.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Service role client for all data fetching — bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Verify owner
  const { data: team } = await supabase
    .from('teams')
    .select('id, name, owner_id')
    .eq('id', teamId)
    .eq('owner_id', session.user.id)
    .single()

  if (!team) return NextResponse.json({ error: 'Not found or not owner' }, { status: 404 })

  // Get completed members + scores
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
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const html = buildTeamReportHTML({
    teamName: team.name,
    diagnostic,
    memberNames,
    date,
  })

  try {
    const pdfBuffer = await generatePDF(html)
    const slug = team.name.toLowerCase().replace(/\s+/g, '-')
    return new NextResponse(html, {
      headers: {
        'Content-Type':        'text/html',
        'Content-Disposition': 'inline',
      },
    })
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}-team-report.pdf"`,
        'Cache-Control':       'private, no-cache',
      },
    })
  } catch (err) {
    console.error('[pdf/team] Chromium unavailable, returning HTML:', err)
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html', 'Content-Disposition': 'inline' },
    })
  }
}

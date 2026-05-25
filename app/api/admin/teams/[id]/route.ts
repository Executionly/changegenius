import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, isAdminSession, adminDb, audit } from '@/lib/admin'

// ── GET /api/admin/teams/[id] 
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['support', 'admin', 'super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id } = params

    // Team core
    const { data: team, error: teamError } = await adminDb
      .from('teams')
      .select(`
        id, name, organization, invite_code, created_at,
        owner:profiles!owner_id(id, email, full_name)
      `)
      .eq('id', id)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Members with their profile + assessment result
    const { data: members } = await adminDb
      .from('team_members')
      .select(`
        id, status, joined_at,
        profile:profiles!user_id(
          id, email, full_name, has_paid,
          change_genius_role, change_genius_role_2,
          primary_energy, top_adapts_stages, bottom_adapts_stages
        )
      `)
      .eq('team_id', id)
      .order('joined_at', { ascending: true })

    // Team report
    const { data: report } = await adminDb
      .from('team_reports')
      .select('report_json, member_count, risk_score, last_updated')
      .eq('team_id', id)
      .maybeSingle()

    // Pulse history — weekly aggregates
    const { data: pulseEntries } = await adminDb
      .from('pulse_entries')
      .select('week_number, dialogue_score, alignment_score, execution_score')
      .eq('team_id', id)
      .order('week_number', { ascending: true })

    // Aggregate pulse by week
    const pulseByWeek: Record<number, { d: number[]; a: number[]; e: number[] }> = {}
    for (const entry of pulseEntries ?? []) {
      if (!pulseByWeek[entry.week_number]) {
        pulseByWeek[entry.week_number] = { d: [], a: [], e: [] }
      }
      pulseByWeek[entry.week_number].d.push(entry.dialogue_score)
      pulseByWeek[entry.week_number].a.push(entry.alignment_score)
      pulseByWeek[entry.week_number].e.push(entry.execution_score)
    }

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

    const pulseWeeks = Object.entries(pulseByWeek).map(([week, scores]) => ({
      week:        Number(week),
      dialogue:    Math.round(avg(scores.d) * 20),
      alignment:   Math.round(avg(scores.a) * 20),
      execution:   Math.round(avg(scores.e) * 20),
      respondents: scores.d.length,
    }))

    return NextResponse.json({
      team,
      members:    members    ?? [],
      report:     report     ?? null,
      pulseWeeks: pulseWeeks ?? [],
    })
  } catch (error) {
    console.error('[admin/teams/[id] GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/admin/teams/[id] 
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id } = params

    const { data: team } = await adminDb
      .from('teams')
      .select('name')
      .eq('id', id)
      .single()

    const { error } = await adminDb
      .from('teams')
      .delete()
      .eq('id', id)

    if (error) throw error

    await audit(session, 'team.delete', 'team', id, { name: team?.name }, req)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/teams/[id] DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
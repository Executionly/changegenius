import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, isAdminSession, adminDb } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req)
  if (!isAdminSession(session)) return session

  try {
    const now       = new Date()
    const weekAgo   = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000).toISOString()
    const twoWeekAgo= new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: totalUsers },
      { count: paidUsers },
      { count: totalTeams },
      { count: totalAssessments },
      { count: signupsThisWeek },
      { count: signupsLastWeek },
      { count: assessmentsThisWeek },
      { count: failedPayments },
      { data: revenueRows },
    ] = await Promise.all([
      // Total users
      adminDb.from('profiles').select('*', { count: 'exact', head: true }),

      // Paid users
      adminDb.from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('has_paid', true),

      // Total teams
      adminDb.from('teams').select('*', { count: 'exact', head: true }),

      // Total completed assessments
      adminDb.from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),

      // Signups this week
      adminDb.from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo),

      // Signups last week
      adminDb.from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twoWeekAgo)
        .lt('created_at', weekAgo),

      // Assessments completed this week
      adminDb.from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('completed_at', weekAgo),

      // Failed payments
      adminDb.from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed'),

      // Revenue by currency (completed payments only)
      adminDb.from('payments')
        .select('currency, amount_minor')
        .eq('status', 'completed'),
    ])

    // Aggregate revenue by currency
    const revenueByCurrency: Record<string, number> = {}
    for (const row of revenueRows ?? []) {
      const key = row.currency.toUpperCase()
      revenueByCurrency[key] = (revenueByCurrency[key] ?? 0) + row.amount_minor
    }

    // Teams with 0 completed assessments (potential alert)
    const { data: teamMemberStats } = await adminDb
      .from('team_members')
      .select('team_id, status')

    const teamCompletionMap: Record<string, number> = {}
    for (const row of teamMemberStats ?? []) {
      if (!teamCompletionMap[row.team_id]) teamCompletionMap[row.team_id] = 0
      if (row.status === 'completed') teamCompletionMap[row.team_id]++
    }
    const teamsWithNoCompletion = Object.values(teamCompletionMap).filter(v => v === 0).length

    return NextResponse.json({
      users: {
        total:         totalUsers     ?? 0,
        paid:          paidUsers      ?? 0,
        unpaid:        (totalUsers ?? 0) - (paidUsers ?? 0),
        thisWeek:      signupsThisWeek  ?? 0,
        lastWeek:      signupsLastWeek  ?? 0,
      },
      teams: {
        total:              totalTeams           ?? 0,
        withNoCompletion:   teamsWithNoCompletion,
      },
      assessments: {
        total:     totalAssessments     ?? 0,
        thisWeek:  assessmentsThisWeek  ?? 0,
      },
      payments: {
        failed:           failedPayments   ?? 0,
        revenueByCurrency,
      },
    })
  } catch (error) {
    console.error('[admin/overview]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
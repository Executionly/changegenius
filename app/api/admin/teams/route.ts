import { NextRequest, NextResponse } from 'next/server'
import {
  requireAdmin, isAdminSession, adminDb,
  paginate, paginatedResponse,
} from '@/lib/admin'

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req, ['support', 'admin', 'super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { page, limit, from, to } = paginate(req)
    const params = req.nextUrl.searchParams

    const search    = params.get('search') 
    const minRisk   = params.get('min_risk')
    const maxRisk   = params.get('max_risk')
    const dateFrom  = params.get('date_from')
    const dateTo    = params.get('date_to')

    let query = adminDb
      .from('teams')
      .select(
        `id, name, organization, invite_code, created_at,
         owner:profiles!owner_id(id, email, full_name),
         team_members(count)`,
        { count: 'exact' }
      )

    if (search)   query = query.ilike('name', `%${search}%`)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo)   query = query.lte('created_at', dateTo)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Transform data to include total_members count
    const transformedData = (data ?? []).map((team: any) => ({
      ...team,
      total_members: team.team_members?.length ?? 0,
      team_members: undefined // Remove the raw team_members data
    }))

    // Apply risk filter in memory (it lives on team_reports join)
    let filtered = transformedData
    if (minRisk || maxRisk) {
      filtered = filtered.filter((t: any) => {
        const risk = t.team_reports?.[0]?.risk_score ?? null
        if (risk === null) return false
        if (minRisk && risk < parseInt(minRisk)) return false
        if (maxRisk && risk > parseInt(maxRisk)) return false
        return true
      })
    }

    return paginatedResponse(filtered, count ?? 0, page, limit)
  } catch (error) {
    console.error('[admin/teams GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
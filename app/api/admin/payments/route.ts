import { NextRequest, NextResponse } from 'next/server'
import {
  requireAdmin, isAdminSession, adminDb,
  paginate, paginatedResponse,
} from '@/lib/admin'

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req, ['admin', 'super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { page, limit, from, to } = paginate(req)
    const params   = req.nextUrl.searchParams

    const provider  = params.get('provider')   // 'stripe' | 'paystack'
    const currency  = params.get('currency')
    const status    = params.get('status')     // 'pending' | 'completed' | 'failed' | 'refunded'
    const dateFrom  = params.get('date_from')
    const dateTo    = params.get('date_to')
    const search    = params.get('search')     // user email

    let query = adminDb
      .from('payments')
      .select(
        `id, provider, provider_reference, plan, amount_minor, currency,
         status, paid_at, created_at,
         user:profiles!user_id(id, email, full_name),
         team:teams!team_id(id, name)`,
        { count: 'exact' }
      )

    if (provider) query = query.eq('provider', provider)
    if (currency) query = query.eq('currency', currency.toUpperCase())
    if (status)   query = query.eq('status', status)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo)   query = query.lte('created_at', dateTo)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Search by user email in memory (join filter)
    let filtered = data ?? []
    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(
        (p: any) => p.user?.email?.toLowerCase().includes(s)
      )
    }

    return paginatedResponse(filtered, count ?? 0, page, limit)
  } catch (error) {
    console.error('[admin/payments GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
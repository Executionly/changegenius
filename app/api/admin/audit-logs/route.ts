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
    const params = req.nextUrl.searchParams

    const adminId    = params.get('admin_id')
    const action     = params.get('action')      // e.g. 'user.delete'
    const targetType = params.get('target_type') // e.g. 'user', 'team'
    const dateFrom   = params.get('date_from')
    const dateTo     = params.get('date_to')

    let query = adminDb
      .from('admin_audit_logs')
      .select(
        'id, admin_id, admin_email, action, target_type, target_id, metadata, ip_address, created_at',
        { count: 'exact' }
      )

    if (adminId)    query = query.eq('admin_id', adminId)
    if (action)     query = query.eq('action', action)
    if (targetType) query = query.eq('target_type', targetType)
    if (dateFrom)   query = query.gte('created_at', dateFrom)
    if (dateTo)     query = query.lte('created_at', dateTo)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return paginatedResponse(data ?? [], count ?? 0, page, limit)
  } catch (error) {
    console.error('[admin/audit-logs GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
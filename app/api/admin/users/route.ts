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

    const hasPaid      = params.get('has_paid') 
    const country      = params.get('country')
    const search       = params.get('search')

    // First, get all admin user IDs to exclude
    const { data: adminUsers, error: adminError } = await adminDb
      .from('admin_users')
      .select('user_id')

    if (adminError) throw adminError

    // Extract admin user IDs into an array
    const adminUserIds = adminUsers?.map(admin => admin.user_id) ?? []

    let query = adminDb
      .from('profiles')
      .select(
        `id, email, full_name, bottom_adapts_stages, role,
         change_genius_role, change_genius_role_2, role_pair_title,
         primary_energy, has_paid, onboarded, created_at`,
        { count: 'exact' }
      )

    // Exclude admin users - only if there are admin users to exclude
    if (adminUserIds.length > 0) {
      query = query.not('id', 'in', `(${adminUserIds.join(',')})`)
    }

    if (hasPaid === 'true')  query = query.eq('has_paid', true)
    if (hasPaid === 'false') query = query.eq('has_paid', false)
    if (country)             query = query.eq('country', country)
    if (search)              query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return paginatedResponse(data ?? [], count ?? 0, page, limit)
  } catch (error) {
    console.error('[admin/users GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
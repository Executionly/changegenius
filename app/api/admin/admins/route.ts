import { NextRequest, NextResponse } from 'next/server'
import {
  requireAdmin, isAdminSession, adminDb,
  paginate, paginatedResponse, audit,
} from '@/lib/admin'

// ── GET /api/admin/admins 
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req, ['super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { page, limit, from, to } = paginate(req)

    const { data, count, error } = await adminDb
      .from('admin_users')
      .select(
        'id, email, full_name, role, is_active, last_active, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return paginatedResponse(data ?? [], count ?? 0, page, limit)
  } catch (error) {
    console.error('[admin/admins GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/admin/admins 
// Creates a new Supabase auth user and adds them to admin_users
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req, ['super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { email, password, fullName, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'email, password and role are required' },
        { status: 400 }
      )
    }

    const validRoles = ['super_admin', 'admin', 'support', 'developer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Create auth user
    const { data: authData, error: authError } =
      await adminDb.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message ?? 'Failed to create auth user' },
        { status: 400 }
      )
    }

    // Add to admin_users
    const { data: adminUser, error: insertError } = await adminDb
      .from('admin_users')
      .insert({
        user_id:    authData.user.id,
        email,
        full_name:  fullName ?? null,
        role,
        created_by: session.adminId,
      })
      .select('id, email, full_name, role, is_active, created_at')
      .single()

    if (insertError) {
      // Rollback auth user creation
      await adminDb.auth.admin.deleteUser(authData.user.id)
      throw insertError
    }

    await audit(
      session,
      'admin.create',
      'admin',
      adminUser.id,
      { email, role },
      req
    )

    return NextResponse.json({ success: true, admin: adminUser }, { status: 201 })
  } catch (error) {
    console.error('[admin/admins POST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
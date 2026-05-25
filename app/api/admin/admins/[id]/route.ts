import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, isAdminSession, adminDb, audit } from '@/lib/admin'

// ── PATCH /api/admin/admins/[id] 
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id }  = params
    const body    = await req.json()
    const allowed = ['role', 'is_active', 'full_name'] as const
    const updates: Record<string, unknown> = {}

    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
    }

    // Prevent super_admin from deactivating themselves
    if (id === session.adminId && updates.is_active === false) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    const { data, error } = await adminDb
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select('id, email, full_name, role, is_active')
      .single()

    if (error) throw error

    await audit(session, 'admin.update', 'admin', id, { updates }, req)

    return NextResponse.json({ success: true, admin: data })
  } catch (error) {
    console.error('[admin/admins/[id] PATCH]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/admin/admins/[id] 
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id } = params

    if (id === session.adminId) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      )
    }

    const { data: adminUser } = await adminDb
      .from('admin_users')
      .select('email, user_id')
      .eq('id', id)
      .single()

    // Remove from admin_users (does not delete the auth user)
    const { error } = await adminDb
      .from('admin_users')
      .delete()
      .eq('id', id)

    if (error) throw error

    await audit(
      session,
      'admin.delete',
      'admin',
      id,
      { email: adminUser?.email },
      req
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/admins/[id] DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
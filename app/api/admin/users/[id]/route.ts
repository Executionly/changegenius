import { NextRequest, NextResponse } from 'next/server'
import {
  requireAdmin, isAdminSession, adminDb, audit, roleAtLeast,
} from '@/lib/admin'

// ── GET /api/admin/users/[id] 
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['support', 'admin', 'super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id } = params

    // Profile
    const { data: profile, error: profileError } = await adminDb
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Latest completed assessment + scores
    const { data: assessment } = await adminDb
      .from('assessments')
      .select('id, status, started_at, completed_at, version')
      .eq('user_id', id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let scores = null
    if (assessment) {
      const { data: scoreRow } = await adminDb
        .from('scores')
        .select('role_scores, stage_scores, energy_scores, derived, calculated_at')
        .eq('assessment_id', assessment.id)
        .maybeSingle()
      scores = scoreRow
    }

    // Payment history
    const { data: payments } = await adminDb
      .from('payments')
      .select('id, provider, provider_reference, plan, amount_minor, currency, status, paid_at, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false })

    // Team membership
    const { data: memberships } = await adminDb
      .from('team_members')
      .select('id, status, joined_at, teams(id, name, owner_id)')
      .eq('user_id', id)

    return NextResponse.json({
      profile,
      assessment: assessment
        ? { ...assessment, scores }
        : null,
      payments:    payments    ?? [],
      memberships: memberships ?? [],
    })
  } catch (error) {
    console.error('[admin/users/[id] GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/admin/users/[id] 
// Allowed fields: has_paid, role
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['admin', 'super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id }   = params
    const body     = await req.json()
    const allowed  = ['has_paid', 'role'] as const
    const updates: Record<string, unknown> = {}

    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
    }

    const { data, error } = await adminDb
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, email, has_paid, role')
      .single()

    if (error) throw error

    await audit(session, 'user.update', 'user', id, { updates }, req)

    return NextResponse.json({ success: true, user: data })
  } catch (error) {
    console.error('[admin/users/[id] PATCH]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/admin/users/[id] 
// super_admin only — deletes auth user which cascades to all tables
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(req, ['super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id } = params

    // Grab email before deletion for the audit log
    const { data: profile } = await adminDb
      .from('profiles')
      .select('email')
      .eq('id', id)
      .single()

    // Delete from auth.users — cascades to profiles and all related rows
    const { error } = await adminDb.auth.admin.deleteUser(id)
    if (error) throw error

    await audit(session, 'user.delete', 'user', id, { email: profile?.email }, req)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/users/[id] DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
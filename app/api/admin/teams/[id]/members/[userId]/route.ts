import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, isAdminSession, adminDb, audit } from '@/lib/admin'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  const session = await requireAdmin(req, ['admin', 'super_admin'])
  if (!isAdminSession(session)) return session

  try {
    const { id: teamId, userId } = params

    const { error } = await adminDb
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId)

    if (error) throw error

    await audit(
      session,
      'team.remove_member',
      'team',
      teamId,
      { removed_user_id: userId },
      req
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/teams/[id]/members/[userId] DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
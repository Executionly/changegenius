import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, isAdminSession } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req)
  if (!isAdminSession(session)) return session

  return NextResponse.json({
    id:       session.adminId,
    email:    session.email,
    fullName: session.fullName,
    role:     session.role,
  })
}
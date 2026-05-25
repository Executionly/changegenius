

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// ── Service role client 
export const adminDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── Role hierarchy 
export type AdminRole = 'super_admin' | 'admin' | 'support' | 'developer'

const ROLE_RANK: Record<AdminRole, number> = {
  super_admin: 4,
  admin:       3,
  support:     2,
  developer:   1,
}

export function roleAtLeast(role: AdminRole, minimum: AdminRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum]
}

// ── Admin session type ─
export interface AdminSession {
  adminId:    string
  userId:     string
  email:      string
  fullName:   string | null
  role:       AdminRole
}

// ── requireAdmin 
// Call at the top of every admin route handler.
// Verifies the bearer token, checks admin_users, enforces role.
// Returns AdminSession or a NextResponse error to return immediately.

export async function requireAdmin(
  req: NextRequest,
  allowedRoles: AdminRole[] = ['support', 'developer', 'admin', 'super_admin']
): Promise<AdminSession | NextResponse> {
  const authHeader = req.headers.get('authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify token against Supabase auth
  const { data: { user }, error: authError } = await adminDb.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin_users table
  const { data: adminUser, error: adminError } = await adminDb
    .from('admin_users')
    .select('id, email, full_name, role, is_active')
    .eq('user_id', user.id)
    .single()

  if (adminError || !adminUser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!adminUser.is_active) {
    return NextResponse.json({ error: 'Account deactivated' }, { status: 403 })
  }

  if (!allowedRoles.includes(adminUser.role as AdminRole)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // Update last_active (non-blocking)
  adminDb
    .from('admin_users')
    .update({ last_active: new Date().toISOString() })
    .eq('id', adminUser.id)
    .then(() => {})

  return {
    adminId:  adminUser.id,
    userId:   user.id,
    email:    adminUser.email,
    fullName: adminUser.full_name,
    role:     adminUser.role as AdminRole,
  }
}

// ── isAdminSession 
// Type guard to distinguish AdminSession from NextResponse
export function isAdminSession(
  result: AdminSession | NextResponse
): result is AdminSession {
  return 'adminId' in result
}

// ── audit 
// Log every admin write action. Call after the DB operation succeeds.
export async function audit(
  session:    AdminSession,
  action:     string,
  targetType: string | null,
  targetId:   string | null,
  metadata:   Record<string, unknown> = {},
  req?:       NextRequest
) {
  const ip = req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
             ?? req?.headers.get('x-real-ip')
             ?? null

  await adminDb.from('admin_audit_logs').insert({
    admin_id:    session.adminId,
    admin_email: session.email,
    action,
    target_type: targetType,
    target_id:   targetId,
    metadata,
    ip_address:  ip,
  })
}

// ── paginate 
// Parse page + limit from query params. Returns range for Supabase.
export function paginate(req: NextRequest, defaultLimit = 20) {
  const page  = Math.max(1, parseInt(req.nextUrl.searchParams.get('page')  ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') ?? String(defaultLimit))))
  const from  = (page - 1) * limit
  const to    = from + limit - 1
  return { page, limit, from, to }
}

// ── paginatedResponse 
export function paginatedResponse<T>(
  data:  T[],
  count: number,
  page:  number,
  limit: number
) {
  return NextResponse.json({
    data,
    meta: {
      total:       count,
      page,
      limit,
      total_pages: Math.ceil(count / limit),
    },
  })
}
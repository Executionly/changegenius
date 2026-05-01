import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { sendTeamInviteEmail } from '@/lib/email'

const schema = z.object({
  teamId: z.string().uuid(),
  emails: z.array(z.string().email()).min(1).max(20),
})

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (s) => s.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { teamId, emails } = parsed.data

  // Verify requester is team owner
  const { data: team } = await supabase
    .from('teams')
    .select('id, name, invite_code, owner_id')
    .eq('id', teamId)
    .eq('owner_id', session.user.id)
    .single()

  if (!team) return NextResponse.json({ error: 'Team not found or not owner' }, { status: 404 })

  // Get inviter's profile for email
  const { data: inviterProfile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', session.user.id)
    .single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const results: { email: string; status: 'sent' | 'already_member' | 'error'; error?: string }[] = []

  for (const email of emails) {
    try {
      // Check if user exists and is already a member
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (userProfile) {
        const { data: existingMember } = await supabase
          .from('team_members')
          .select('id')
          .eq('team_id', teamId)
          .eq('user_id', userProfile.id)
          .single()

        if (existingMember) {
          results.push({ email, status: 'already_member' })
          continue
        }
      }

      // Create invite record
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .insert({
          team_id: teamId,
          inviter_user_id: session.user.id,
          email,
        })
        .select('token')
        .single()

      if (inviteError || !invite) {
        console.error('[Invite] Database error:', inviteError)
        results.push({ 
          email, 
          status: 'error', 
          error: 'Failed to create invite record' 
        })
        continue
      }

      // Send email
      const inviteLink = `${appUrl}/join-team?token=${invite.token}`
      const emailResult = await sendTeamInviteEmail({
        to: email,
        invitedByName: inviterProfile?.name || inviterProfile?.email || 'Someone',
        invitedByEmail: inviterProfile?.email || session.user.email!,
        teamName: team.name,
        inviteLink,
      })

      if (!emailResult.success) {
        // Delete the invite record if email failed
        await supabase
          .from('invites')
          .delete()
          .eq('token', invite.token)

        results.push({ 
          email, 
          status: 'error', 
          error: emailResult.error || 'Failed to send email' 
        })
        continue
      }

      results.push({ email, status: 'sent' })

    } catch (error) {
      console.error(`[Invite] Unexpected error for ${email}:`, error)
      results.push({ 
        email, 
        status: 'error', 
        error: 'Unexpected error occurred' 
      })
    }
  }

  return NextResponse.json({
    inviteCode: team.invite_code,
    inviteLink: `${appUrl}/join-team?code=${team.invite_code}`,
    results,
  })
}

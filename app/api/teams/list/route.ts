import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
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

  const uid = session.user.id
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Teams owned by user
  const { data: owned } = await supabase
    .from('teams')
    .select(`
      id, name, organization, invite_code, created_at,
      team_members(id, status, assessment_status, user_id, profiles(full_name, email, change_genius_role, onboarded))
    `)
    .eq('owner_id', uid)
    .order('created_at', { ascending: false })

  const { data: memberOf } = await supabase
    .from('team_members')
    .select(`
      id, status, assessment_status, user_id,
      teams(
        id, name, organization, invite_code, created_at, owner_id,
        team_members(id, status, user_id, profiles(full_name, email, change_genius_role, onboarded))
      )
    `)
    .eq('user_id', uid)

  const enrichTeam = (team: any, isOwner: boolean) => {
    const members = (team.team_members as any[]) ?? []
    const completed = members.filter(m => m.assessment_status === 'completed').length
    const total     = members.length
    const member = members.find(m => m.user_id === uid)
    if(isOwner){
      // Owner sees all members
      return {
        ...team,
        owner_id: undefined,
        isOwner,
        memberCount: total,
        completedCount: completed,
        inviteLink: `${appUrl}/teams/join?code=${team.invite_code}`,
        unlocked: completed >= 3,
        fullUnlock: completed >= 5,
      }
    }else{
      return {
        name: team.name,
        id: team.id,
        created_at: team.created_at,
        organization: team.organization,
        owner_id: undefined,
        isOwner,
        memberCount: total,
        assessment: member?.assessment_status,
      }
    }
  }

  const enrichedOwned = (owned ?? []).map(team => enrichTeam(team, true))

  const ownedIds = new Set(enrichedOwned.map(t => t.id))

  const enrichedMemberOf = (memberOf ?? [])
    .map((m: any) => m.teams)
    .filter((team: any) => team && !ownedIds.has(team.id))
    .map((team: any) => enrichTeam(team, false))

  return NextResponse.json({
    owned:    enrichedOwned,
    memberOf: enrichedMemberOf,
  })
}

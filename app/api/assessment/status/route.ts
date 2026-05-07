import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (s) =>
          s.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: assessments } = await supabase
    .from("assessments")
    .select(`
      id, status, team_id, started_at, completed_at,
      teams(id, name)
    `)
    .eq("user_id", session.user.id)
    .order("started_at", { ascending: false });

  const all = (assessments ?? []).map((a: any) => ({
    id:          a.id,
    status:      a.status,
    startedAt:   a.started_at,
    completedAt: a.completed_at,
    isTeam:      !!a.team_id,
    team:        a.teams
      ? { id: a.teams.id, name: a.teams.name }
      : null,
  }))

  const inProgress = all.filter(a => a.status === 'in_progress')
  const completed  = all.filter(a => a.status === 'completed')

  const { data: teamMemberships } = await supabase
  .from("team_members")
  .select("team_id, status, teams(id, name)")
  .eq("user_id", session.user.id)

  // Find teams where member hasn't started an assessment yet
  const assessedTeamIds = new Set(
    (assessments ?? [])
      .filter((a: any) => a.team_id)
      .map((a: any) => a.team_id)
  )

  const notStarted = (teamMemberships ?? [])
    .filter((m: any) => m.teams && !assessedTeamIds.has(m.team_id) && m.status !== "completed")
    .map((m: any) => ({
      teamId:   m.teams.id,
      teamName: m.teams.name,
    }))

  return NextResponse.json({
    hasInProgress: inProgress.length > 0,
    inProgress,
    completed,
    all,
    teamNotStarted: notStarted
  });
}

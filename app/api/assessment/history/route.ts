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

  const { data: assessments, error } = await supabase
  .from("assessments")
  .select("id, completed_at")
  .eq("user_id", session.user.id)
  .eq("status", "completed")
  .order("completed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }

  const formatted = await Promise.all(
    (assessments ?? []).map(async (a) => {
      const { data: score } = await supabase
        .from("scores")
        .select("role_scores, stage_scores, energy_scores, derived")
        .eq("assessment_id", a.id)
        .single();

      return {
        id: a.id,
        completed_at: a.completed_at,
        role_scores:   score?.role_scores   ?? {},
        stage_scores:  score?.stage_scores  ?? {},
        energy_scores: score?.energy_scores ?? {},
        derived:       score?.derived       ?? {},
      };
    })
  );

  return NextResponse.json({ assessments: formatted });
}

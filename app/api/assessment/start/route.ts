import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
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

  const userId = session.user.id;
  const body = await req.json().catch(() => ({}));
  const teamId: string | null = body.teamId ?? null;

  // ── Team flow 
  if (teamId) {
    // Verify membership
    const { data: membership } = await supabase
      .from("team_members")
      .select("id, status")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 403 },
      );
    }

    // Already completed — no retakes for team assessments
    if (membership.status === "completed") {
      return NextResponse.json(
        { error: "You have already completed this team assessment." },
        { status: 409 },
      );
    }

    // Resume existing in_progress team assessment
    const { data: existing } = await supabase
      .from("assessments")
      .select("id, last_question_index")
      .eq("user_id", userId)
      .eq("team_id", teamId)
      .eq("status", "in_progress")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data: responses } = await supabase
        .from("responses")
        .select("question_id, value")
        .eq("assessment_id", existing.id);

      const answeredMap: Record<string, number> = {};
      for (const r of responses ?? []) answeredMap[r.question_id] = r.value;

      return NextResponse.json({
        assessmentId: existing.id,
        resuming: true,
        lastQuestionIndex: existing.last_question_index ?? 0,
        answeredResponses: answeredMap,
        teamId,
      });
    }

    // No existing — create fresh team assessment (no payment needed)
    const { data: newAssessment, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        team_id: teamId,
        version: "v1",
        status: "in_progress",
        last_question_index: 0,
      })
      .select("id")
      .single();

    if (error || !newAssessment) {
      console.error("[start] team assessment creation error:", error);
      return NextResponse.json(
        { error: "Could not start assessment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      assessmentId: newAssessment.id,
      resuming: false,
      lastQuestionIndex: 0,
      answeredResponses: {},
      teamId,
    });
  }

  // ── Personal flow: payment + fresh retake logic ──────────────
  const fresh = req.nextUrl.searchParams.get("fresh") === "true";

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_paid, onboarded")
    .eq("id", userId)
    .single();

  if (!profile?.has_paid) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  if (profile.onboarded === true && !fresh) {
    return NextResponse.json(
      {
        error: "You have already completed the assessment. Retake requires a new payment.",
        paymentRequired: true,
      },
      { status: 403 },
    );
  }

  if (fresh) {
    await supabase
      .from("assessments")
      .update({ status: "abandoned" })
      .eq("user_id", userId)
      .eq("status", "in_progress")
      .is("team_id", null);

    const { data: newAssessment, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        version: "v1",
        status: "in_progress",
        last_question_index: 0,
      })
      .select("id")
      .single();

    if (error || !newAssessment) {
      console.error("[start] fresh creation error:", error);
      return NextResponse.json(
        { error: "Could not start assessment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      assessmentId: newAssessment.id,
      resuming: false,
      lastQuestionIndex: 0,
      answeredResponses: {},
    });
  }

  // Resume or create personal assessment
  const { data: existing } = await supabase
    .from("assessments")
    .select("id, last_question_index")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .is("team_id", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { data: responses } = await supabase
      .from("responses")
      .select("question_id, value")
      .eq("assessment_id", existing.id);

    const answeredMap: Record<string, number> = {};
    for (const r of responses ?? []) answeredMap[r.question_id] = r.value;

    return NextResponse.json({
      assessmentId: existing.id,
      resuming: true,
      lastQuestionIndex: existing.last_question_index ?? 0,
      answeredResponses: answeredMap,
    });
  }

  const { data: newAssessment, error } = await supabase
    .from("assessments")
    .insert({
      user_id: userId,
      version: "v1",
      status: "in_progress",
      last_question_index: 0,
    })
    .select("id")
    .single();

  if (error || !newAssessment) {
    console.error("[start] creation error:", error);
    return NextResponse.json(
      { error: "Could not start assessment" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    assessmentId: newAssessment.id,
    resuming: false,
    lastQuestionIndex: 0,
    answeredResponses: {},
  });
}

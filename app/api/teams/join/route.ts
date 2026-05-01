import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const joinSchema = z
  .object({
    token: z.string().optional(),
    code: z.string().optional(),
    // Add registration fields for unauthenticated users
    full_name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  })
  .refine((d) => d.token || d.code, { message: "Provide token or code" });

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

  const body = await req.json();
  const parsed = joinSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { token, code, full_name, email, password } = parsed.data;

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // Handle registration for unauthenticated users
  if (!session && full_name && email && password) {
    try {
      // Build the redirect URL with the original invite token/code
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
      const redirectParams = new URLSearchParams();
      if (token) redirectParams.set('token', token);
      if (code) redirectParams.set('code', code);
      const emailRedirectTo = `${appUrl}/teams/join?${redirectParams.toString()}`;

      // Sign up the user WITH email confirmation but redirect back to team join
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
          },
          emailRedirectTo,
        },
      });

      if (authError) {
        console.error("[teams/join] Auth error:", authError);
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      if (!authData.user) {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
      }

      // Return success with indication that verification is needed
      return NextResponse.json({ 
        registered: true,
        needsVerification: true,
        message: "Please check your email to verify your account, then you'll be automatically added to the team."
      });

    } catch (error) {
      console.error("[teams/join] Registration error:", error);
      return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
  }

  // If no session and no registration data, return error
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const userId = session.user.id;

  // Validate invite/code and get team
  let teamId: string;

  if (token) {
    const { data: invite } = await supabase
      .from("invites")
      .select("id, team_id, email, status")
      .eq("token", token)
      .single();
    
    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invite link" },
        { status: 404 },
      );
    }
    
    if (invite.status === "accepted") {
      return NextResponse.json(
        { error: "Invite already used" },
        { status: 409 },
      );
    }
    
    teamId = invite.team_id;
    
    // Mark invite as accepted
    await supabase
      .from("invites")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invite.id);
  } else {
    const { data: team } = await supabase
      .from("teams")
      .select("id")
      .eq("invite_code", code!.toUpperCase())
      .single();
    
    if (!team) {
      return NextResponse.json(
        { error: "Invalid invite code" },
        { status: 404 },
      );
    }
    
    teamId = team.id;
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    return NextResponse.json({ teamId, alreadyMember: true });
  }

  // Add to team
  const { error: memberError } = await supabase.from("team_members").insert({
    team_id: teamId,
    user_id: userId,
    status: "joined",
    role: "member",
  });

  if (memberError) {
    console.error("[teams/join] member error:", memberError);
    return NextResponse.json({ error: "Could not join team" }, { status: 500 });
  }

  // Update user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("has_paid")
    .eq("id", userId)
    .single();

  if (!profile?.has_paid) {
    await supabase
      .from("profiles")
      .update({ has_paid: true })
      .eq("id", userId);
  }

  await supabase
    .from("profiles")
    .update({ role: "team_member" })
    .eq("id", userId)
    .in("role", ["individual", null]);

  return NextResponse.json({ 
    teamId, 
    joined: true
  });
}
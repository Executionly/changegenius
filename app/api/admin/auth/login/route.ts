import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminDb } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { data: authData, error: authError } =
      await anonClient.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const { data: adminUser, error: adminError } = await adminDb
      .from("admin_users")
      .select("id, email, full_name, role, is_active")
      .eq("user_id", authData.user.id)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!adminUser.is_active) {
      return NextResponse.json(
        { error: "Account deactivated" },
        { status: 403 },
      );
    }

    // Update last_active (non-blocking)
    adminDb
      .from("admin_users")
      .update({ last_active: new Date().toISOString() })
      .eq("id", adminUser.id)
      .then(() => {});

    const response = NextResponse.json({
      success: true,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.full_name,
        role: adminUser.role,
      },
    });

    // NOT httpOnly — client JS needs to read this to send Authorization headers
    response.cookies.set("admin_token", authData.session.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[admin/auth/login]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

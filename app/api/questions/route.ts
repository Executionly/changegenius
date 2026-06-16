import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const stage = searchParams.get('stage');
        const energy = searchParams.get('energy');
        const item_type = searchParams.get('item_type');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = supabase
        .from('questions')
        .select('*', { count: 'exact' })
        .order('order', { ascending: true });

        // filters
        if (role) query = query.eq('role', role);
        if (stage) query = query.eq('stage', stage);
        if (energy) query = query.eq('energy', energy);
        if (item_type) query = query.eq('item_type', item_type);

        // pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            questions: data,
            total: count,
            limit,
            offset
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
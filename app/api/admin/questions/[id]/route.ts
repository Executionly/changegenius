import { NextRequest, NextResponse } from 'next/server';
import { adminDb, isAdminSession, requireAdmin } from '@/lib/admin';
import { AdaptsStage, Energy, ItemType, Role } from '@/lib/assessment/questions';


export interface QuestionUpdateInput {
  text?: string;
  role?: Role;
  stage?: AdaptsStage;
  energy?: Energy;
  item_type?: ItemType;
  reverse?: boolean;
  order?: number;
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabaseAdmin = await requireAdmin(request, ['super_admin'])
    if (!isAdminSession(supabaseAdmin)) return supabaseAdmin
    try {
        const { id } = await params;
        const updates: QuestionUpdateInput = await request.json();

        // If updating order, check for conflicts
        if (updates.order !== undefined) {
        const { data: existingOrder } = await adminDb
            .from('questions')
            .select('id, order')
            .eq('order', updates.order)
            .single();

        if (existingOrder && existingOrder.id !== id) {
            return NextResponse.json(
            { error: 'Another question already has this order number' },
            { status: 409 }
            );
        }
        }

        const { data, error } = await adminDb
        .from('questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

        if (error) {
        if (error.code === 'PGRST116') {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabaseAdmin = await requireAdmin(request, ['super_admin'])
    if (!isAdminSession(supabaseAdmin)) return supabaseAdmin
    try {
        const { id } = await params;

        const { error } = await adminDb
        .from('questions')
        .delete()
        .eq('id', id);

        if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
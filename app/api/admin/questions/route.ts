

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, isAdminSession, requireAdmin } from '@/lib/admin';
import { AdaptsStage, Energy, ItemType, Role } from '@/lib/assessment/questions';

export interface QuestionCreateInput {
  id: string;
  text: string;
  role: Role;
  stage: AdaptsStage;
  energy: Energy;
  item_type: ItemType;
  reverse: boolean;
  order: number;
}

export interface QuestionUpdateInput {
  text?: string;
  role?: Role;
  stage?: AdaptsStage;
  energy?: Energy;
  item_type?: ItemType;
  reverse?: boolean;
  order?: number;
}

export async function GET(request: NextRequest) {
    const supabaseAdmin = await requireAdmin(request, ['super_admin'])
    if (!isAdminSession(supabaseAdmin)) return supabaseAdmin
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const stage = searchParams.get('stage');
        const energy = searchParams.get('energy');
        const item_type = searchParams.get('item_type');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = adminDb
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

export async function POST(request: NextRequest) {
    const supabaseAdmin = await requireAdmin(request, ['super_admin'])
    if (!isAdminSession(supabaseAdmin)) return supabaseAdmin
    try {
        const questionData: QuestionCreateInput = await request.json();

        // Validate required fields
        const requiredFields = ['id', 'text', 'role', 'stage', 'energy', 'item_type', 'order'];
        for (const field of requiredFields) {
        if (!questionData[field as keyof QuestionCreateInput]) {
            return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
            );
        }
        }

        // Check if ID already exists
        const { data: existing } = await adminDb
        .from('questions')
        .select('id')
        .eq('id', questionData.id)
        .single();

        if (existing) {
        return NextResponse.json(
            { error: 'Question with this ID already exists' },
            { status: 409 }
        );
        }

        // Check if order number already exists
        const { data: existingOrder } = await adminDb
        .from('questions')
        .select('order')
        .eq('order', questionData.order)
        .single();

        if (existingOrder) {
        return NextResponse.json(
            { error: 'Question with this order number already exists' },
            { status: 409 }
        );
        }

        const { data, error } = await adminDb
        .from('questions')
        .insert([questionData])
        .select()
        .single();

        if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


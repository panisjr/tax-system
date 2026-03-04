import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('taxpayers')
      .select('id, owner_name, tin')
      .order('owner_name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ taxpayers: data ?? [] });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load taxpayers.' },
      { status: 500 },
    );
  }
}

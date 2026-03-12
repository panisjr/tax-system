import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('barangays')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ barangays: data ?? [] });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load barangays.' },
      { status: 500 },
    );
  }
}
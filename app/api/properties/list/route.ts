import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select(
        'id, pin, street, lot_number, survey_number, latitude, longitude, barangay_id, barangays(id, name)',
      )
      .order('pin', { ascending: true })
      .limit(500);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ properties: data ?? [] });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load properties.' },
      { status: 500 },
    );
  }
}

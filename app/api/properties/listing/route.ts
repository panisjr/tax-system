import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tax_declarations')
      .select(`
        id,
        td_number,
        classification,
        land_area,
        total_market_value,
        land_assessment_level,
        total_assessed_value,
        status,
        taxpayers ( owner_name ),
        properties ( pin, barangays ( name ) )
      `)
      .order('id', { ascending: false })
      .limit(5000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ rows: data ?? [] });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load property listing.' },
      { status: 500 },
    );
  }
}

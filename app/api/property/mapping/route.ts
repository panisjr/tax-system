import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barangayId = searchParams.get('barangay_id');

  if (!barangayId) {
    return NextResponse.json({ error: 'barangay_id is required.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('tax_declarations')
      .select(`
        id,
        td_number,
        classification,
        land_area,
        total_market_value,
        total_assessed_value,
        taxpayers ( owner_name ),
        properties!inner ( barangay_id )
      `)
      .eq('properties.barangay_id', Number(barangayId))
      .eq('status', 'Active')
      .order('td_number', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ properties: data ?? [] });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load properties for this barangay.' },
      { status: 500 },
    );
  }
}
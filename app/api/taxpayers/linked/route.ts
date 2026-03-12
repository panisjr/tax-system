import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * GET /api/taxpayers/linked?id=<taxpayer_id>
 *
 * Returns the taxpayer profile and all their linked tax declarations
 * with joined property and barangay data.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const [taxpayerResult, declsResult] = await Promise.all([
      supabaseAdmin
        .from('taxpayers')
        .select(
          'id, owner_name, first_name, middle_name, last_name, suffix, tin, address, owner_type, phone, email',
        )
        .eq('id', id)
        .single(),

      supabaseAdmin
        .from('tax_declarations')
        .select(
          `id, td_number, classification, land_area,
           total_market_value, total_assessed_value, status, effectivity_year,
           properties(
             id, pin, street, lot_number, survey_number,
             latitude, longitude, barangay_id,
             barangays(id, name)
           )`,
        )
        .eq('taxpayer_id', id)
        .order('td_number', { ascending: true }),
    ]);

    if (taxpayerResult.error) {
      return NextResponse.json(
        { error: taxpayerResult.error.message },
        { status: 400 },
      );
    }
    if (declsResult.error) {
      return NextResponse.json(
        { error: declsResult.error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      taxpayer: taxpayerResult.data,
      declarations: declsResult.data ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load linked data.' },
      { status: 500 },
    );
  }
}

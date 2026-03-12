import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * GET /api/properties/linked?id=<property_id>
 *
 * Returns the property record and all linked tax declarations
 * with taxpayer info joined.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const [propertyResult, declsResult] = await Promise.all([
      supabaseAdmin
        .from('properties')
        .select(
          'id, pin, street, lot_number, survey_number, latitude, longitude, barangay_id, barangays(id, name)',
        )
        .eq('id', id)
        .single(),

      supabaseAdmin
        .from('tax_declarations')
        .select(
          `id, td_number, classification, land_area,
           total_market_value, total_assessed_value, status, effectivity_year,
           taxpayers(
             id, owner_name, tin, address, owner_type, phone, email
           )`,
        )
        .eq('property_id', id)
        .order('td_number', { ascending: true }),
    ]);

    if (propertyResult.error) {
      return NextResponse.json(
        { error: propertyResult.error.message },
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
      property: propertyResult.data,
      declarations: declsResult.data ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load linked data.' },
      { status: 500 },
    );
  }
}

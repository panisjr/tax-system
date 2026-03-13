import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * GET /api/tax-declarations/by-number?td_number=TD-2024-0001
 *
 * Returns a single tax_declaration row with all joins needed by
 * TaxDeclarationPrint (taxpayers, properties → barangays, buildings).
 *
 * Supabase join shape matches TaxDeclarationData in:
 *   components/print/TaxDeclarationPrint.tsx
 */
export async function GET(req: NextRequest) {
  const tdNumber = req.nextUrl.searchParams.get('td_number')?.trim();

  if (!tdNumber) {
    return NextResponse.json(
      { error: 'Missing required query param: td_number' },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('tax_declarations')
      .select(`
        *,
        taxpayers (
          id, owner_name, first_name, middle_name, last_name, suffix,
          tin, address, owner_type, phone, email
        ),
        properties (
          id, pin, municipality, province,
          street, lot_number, block_number, survey_number,
          barangays (
            id, name, municipality, province
          )
        ),
        buildings (
          id, td_id, kind_of_building, structural_type,
          floor_area, year_built, age_years, condition,
          market_value, assessment_level, assessed_value,
          created_at
        )
      `)
      .eq('td_number', tdNumber)
      .single();

    if (error) {
      // PGRST116 = no rows found
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: `No tax declaration found with TD Number "${tdNumber}".` },
          { status: 404 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ td: data });
  } catch {
    return NextResponse.json(
      { error: 'Unable to fetch tax declaration.' },
      { status: 500 },
    );
  }
}

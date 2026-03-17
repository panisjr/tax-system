import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type BarangayRecord = { name: string };

type TaxpayerRow = {
  id: number | string;
  owner_name: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  tin: string | null;
  owner_type: string | null;
  phone: string | null;
  email: string | null;
  address_details: string | null;
  barangay_id: number | null;
  barangays: BarangayRecord | BarangayRecord[] | null;
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('taxpayers')
      .select(
        'id, owner_name, first_name, middle_name, last_name, suffix, tin, owner_type, phone, email, address_details, barangay_id, barangays(name)',
      )
      .order('owner_name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const mapped = ((data ?? []) as TaxpayerRow[]).map((row) => {
      const barangayRecord = Array.isArray(row.barangays)
        ? row.barangays[0]
        : row.barangays;
      const barangayName = barangayRecord?.name?.trim() || '';
      const addressDetails = row.address_details?.trim() || '';

      return {
        ...row,
        address: [addressDetails, barangayName].filter(Boolean).join(', ') || null,
      };
    });

    return NextResponse.json({ taxpayers: mapped });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load taxpayers.' },
      { status: 500 },
    );
  }
}

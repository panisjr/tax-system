import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const ALLOWED_OWNER_TYPES = ['Individual', 'Corporation', 'Government'] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      first_name,
      middle_name,
      last_name,
      suffix,
      tin,
      owner_type,
      address,
      phone,
      email,
    } = body as {
      first_name: string;
      middle_name?: string;
      last_name: string;
      suffix?: string;
      tin?: string;
      owner_type: string;
      address: string;
      phone?: string;
      email?: string;
    };

    if (!first_name?.trim() || !last_name?.trim() || !owner_type?.trim() || !address?.trim()) {
      return NextResponse.json(
        { error: 'First name, last name, owner type, and address are required.' },
        { status: 400 },
      );
    }

    // Keep compatibility with older payloads that still send "Corporate".
    const normalizedOwnerType = owner_type.trim() === 'Corporate'
      ? 'Corporation'
      : owner_type.trim();

    if (!ALLOWED_OWNER_TYPES.includes(normalizedOwnerType as (typeof ALLOWED_OWNER_TYPES)[number])) {
      return NextResponse.json(
        { error: 'Invalid owner type.' },
        { status: 400 },
      );
    }

    const owner_name = [first_name, middle_name, last_name, suffix]
      .map((v) => v?.trim() ?? '')
      .filter(Boolean)
      .join(' ');

    const { data, error } = await supabaseAdmin
      .from('taxpayers')
      .insert({
        owner_name,
        first_name: first_name.trim(),
        middle_name: middle_name?.trim() || null,
        last_name: last_name.trim(),
        suffix: suffix?.trim() || null,
        tin: tin?.trim() || null,
        owner_type: normalizedOwnerType,
        address: address.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
      })
      .select('id, owner_name')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Taxpayer registered successfully.', taxpayer: data },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to register taxpayer.' },
      { status: 500 },
    );
  }
}

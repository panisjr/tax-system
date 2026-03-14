import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type UpdateTaxpayerPayload = {
  id: number | string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  owner_name?: string;
  tin?: string;
  owner_type: string;
  address: string;
  phone?: string;
  email?: string;
};

const ALLOWED_OWNER_TYPES = ['Individual', 'Corporate', 'Corporation', 'Government'] as const;

const TIN_PATTERN = /^\d{3}-\d{3}-\d{3}(-\d{3})?$/;
const PHONE_PATTERN = /^[1-9]\d{2} \d{3} \d{4}$/;
const EMAIL_PATTERN = /^.+@.+\..+$/;

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<UpdateTaxpayerPayload>;

    const rawId = body.id;
    const id = typeof rawId === 'string' ? rawId.trim() : rawId;
    const firstName = body.first_name?.trim() ?? '';
    const middleName = body.middle_name?.trim() ?? '';
    const lastName = body.last_name?.trim() ?? '';
    const suffix = body.suffix?.trim() ?? '';
    const ownerType = body.owner_type?.trim() ?? '';
    const address = body.address?.trim() ?? '';
    const tin = body.tin?.trim() ?? '';
    const phone = body.phone?.trim() ?? '';
    const email = body.email?.trim() ?? '';

    const hasInvalidId =
      (typeof id !== 'string' && typeof id !== 'number') ||
      (typeof id === 'string' && id.length === 0) ||
      (typeof id === 'number' && !Number.isFinite(id));

    if (hasInvalidId) {
      return NextResponse.json({ error: 'Taxpayer ID is required.' }, { status: 400 });
    }

    if (!firstName || !lastName || !ownerType || !address) {
      return NextResponse.json(
        { error: 'First name, last name, owner type, and address are required.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_OWNER_TYPES.includes(ownerType as (typeof ALLOWED_OWNER_TYPES)[number])) {
      return NextResponse.json({ error: 'Invalid owner type.' }, { status: 400 });
    }

    if (tin && !TIN_PATTERN.test(tin)) {
      return NextResponse.json({ error: 'Invalid TIN format.' }, { status: 400 });
    }

    if (phone && !PHONE_PATTERN.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone format.' }, { status: 400 });
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // Keep compatibility with existing values and create endpoint normalization.
    const normalizedOwnerType = ownerType === 'Corporate' ? 'Corporation' : ownerType;
    const ownerName = [firstName, middleName, lastName, suffix]
      .filter(Boolean)
      .join(' ');

    const { data, error } = await supabaseAdmin
      .from('taxpayers')
      .update({
        owner_name: ownerName,
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        suffix: suffix || null,
        tin: tin || null,
        owner_type: normalizedOwnerType,
        address,
        phone: phone || null,
        email: email || null,
      })
      .eq('id', id)
      .select('id, owner_name, first_name, middle_name, last_name, suffix, tin, address, owner_type, phone, email')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Taxpayer updated successfully.', taxpayer: data });
  } catch {
    return NextResponse.json({ error: 'Unable to update taxpayer.' }, { status: 500 });
  }
}

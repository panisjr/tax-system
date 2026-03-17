import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type DeleteTaxpayerPayload = {
  id: number | string;
};

export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<DeleteTaxpayerPayload>;

    const rawId = body.id;
    const id = typeof rawId === 'string' ? rawId.trim() : rawId;

    const hasInvalidId =
      (typeof id !== 'string' && typeof id !== 'number') ||
      (typeof id === 'string' && id.length === 0) ||
      (typeof id === 'number' && !Number.isFinite(id));

    if (hasInvalidId) {
      return NextResponse.json({ error: 'Taxpayer ID is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('taxpayers')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Taxpayer deleted successfully.' });
  } catch {
    return NextResponse.json({ error: 'Unable to delete taxpayer.' }, { status: 500 });
  }
}

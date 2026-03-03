import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { empID?: string; email?: string };

    const empID = typeof body.empID === 'string' ? body.empID.trim() : '';

    if (!empID) {
      return NextResponse.json({ error: 'empID is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('empID', empID);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch {
    return NextResponse.json({ error: 'Unable to process request.' }, { status: 500 });
  }
}

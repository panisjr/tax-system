import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const roleId = url.searchParams.get('roleId');
    if (!roleId) {
      return NextResponse.json({ error: 'roleId query parameter is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', roleId as string);

    if (error) {
      return NextResponse.json({ permission_ids: [], error: error.message }, { status: 400 });
    }

    const ids = (data ?? []).map((r: any) => r.permission_id).filter(Boolean);
    return NextResponse.json({ permission_ids: ids });
  } catch {
    return NextResponse.json({ permission_ids: [], error: 'Unable to load permissions.' }, { status: 500 });
  }
}
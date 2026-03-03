import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from('roles')
			.select('id, name, permission_id, created_at, permissions(id, name, created_at)')
			.order('name', { ascending: true });

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ roles: data ?? [] });
	} catch {
		return NextResponse.json(
			{ error: 'Unable to load roles.' },
			{ status: 500 },
		);
	}
}

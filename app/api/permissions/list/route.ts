import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from('permissions')
			.select('id, name, created_at')
			.order('name', { ascending: true });

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ permissions: data ?? [] });
	} catch {
		return NextResponse.json(
			{ error: 'Unable to load permissions.' },
			{ status: 500 },
		);
	}
}

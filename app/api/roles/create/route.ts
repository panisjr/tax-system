import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type CreateRolePayload = {
	name: string;
	permission_id: number;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<CreateRolePayload>;
		const name = body.name?.trim() ?? '';
		const permissionId = Number(body.permission_id);

		if (!name) {
			return NextResponse.json({ error: 'name is required.' }, { status: 400 });
		}

		if (!Number.isInteger(permissionId) || permissionId <= 0) {
			return NextResponse.json(
				{ error: 'permission_id is required.' },
				{ status: 400 },
			);
		}

		const { data: permission, error: permissionError } = await supabaseAdmin
			.from('permissions')
			.select('id')
			.eq('id', permissionId)
			.single();

		if (permissionError || !permission) {
			return NextResponse.json(
				{ error: 'Selected permission is invalid.' },
				{ status: 400 },
			);
		}

		const payload = {
			name,
			permission_id: permissionId,
		};

		const { data, error } = await supabaseAdmin
			.from('roles')
			.insert(payload)
			.select('*')
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ message: 'Role created successfully.', role: data });
	} catch {
		return NextResponse.json(
			{ error: 'Unable to process request.' },
			{ status: 500 },
		);
	}
}

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type UpdateUserPayload = {
	originalEmpID: string;
	empID: string;
	username: string;
	firstname: string;
	middlename: string;
	lastname: string;
	suffix: string;
	birthdate: string;
	age: string;
	sex: boolean;
	email: string;
	phone: string;
	role_id: number;
	department: string;
	position: string;
	status: boolean;
};

function isMissingText(value: unknown) {
	return typeof value !== 'string' || value.trim().length === 0;
}

function isValidBirthdate(value: string) {
	return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function PUT(request: Request) {
	try {
		const body = (await request.json()) as Partial<UpdateUserPayload>;
		const roleId = Number(body.role_id);
		const normalizedUsername =
			body.username?.trim() || body.empID?.trim() || '';

		const requiredTextFields: Array<keyof UpdateUserPayload> = [
			'originalEmpID',
			'empID',
			'firstname',
			'lastname',
			'birthdate',
			'age',
			'email',
			'phone',
			'department',
			'position',
		];

		for (const field of requiredTextFields) {
			if (isMissingText(body[field])) {
				return NextResponse.json(
					{ error: `${field} is required.` },
					{ status: 400 },
				);
			}
		}

		if (typeof body.sex !== 'boolean') {
			return NextResponse.json({ error: 'sex is required.' }, { status: 400 });
		}

		if (typeof body.status !== 'boolean') {
			return NextResponse.json({ error: 'status is required.' }, { status: 400 });
		}

		if (!Number.isInteger(roleId) || roleId <= 0) {
			return NextResponse.json({ error: 'role_id is required.' }, { status: 400 });
		}

		const { data: roleData, error: roleError } = await supabaseAdmin
			.from('roles')
			.select('id')
			.eq('id', roleId)
			.single();

		if (roleError || !roleData) {
			return NextResponse.json({ error: 'Selected role is invalid.' }, { status: 400 });
		}

		if (!isValidBirthdate(body.birthdate!)) {
			return NextResponse.json(
				{ error: 'birthdate must be in yyyy-mm-dd format.' },
				{ status: 400 },
			);
		}

		const { data: existingUser, error: existingError } = await supabaseAdmin
			.from('users')
			.select('empID')
			.eq('empID', body.originalEmpID!.trim())
			.single();

		if (existingError || !existingUser) {
			return NextResponse.json({ error: 'User not found.' }, { status: 404 });
		}

		const { error: updateError } = await supabaseAdmin
			.from('users')
			.update({
				empID: body.empID!.trim(),
				username: normalizedUsername,
				firstname: body.firstname!.trim(),
				middlename: body.middlename?.trim() || '',
				lastname: body.lastname!.trim(),
				suffix: body.suffix?.trim() || '',
				birthdate: body.birthdate!.trim(),
				age: body.age!.trim(),
				sex: body.sex,
				email: body.email!.trim(),
				phone: body.phone!.trim(),
				role_id: roleId,
				department: body.department!.trim(),
				position: body.position!.trim(),
				status: body.status,
			})
			.eq('empID', body.originalEmpID!.trim());

		if (updateError) {
			return NextResponse.json({ error: updateError.message }, { status: 400 });
		}

		return NextResponse.json({
			message: 'User updated successfully.',
		});
	} catch {
		return NextResponse.json(
			{ error: 'Unable to process request.' },
			{ status: 500 },
		);
	}
}

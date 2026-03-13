import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type CreateUserPayload = {
	empID: string;
	firstname: string;
	middlename: string;
	lastname: string;
	suffix: string;
	birthdate: string;
	age: string;
	sex: boolean;
	temp_pass: string;
	password: string;
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

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<CreateUserPayload>;
		const roleId = Number(body.role_id);

		const requiredTextFields: Array<keyof CreateUserPayload> = [
			'empID',
			'firstname',
			'lastname',
			'birthdate',
			'age',
			'temp_pass',
			'password',
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
			.select('id, name')
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

		// Backend duplicate check for empID and email
		const empID = body.empID!.trim();
		const email = body.email!.trim();

		const { data: existingEmpID } = await supabaseAdmin
			.from('users')
			.select('empID')
			.eq('empID', empID)
			.maybeSingle();

		if (existingEmpID) {
			return NextResponse.json(
				{ error: 'Employee ID already exists.' },
				{ status: 409 }
			);
		}

		const { data: existingEmailUser, error: emailError } = await supabaseAdmin
			.from('users')
			.select('email')
			.eq('email', email)
			.maybeSingle();

		if (existingEmailUser) {
			return NextResponse.json(
				{ error: 'Email already registered.' },
				{ status: 409 }
			);
		}

		if (body.temp_pass !== body.password) {
			return NextResponse.json(
				{ error: 'temp_pass and password must match.' },
				{ status: 400 },
			);
		}

		const { data, error } = await supabaseAdmin.auth.admin.createUser({
			email: body.email!.trim(),
			password: body.temp_pass!,
			email_confirm: true,
			user_metadata: {
				empID: body.empID!.trim(),
				firstname: body.firstname!.trim(),
				middlename: body.middlename?.trim() || '',
				lastname: body.lastname!.trim(),
				suffix: body.suffix?.trim() || '',
				birthdate: body.birthdate!.trim(),
				age: body.age!.trim(),
				sex: body.sex,
				phone: body.phone!.trim(),
				role_id: roleId,
				role: roleData.name,
				department: body.department!.trim(),
				position: body.position!.trim(),
				status: body.status,
			},
		});

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		const authUserId = data.user?.id;

		if (!authUserId) {
			return NextResponse.json(
				{ error: 'Auth user creation returned no user id.' },
				{ status: 500 },
			);
		}

		const { error: insertError } = await supabaseAdmin.from('users').insert({
			empID: body.empID!.trim(),
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
		});

		if (insertError) {
			await supabaseAdmin.auth.admin.deleteUser(authUserId);
			return NextResponse.json({ error: insertError.message }, { status: 400 });
		}

		return NextResponse.json({
			message: 'User created successfully.',
			userId: authUserId,
		});
	} catch {
		return NextResponse.json(
			{ error: 'Unable to process request.' },
			{ status: 500 },
		);
	}
}

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
	role: string;
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
			'role',
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

		if (!isValidBirthdate(body.birthdate!)) {
			return NextResponse.json(
				{ error: 'birthdate must be in yyyy-mm-dd format.' },
				{ status: 400 },
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
				role: body.role!.trim(),
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
			role: body.role!.trim(),
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

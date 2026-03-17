import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tax_session');

  if (!sessionCookie?.value) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    cookieStore.delete('tax_session');
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
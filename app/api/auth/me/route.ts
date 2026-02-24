import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/server/session';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('birthday_session')?.value;

  if (!token) return NextResponse.json({ profile: null });

  const payload = verifySessionToken(token);
  if (!payload) return NextResponse.json({ profile: null });

  return NextResponse.json({ profile: payload });
}

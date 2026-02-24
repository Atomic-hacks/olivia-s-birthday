import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/server/session';
import { getProfile, updateProfileData } from '@/lib/server/profiles';
import { emptyBirthdayData } from '@/lib/birthday-data';

function readSession(token?: string) {
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET() {
  try {
    const token = (await cookies()).get('birthday_session')?.value;
    const session = readSession(token);

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await getProfile(session.profileId);
    if (!profile) return NextResponse.json({ data: emptyBirthdayData });

    return NextResponse.json({ data: profile.data || emptyBirthdayData });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load data.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get('birthday_session')?.value;
    const session = readSession(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = (await req.json()) as { data?: unknown };
    if (!body.data || typeof body.data !== 'object') {
      return NextResponse.json({ error: 'Invalid data payload.' }, { status: 400 });
    }

    const updated = await updateProfileData(session.profileId, body.data as typeof emptyBirthdayData);
    return NextResponse.json({ data: updated?.data || body.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save data.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

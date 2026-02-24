import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createProfileId, createSessionToken } from '@/lib/server/session';
import { getProfile, upsertProfile } from '@/lib/server/profiles';
import { env, hasSupabaseEnv } from '@/lib/server/env';

export async function POST(req: Request) {
  try {
    if (!hasSupabaseEnv || !env.sessionSecret) {
      return NextResponse.json(
        { error: 'Missing server env. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_SESSION_SECRET.' },
        { status: 500 },
      );
    }

    const body = (await req.json()) as { name?: string; birthday?: string };
    const name = (body.name || '').trim();
    const birthday = (body.birthday || '').trim();
    const birthdayIsoPattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!name || !birthday) {
      return NextResponse.json({ error: 'Name and birthday are required.' }, { status: 400 });
    }
    if (!birthdayIsoPattern.test(birthday)) {
      return NextResponse.json({ error: 'Birthday must be in YYYY-MM-DD format.' }, { status: 400 });
    }

    const profileId = createProfileId(name, birthday);
    let profile = await getProfile(profileId);

    if (!profile) {
      profile = await upsertProfile({ profileId, name, birthday });
    }
    if (!profile) {
      throw new Error(
        'Profile creation failed. Ensure Supabase table "birthday_profiles" exists (run supabase/schema.sql).',
      );
    }

    const token = createSessionToken({ profileId, name: profile.name, birthday: profile.birthday });

    const cookieStore = await cookies();
    cookieStore.set('birthday_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ profile: { name: profile.name, birthday: profile.birthday, profileId: profile.profile_id } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected login error.';
    console.error('[auth/login] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

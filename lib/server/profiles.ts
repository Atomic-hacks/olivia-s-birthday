import { hasSupabaseEnv, env } from './env';
import { BirthdayData, emptyBirthdayData } from '../birthday-data';

interface ProfileRow {
  profile_id: string;
  name: string;
  birthday: string;
  data: BirthdayData;
}

async function supabaseRequest(path: string, init?: RequestInit) {
  if (!hasSupabaseEnv) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  }

  const res = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error (${res.status}): ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function getProfile(profileId: string) {
  const rows = (await supabaseRequest(
    `birthday_profiles?profile_id=eq.${profileId}&select=profile_id,name,birthday,data&limit=1`,
  )) as ProfileRow[];

  return rows[0] ?? null;
}

export async function upsertProfile(params: { profileId: string; name: string; birthday: string; data?: BirthdayData }) {
  const body = [
    {
      profile_id: params.profileId,
      name: params.name,
      birthday: params.birthday,
      data: params.data || emptyBirthdayData,
    },
  ];

  const rows = (await supabaseRequest('birthday_profiles?on_conflict=profile_id', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(body),
  })) as ProfileRow[];

  return rows[0];
}

export async function updateProfileData(profileId: string, data: BirthdayData) {
  const rows = (await supabaseRequest(`birthday_profiles?profile_id=eq.${profileId}`, {
    method: 'PATCH',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ data }),
  })) as ProfileRow[];

  return rows[0] ?? null;
}

import crypto from 'crypto';
import { env } from './env';

const encoder = new TextEncoder();

function toBase64Url(input: string | Uint8Array) {
  const value = typeof input === 'string' ? Buffer.from(input) : Buffer.from(input);
  return value.toString('base64url');
}

function fromBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function sign(input: string) {
  return crypto.createHmac('sha256', env.sessionSecret).update(encoder.encode(input)).digest('base64url');
}

export interface SessionPayload {
  profileId: string;
  name: string;
  birthday: string;
}

export function createProfileId(name: string, birthday: string) {
  const normalized = `${name.trim().toLowerCase()}|${birthday}`;
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 32);
}

export function createSessionToken(payload: SessionPayload) {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !env.sessionSecret) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = sign(body);
  if (signature !== expected) return null;

  try {
    return JSON.parse(fromBase64Url(body)) as SessionPayload;
  } catch {
    return null;
  }
}

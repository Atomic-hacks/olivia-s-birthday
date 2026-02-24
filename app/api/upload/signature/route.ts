import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { env, hasCloudinaryEnv } from '@/lib/server/env';

export async function POST(req: Request) {
  try {
    if (!hasCloudinaryEnv) {
      return NextResponse.json(
        { error: 'Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.' },
        { status: 500 },
      );
    }

    const body = (await req.json()) as { folder?: string; resourceType?: 'image' | 'video' | 'auto' };
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = body.folder || 'olivia-birthday';

    const signatureBase = `folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    return NextResponse.json({
      timestamp,
      folder,
      signature,
      apiKey: env.cloudinaryApiKey,
      cloudName: env.cloudinaryCloudName,
      resourceType: body.resourceType || 'auto',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create upload signature.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

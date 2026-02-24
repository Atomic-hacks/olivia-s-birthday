## Olivia Birthday App (Cloud Sync + GSAP)

This app now includes:
- GSAP-based reveal/section animations
- Simple auth: `name + birthday`
- Cross-device persistence via Supabase
- Image + video uploads via Cloudinary
- Birthday-focused features (wishlist + day vibe planner)

## 1) Install

```bash
npm install
npm run dev
```

## 2) Environment Variables

Create `.env.local`:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_SESSION_SECRET=some-long-random-secret

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 3) Supabase Table Setup

Run SQL from:

`supabase/schema.sql`

This creates `birthday_profiles` used for cloud sync.

## Notes

- Yes, you need Cloudinary envs for media upload in this implementation.
- Data is saved server-side (Supabase) and mirrored to local backup (`localStorage`) for resilience.
- Auth is intentionally simple (name + birthday) and not meant for high-security usage.

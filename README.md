# Watch Party

A private Next.js watch-party application with LiveKit video, screen sharing, Supabase authentication/storage, real-time chat, and room moderation.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Create a Supabase project and LiveKit Cloud project
4. Add the environment values
5. Run `npm run dev`

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

## Supabase schema

Create a `room_files` table with columns:

- `id` UUID primary key
- `room_id` text
- `name` text
- `path` text
- `size` bigint
- `owner_id` text
- `created_at` timestamptz

Create a public or signed `room-files` Storage bucket and enforce the 100 MB limit.

# Watch Party

A Next.js watch-party MVP with real-time video/audio and screen sharing powered by LiveKit, plus room-scoped file sharing via Supabase Storage. LiveKit's `VideoConference` provides participant video, microphone/camera controls, screen sharing, and built-in chat.

## Run locally

1. Install Node.js 20+.
2. Install packages: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values below.
4. Configure the Supabase Storage bucket as described below.
5. Start with `npm run dev`, then open `http://localhost:3000`.
6. Check the code with `npm run lint` and `npm run build`.

## Environment variables

Set these in `.env.local` and in Vercel Project Settings. Never expose server secrets in `NEXT_PUBLIC_` variables.

- `LIVEKIT_URL` — LiveKit Cloud websocket URL (`wss://...`)
- `LIVEKIT_API_KEY` — LiveKit API key
- `LIVEKIT_API_SECRET` — LiveKit API secret (server only)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key (server only)

## Supabase Storage

Create a **private** bucket named `room-files` in the Supabase dashboard. Set the bucket's file size limit to 100 MB. The server route uses the service-role key to upload, list, and mint one-hour signed download links. No public bucket or client-side service key is needed.

## Features and limitations

- Create/join rooms with an unguessable UUID invite URL.
- Real-time video, audio, screen sharing, and built-in room chat via LiveKit.
- Room-scoped files up to 100 MB with private storage and expiring download links.
- The room link is the invitation: anyone who has it can join and access files. Do not post it publicly. This MVP does not yet include user accounts, password-protected rooms, persistent account-based roles, or host moderation. Add authentication and server-side authorization before using it for sensitive content.
- Only share media you have rights to share. DRM-protected streaming services may block screen capture.

## Deploy to Vercel

Import the GitHub repository and select the `feature/watch-party-mvp` branch. Add all environment variables above, deploy, and configure the private Supabase bucket. Vercel's request body limits may prevent uploads near 100 MB on some plans; for reliable large uploads, switch to Supabase signed direct uploads rather than proxying the file through a serverless function.

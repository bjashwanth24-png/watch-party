import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const room = typeof body.room === "string" ? body.room : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 40) : "";
    if (!/^[a-zA-Z0-9_-]{3,64}$/.test(room) || !name) {
      return NextResponse.json({ error: "A valid room and display name are required." }, { status: 400 });
    }
    const serverUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    if (!serverUrl || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "LiveKit is not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET to your server environment." }, { status: 503 });
    }
    const identity = `${name}-${crypto.randomUUID().slice(0, 8)}`;
    const token = new AccessToken(apiKey, apiSecret, { identity, name, ttl: "2h" });
    token.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true });
    return NextResponse.json({ token: await token.toJwt(), serverUrl });
  } catch {
    return NextResponse.json({ error: "Unable to create a room token." }, { status: 400 });
  }
}

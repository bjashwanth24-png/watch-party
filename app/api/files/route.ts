import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
const BUCKET = "room-files";
const LIMIT = 100 * 1024 * 1024;

function validRoom(value: string | null): value is string {
  return Boolean(value && /^[a-zA-Z0-9_-]{3,64}$/.test(value));
}
function storage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } }).storage.from(BUCKET);
}

export async function GET(request: Request) {
  const roomId = new URL(request.url).searchParams.get("roomId");
  if (!validRoom(roomId)) return NextResponse.json({ error: "Invalid room." }, { status: 400 });
  try {
    const bucket = storage();
    const { data, error } = await bucket.list(roomId, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) throw error;
    const files = await Promise.all((data ?? []).filter((item) => item.name && !item.name.startsWith("." )).map(async (item) => {
      const path = `${roomId}/${item.name}`;
      const { data: signed, error: signedError } = await bucket.createSignedUrl(path, 60 * 60);
      if (signedError || !signed) return null;
      return { name: item.metadata?.originalName || item.name, size: Number(item.metadata?.size ?? 0), url: signed.signedUrl, createdAt: item.created_at };
    }));
    return NextResponse.json({ files: files.filter(Boolean) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not list files." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const roomId = form.get("roomId");
    const file = form.get("file");
    if (typeof roomId !== "string" || !validRoom(roomId) || !(file instanceof File)) {
      return NextResponse.json({ error: "A valid room and file are required." }, { status: 400 });
    }
    if (file.size === 0 || file.size > LIMIT) return NextResponse.json({ error: "Files must be between 1 byte and 100 MB." }, { status: 413 });
    const originalName = file.name.replace(/[\\/\u0000-\u001f]/g, "_").slice(0, 180) || "shared-file";
    const safeName = `${crypto.randomUUID()}-${originalName}`;
    const bucket = storage();
    const { error } = await bucket.upload(`${roomId}/${safeName}`, file, {
      contentType: file.type || "application/octet-stream", upsert: false,
      metadata: { originalName, size: file.size }
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 503 });
  }
}

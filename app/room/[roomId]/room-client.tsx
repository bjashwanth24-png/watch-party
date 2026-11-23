"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

type RoomCredentials = { token: string; serverUrl: string };
type SharedFile = { name: string; size: number; url: string; createdAt?: string };

export default function RoomClient({ roomId }: { roomId: string }) {
  const [name, setName] = useState("");
  const [credentials, setCredentials] = useState<RoomCredentials | null>(null);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [busy, setBusy] = useState(false);

  async function loadFiles() {
    try {
      const response = await fetch(`/api/files?roomId=${encodeURIComponent(roomId)}`);
      const data = await response.json();
      if (response.ok) setFiles(data.files ?? []);
    } catch { /* Files remain usable even if storage is not configured. */ }
  }

  useEffect(() => { void loadFiles(); }, [roomId]);

  async function join(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/livekit/token", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: roomId, name: name.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not join this room.");
      setCredentials(data);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not join this room."); }
  }

  async function shareFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) { setError("Files must be 100 MB or smaller."); return; }
    setBusy(true); setError("");
    const form = new FormData(); form.set("file", file); form.set("roomId", roomId);
    try {
      const response = await fetch("/api/files", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      await loadFiles();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Upload failed."); }
    finally { setBusy(false); }
  }

  if (!credentials) return (
    <main className="room-entry">
      <a className="brand" href="/">Watch<span>Party</span></a>
      <form className="entry-card" onSubmit={join}>
        <p className="eyebrow">ROOM · {roomId.slice(0, 8)}</p>
        <h1>Join the party</h1>
        <p>Choose a name your friends will recognize.</p>
        <input autoFocus required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" />
        {error && <p className="error">{error}</p>}
        <button className="primary" type="submit">Join room</button>
        <small>By joining, your camera and microphone will be off until you turn them on.</small>
      </form>
    </main>
  );

  return (
    <main className="live-room">
      <header className="room-topbar"><a className="brand" href="/">Watch<span>Party</span></a><span>Room <b>{roomId.slice(0, 8)}</b></span><button className="copy-link" onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy invite link</button></header>
      <div className="room-layout">
        <section className="meeting"><LiveKitRoom serverUrl={credentials.serverUrl} token={credentials.token} connect audio video data-lk-theme="default" onDisconnected={() => setCredentials(null)}><VideoConference /></LiveKitRoom></section>
        <aside className="files-panel">
          <div className="files-heading"><div><p className="eyebrow">ROOM FILES</p><h2>Shared files</h2></div><label className={`upload-button ${busy ? "disabled" : ""}`}>{busy ? "Uploading…" : "＋ Add file"}<input type="file" disabled={busy} onChange={shareFile} hidden /></label></div>
          <p className="file-note">Share files up to 100 MB with everyone in this room.</p>
          {error && <p className="error">{error}</p>}
          {files.length ? <ul className="file-list">{files.map((file) => <li key={`${file.name}-${file.url}`}><span className="file-icon">↗</span><a href={file.url} target="_blank" rel="noreferrer">{file.name}<small>{formatSize(file.size)}</small></a></li>)}</ul> : <div className="empty-files">Files shared here will appear in this list.</div>}
          <button className="refresh-files" onClick={() => void loadFiles()}>Refresh files</button>
          <p className="security-note">Room links act like invitations. Anyone with this link can join and access shared files.</p>
        </aside>
      </div>
    </main>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

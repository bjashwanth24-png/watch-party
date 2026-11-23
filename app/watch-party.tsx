"use client";

import { useState } from "react";

export default function WatchParty() {
  const [room, setRoom] = useState("");

  function createRoom() {
    const id = crypto.randomUUID();
    window.location.assign(`/room/${id}`);
  }

  function joinRoom() {
    const id = room.trim();
    if (!/^[a-zA-Z0-9_-]{3,64}$/.test(id)) return;
    window.location.assign(`/room/${encodeURIComponent(id)}`);
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="brand">Watch<span>Party</span></div>
        <h1>Watch together.<br />No matter the distance.</h1>
        <p>Start a private room for live video, screen sharing, chat, and file sharing.</p>
        <div className="actions">
          <button className="primary" onClick={createRoom}>Create a room</button>
          <div className="join">
            <input aria-label="Room code" placeholder="Paste a room code" value={room}
              onChange={(event) => setRoom(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && joinRoom()} />
            <button onClick={joinRoom}>Join</button>
          </div>
        </div>
        <p className="fine-print">Only share your room link with people you trust. Everyone needs a working camera/microphone and a modern browser.</p>
      </section>
      <aside className="preview" aria-label="Video room preview">
        <div className="preview-card">
          <div className="preview-header"><i /><i /><i /></div>
          <div className="video-grid"><div className="tile tile-one"><span>Alex</span></div><div className="tile tile-two"><span>You</span></div></div>
          <div className="controls"><b>●</b><b>▮▮</b><b>Share screen</b><b>↗</b></div>
        </div>
      </aside>
    </main>
  );
}

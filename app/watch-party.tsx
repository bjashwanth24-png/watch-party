"use client";

import { useState } from "react";

export default function WatchParty() {
  const [room, setRoom] = useState("");

  function createRoom() {
    const id = crypto.randomUUID().slice(0, 8);
    setRoom(id);
  }

  function joinRoom() {
    if (!room.trim()) return;
    window.location.hash = `room=${encodeURIComponent(room.trim())}`;
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="brand">Watch<span>Party</span></div>
        <h1>Watch together.<br />No matter the distance.</h1>
        <p>Create a private room for video, screen sharing, chat, and files.</p>

        <div className="actions">
          <button className="primary" onClick={createRoom}>Create a room</button>
          <div className="join">
            <input
              aria-label="Room code"
              placeholder="Enter room code"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && joinRoom()}
            />
            <button onClick={joinRoom}>Join</button>
          </div>
        </div>

        {room && (
          <div className="room-ready">
            <span>Room ready</span>
            <strong>{room}</strong>
            <button onClick={() => window.location.hash = `room=${room}`}>Enter room</button>
          </div>
        )}
      </section>

      <aside className="preview" aria-label="Product preview">
        <div className="preview-card">
          <div className="preview-header"><i /><i /><i /></div>
          <div className="video-grid">
            <div className="tile tile-one"><span>Alex</span></div>
            <div className="tile tile-two"><span>You</span></div>
          </div>
          <div className="controls"><b>●</b><b>▮▮</b><b>Share</b><b>↗</b></div>
        </div>
      </aside>
    </main>
  );
}

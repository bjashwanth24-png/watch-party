import { notFound } from "next/navigation";
import RoomClient from "./room-client";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(roomId)) notFound();
  return <RoomClient roomId={roomId} />;
}

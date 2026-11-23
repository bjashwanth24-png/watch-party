import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Party",
  description: "Video calls, screen sharing, chat, and file sharing"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motion Editor",
  description: "Timeline corrections for the Remotion motion-editor reels",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

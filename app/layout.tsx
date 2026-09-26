import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Keel — meeting notes that keep the ship straight",
  description:
    "A Fathom rebuild: recordings, transcripts, templates, action items, highlights, search, and shareable clips. Capture is stubbed. The workspace is not.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

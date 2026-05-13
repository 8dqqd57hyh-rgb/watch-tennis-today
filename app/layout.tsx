import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watch Tennis Today",
  description:
    "Live tennis matches, schedules, broadcasters and where to watch ATP, WTA and Grand Slam tournaments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
  <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a
        href="/"
        className="text-xl md:text-2xl font-black tracking-tight text-white"
      >
        🎾 Watch Tennis Today
      </a>

      <nav className="flex items-center gap-4 text-sm font-semibold">
        <a
          href="/live-tennis"
          className="text-zinc-300 hover:text-white"
        >
          Live
        </a>

        <a
          href="/tv-schedule"
          className="text-zinc-300 hover:text-white"
        >
          TV Schedule
        </a>

        <a
          href="/watch-tennis-in/poland"
          className="text-zinc-300 hover:text-white"
        >
          Countries
        </a>
      </nav>
    </div>
  </header>

  {children}
  <Analytics />
</body>
    </html>
  );
}
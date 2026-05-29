import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import CookieBanner from "@/app/components/CookieBanner";
import ClickAnalytics from "@/app/components/ClickAnalytics";
import { ADSENSE_SCRIPT_SRC } from "@/app/lib/adsense";


export const metadata: Metadata = {
  title: "Watch Tennis Today",

  description:
    "Live tennis matches, schedules, broadcasters and where to watch ATP, WTA and Grand Slam tournaments.",

  openGraph: {
    title: "Watch Tennis Today",

    description:
      "Live ATP, WTA and Grand Slam tennis matches, schedules and streaming information.",

    url: "https://watchtennistoday.com",

    siteName: "Watch Tennis Today",

    images: [
      {
        url: "https://watchtennistoday.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Watch Tennis Today",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Watch Tennis Today",

    description:
      "Live ATP, WTA and Grand Slam tennis matches, schedules and streaming information.",

    images: [
      "https://watchtennistoday.com/og-image.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-black">
       <Script
  id="adsense-script"
  async
  strategy="afterInteractive"
  crossOrigin="anonymous"
  src={ADSENSE_SCRIPT_SRC}
/>

<Script
  id="website-schema"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: "https://watchtennistoday.com",
      description:
        "Live tennis matches, schedules, broadcasters and streaming information for ATP, WTA and Grand Slam tournaments.",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://watchtennistoday.com/?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
  }}
/>
  <header className="site-header sticky top-0 z-50 border-b border-zinc-800 bg-black backdrop-blur" style={{ backgroundColor: "#050505", color: "#ffffff" }}>
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
      <a
        href="/"
        className="site-brand text-xl font-black tracking-tight text-white md:text-2xl" style={{ color: "#ffffff" }}
      >
        🎾 Watch Tennis Today
      </a>

      <nav
        aria-label="Primary navigation"
        className="site-nav flex items-center gap-4 overflow-x-auto whitespace-nowrap text-sm font-semibold"
      >
        <a href="/live-tennis" className="text-zinc-100 hover:text-white" style={{ color: "#f4f4f5" }}>
          Live Tennis
        </a>
        <a href="/best-tennis-matches-today" className="text-zinc-100 hover:text-white" style={{ color: "#f4f4f5" }}>
          Matches Today
        </a>
        <a href="/tv-schedule" className="text-zinc-100 hover:text-white" style={{ color: "#f4f4f5" }}>
          TV Schedule
        </a>
        <a href="/players" className="text-zinc-100 hover:text-white" style={{ color: "#f4f4f5" }}>
          Players
        </a>
        <a href="/tournament" className="text-zinc-100 hover:text-white" style={{ color: "#f4f4f5" }}>
          Grand Slams
        </a>
        <a href="/tennis-tv-broadcast-finder" className="hidden text-emerald-300 hover:text-emerald-200 md:inline" style={{ color: "#6ee7b7" }}>
          Where to Watch
        </a>
      </nav>
    </div>
  </header>

  {children}

  <footer className="mt-20 border-t border-zinc-800 bg-black">
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-zinc-400 md:grid-cols-5">
      <div className="md:col-span-2">
        <p className="mb-3 text-lg font-black text-white">🎾 Watch Tennis Today</p>
        <p className="max-w-md text-xs leading-6 text-zinc-500">
          Watch Tennis Today provides information about legal tennis broadcasts,
          tournament schedules, TV coverage, player matches and viewing options.
          We do not host, provide or stream copyrighted content.
        </p>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">Watch</p>
        <div className="space-y-2">
          <a href="/live-tennis" className="block hover:text-white">Live Tennis</a>
          <a href="/best-tennis-matches-today" className="block hover:text-white">Matches Today</a>
          <a href="/tv-schedule" className="block hover:text-white">TV Schedule</a>
          <a href="/tennis-on-tv-today" className="block hover:text-white">Tennis on TV Today</a>
        </div>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">Players & Slams</p>
        <div className="space-y-2">
          <a href="/players" className="block hover:text-white">Players</a>
          <a href="/players/atp" className="block hover:text-white">ATP Players</a>
          <a href="/players/wta" className="block hover:text-white">WTA Players</a>
          <a href="/french-open-live" className="block hover:text-white">French Open</a>
          <a href="/wimbledon-live" className="block hover:text-white">Wimbledon</a>
          <a href="/grand-slam-live" className="block hover:text-white">Grand Slam Live</a>
        </div>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">Guides</p>
        <div className="space-y-2">
          <a href="/watch-tennis-abroad" className="block hover:text-white">Watch Abroad</a>
          <a href="/tennis-streaming-services" className="block hover:text-white">Streaming Services</a>
          <a href="/tennis-tv-broadcast-finder" className="block hover:text-white">Broadcast Finder</a>
          <a href="/how-to-watch-tennis-legally" className="block hover:text-white">Legal Guide</a>
          <a href="/tennis-live-alerts" className="block hover:text-white">Tennis Alerts</a>
        </div>
      </div>
    </div>

    <div className="mx-auto flex max-w-7xl flex-wrap gap-4 border-t border-zinc-900 px-6 py-6 text-xs text-zinc-500">
      <a href="/about" className="hover:text-white">About</a>
      <a href="/contact" className="hover:text-white">Contact</a>
      <a href="/privacy" className="hover:text-white">Privacy Policy</a>
      <a href="/terms" className="hover:text-white">Terms</a>
      <a href="/disclaimer" className="hover:text-white">Disclaimer</a>
      <a href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</a>
      <a href="/editorial-policy" className="hover:text-white">Editorial Policy</a>
      <a href="/how-we-source-data" className="hover:text-white">How We Source Data</a>
      <a href="/authors/watch-tennis-today" className="hover:text-white">Author</a>
    </div>
  </footer>
  <ClickAnalytics />
  <Analytics />
  <GoogleAnalytics gaId="G-Y9EP52NP5T" />
  <CookieBanner />
</body>
    </html>
  );
}

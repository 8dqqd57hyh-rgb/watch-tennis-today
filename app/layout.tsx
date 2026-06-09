import type { Metadata } from "next";
import Link from "next/link";
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
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://watchtennistoday.com/#website",
          name: "Watch Tennis Today",
          url: "https://watchtennistoday.com",
          description:
            "Live tennis matches, schedules, broadcasters and streaming information for ATP, WTA and Grand Slam tournaments.",
          publisher: {
            "@id": "https://watchtennistoday.com/#organization",
          },
        },
        {
          "@type": "Organization",
          "@id": "https://watchtennistoday.com/#organization",
          name: "Watch Tennis Today",
          url: "https://watchtennistoday.com",
          logo: {
            "@type": "ImageObject",
            url: "https://watchtennistoday.com/icon.png",
          },
          sameAs: [],
        },
      ],
    }),
  }}
/>
  <header className="site-header sticky top-0 z-50 border-b border-zinc-800 bg-black backdrop-blur" style={{ backgroundColor: "#050505", color: "#ffffff" }}>
    <div className="site-header-inner mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
      <Link
        href="/"
        className="site-brand text-xl font-black tracking-tight text-white" style={{ color: "#ffffff" }}
      >
        🎾 Watch Tennis Today
      </Link>

      <nav
        aria-label="Primary navigation"
        className="site-nav text-sm font-semibold"
      >
        <Link href="/live-tennis" className="site-nav-link">
          Live Tennis
        </Link>
        <Link href="/best-tennis-matches-today" className="site-nav-link">
          Matches Today
        </Link>
        <Link href="/players" className="site-nav-link">
          Players
        </Link>
        <Link href="/tennis-calendar" className="site-nav-link">
          Calendar
        </Link>
        <Link href="/tennis-guides" className="site-nav-link site-nav-link-highlight">
          Guides
        </Link>

        <details className="site-more-menu">
          <summary className="site-more-summary" aria-label="Open more navigation links">
            More
          </summary>
          <div className="site-more-panel">
            <Link href="/tv-schedule">TV Schedule</Link>
            <Link href="/tennis-guides">Guides Hub</Link>
            <Link href="/tennis-calendar">Tennis Calendar</Link>
            <Link href="/tennis-tournaments">Tournament Levels</Link>
            <Link href="/best-tennis-players">Best Players</Link>
            <Link href="/analysis">Tennis Analysis</Link>
            <Link href="/tennis-resources">Tennis Resources</Link>
            <Link href="/newsletter">Newsletter</Link>
            <Link href="/advertise">Advertise</Link>
            <Link href="/how-to-watch-tennis-legally">Legal Streaming Guide</Link>
            <Link href="/tournament">Grand Slams</Link>
            <Link href="/tennis-tv-broadcast-finder">Where to Watch</Link>
            <Link href="/tennis-on-tv-today">Tennis on TV Today</Link>
            <Link href="/tennis-time-zone-converter">Time Zone Converter</Link>
            <Link href="/tennis-watchlist-today">Tennis Watchlist</Link>
            <Link href="/french-open-live">French Open</Link>
            <Link href="/wimbledon-live">Wimbledon</Link>
          </div>
        </details>
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
          <Link href="/live-tennis" className="block hover:text-white">Live Tennis</Link>
          <Link href="/best-tennis-matches-today" className="block hover:text-white">Matches Today</Link>
          <Link href="/tv-schedule" className="block hover:text-white">TV Schedule</Link>
          <Link href="/tennis-on-tv-today" className="block hover:text-white">Tennis on TV Today</Link>
          <Link href="/tennis-time-zone-converter" className="block hover:text-white">Time Zone Converter</Link>
        </div>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">Players & Slams</p>
        <div className="space-y-2">
          <Link href="/players" className="block hover:text-white">Players</Link>
          <Link href="/players/atp" className="block hover:text-white">ATP Players</Link>
          <Link href="/players/wta" className="block hover:text-white">WTA Players</Link>
          <Link href="/best-tennis-players" className="block hover:text-white">Best Players Guide</Link>
          <Link href="/tennis-tournaments" className="block hover:text-white">Tournament Levels</Link>
          <Link href="/tennis-guides" className="block hover:text-white">Tennis Guides Hub</Link>
          <Link href="/tennis-watchlist-today" className="block hover:text-white">Tennis Watchlist</Link>
          <Link href="/tennis-resources" className="block hover:text-white">Tennis Resources</Link>
          <Link href="/newsletter" className="block hover:text-white">Newsletter</Link>
          <Link href="/french-open-live" className="block hover:text-white">French Open</Link>
          <Link href="/wimbledon-live" className="block hover:text-white">Wimbledon</Link>
          <Link href="/grand-slam-live" className="block hover:text-white">Grand Slam Live</Link>
        </div>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">Guides</p>
        <div className="space-y-2">
          <Link href="/tennis-guides" className="block hover:text-white">All Tennis Guides</Link>
          <Link href="/tennis-calendar" className="block hover:text-white">Tennis Calendar</Link>
          <Link href="/analysis" className="block hover:text-white">Tennis Analysis</Link>
          <Link href="/best-ways-to-watch-tennis-online" className="block hover:text-white">Watch Tennis Legally</Link>
          <Link href="/watch-tennis-abroad" className="block hover:text-white">Watch Abroad</Link>
          <Link href="/tennis-streaming-services" className="block hover:text-white">Streaming Services</Link>
          <Link href="/tennis-tv-broadcast-finder" className="block hover:text-white">Broadcast Finder</Link>
          <Link href="/how-to-watch-tennis-legally" className="block hover:text-white">Legal Guide</Link>
          <Link href="/tennis-live-alerts" className="block hover:text-white">Tennis Alerts</Link>
          <Link href="/tennis-scoring-explained" className="block hover:text-white">Tennis Scoring</Link>
          <Link href="/atp-wta-rankings-explained" className="block hover:text-white">Rankings Guide</Link>
          <Link href="/official-tennis-broadcasters-guide" className="block hover:text-white">Official Broadcasters</Link>
          <Link href="/advertise" className="block hover:text-white">Advertise</Link>
        </div>
      </div>
    </div>

    <div className="mx-auto flex max-w-7xl flex-wrap gap-4 border-t border-zinc-900 px-6 py-6 text-xs text-zinc-500">
      <Link href="/about" className="hover:text-white">About</Link>
      <Link href="/contact" className="hover:text-white">Contact</Link>
      <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
      <Link href="/terms" className="hover:text-white">Terms</Link>
      <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
      <Link href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</Link>
      <Link href="/advertise" className="hover:text-white">Advertise</Link>
      <Link href="/editorial-policy" className="hover:text-white">Editorial Policy</Link>
      <Link href="/how-we-source-data" className="hover:text-white">How We Source Data</Link>
      <Link href="/how-we-verify-streams" className="hover:text-white">How We Verify Streams</Link>
      <Link href="/authors/watch-tennis-today" className="hover:text-white">Author</Link>
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

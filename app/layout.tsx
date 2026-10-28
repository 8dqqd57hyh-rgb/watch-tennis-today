import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import CookieBanner from "@/app/components/CookieBanner";
import ClickAnalytics from "@/app/components/ClickAnalytics";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import {
  buildAuthorPersonSchema,
  buildOrganizationSchema,
} from "@/data/authorProfile";


export const metadata: Metadata = {
  metadataBase: new URL("https://watchtennistoday.com"),

  title: "Watch Tennis Today",

  description:
    "Find where to watch any tennis match: official broadcasters and streaming services for ATP, WTA and Grand Slam tournaments in your country.",

  openGraph: {
    title: "Watch Tennis Today",

    description:
      "Find official broadcasters and streaming services for ATP, WTA and Grand Slam tennis in your country.",

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
      "Find official broadcasters and streaming services for ATP, WTA and Grand Slam tennis in your country.",

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
            "Find official broadcasters and streaming services for ATP, WTA and Grand Slam tennis in your country.",
          publisher: {
            "@id": "https://watchtennistoday.com/#organization",
          },
        },
        buildOrganizationSchema(),
        buildAuthorPersonSchema(),
      ],
    }).replace(/</g, "\\u003c"),
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

      <LanguageSwitcher />

      <nav
        aria-label="Primary navigation"
        data-testid="primary-navigation"
        className="site-nav text-sm font-semibold"
      >
        <Link href="/can-i-watch" className="site-nav-link site-nav-link-highlight" data-testid="primary-nav-link">
          Where to Watch
        </Link>
        <Link href="/watch-tennis-in" className="site-nav-link" data-testid="primary-nav-link">
          By Country
        </Link>
        <Link href="/broadcasters" className="site-nav-link" data-testid="primary-nav-link">
          Broadcasters
        </Link>
        <Link href="/players" className="site-nav-link" data-testid="primary-nav-link">
          Players
        </Link>
      </nav>
    </div>
  </header>

  {children}

  <footer className="mt-20 border-t border-zinc-800 bg-black">
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-zinc-400 md:grid-cols-4">
      <div className="md:col-span-2">
        <p className="mb-3 text-lg font-black text-white">🎾 Watch Tennis Today</p>
        <p className="max-w-md text-xs leading-6 text-zinc-500">
          Watch Tennis Today does not host or embed live streams. We help users
          find official and legal broadcasters and streaming options for tennis
          tournaments in their country.
        </p>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">Where to watch</p>
        <div className="space-y-2">
          <Link href="/can-i-watch" className="block hover:text-white">Match &amp; Tournament Finder</Link>
          <Link href="/watch-tennis-in" className="block hover:text-white">Watch by Country</Link>
          <Link href="/broadcasters" className="block hover:text-white">Broadcasters</Link>
          <Link href="/where-to-watch-wimbledon" className="block hover:text-white">Where to Watch Wimbledon</Link>
          <Link href="/where-to-watch-french-open" className="block hover:text-white">Where to Watch French Open</Link>
          <Link href="/official-tennis-broadcasters-guide" className="block hover:text-white">Official Broadcasters</Link>
        </div>
      </div>

      <div>
        <p className="mb-3 font-black uppercase tracking-wide text-zinc-200">More</p>
        <div className="space-y-2">
          <Link href="/players" className="block hover:text-white">Players</Link>
          <Link href="/tennis-streaming-services" className="block hover:text-white">Streaming Services</Link>
          <Link href="/best-ways-to-watch-tennis-online" className="block hover:text-white">Watch Tennis Legally</Link>
          <Link href="/watch-tennis-abroad" className="block hover:text-white">Watch Abroad</Link>
          <Link href="/newsletter" className="block hover:text-white">Newsletter</Link>
        </div>
      </div>
    </div>

    <div className="mx-auto flex max-w-7xl flex-wrap gap-4 border-t border-zinc-900 px-6 py-6 text-xs text-zinc-500">
      <Link href="/about" className="hover:text-white">About</Link>
      <Link href="/contact" className="hover:text-white">Contact</Link>
      <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
      <Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
      <Link href="/terms" className="hover:text-white">Terms</Link>
      <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
      <Link href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</Link>
      <Link href="/editorial-policy" className="hover:text-white">Editorial Policy</Link>
      <Link href="/content-guidelines" className="hover:text-white">Content Guidelines</Link>
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

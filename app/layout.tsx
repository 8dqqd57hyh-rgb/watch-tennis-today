import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import CookieBanner from "@/app/components/CookieBanner";


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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
       <Script
  id="adsense-script"
  async
  strategy="afterInteractive"
  crossOrigin="anonymous"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1230772312817142"
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
  href="/tournament"
  className="text-zinc-300 hover:text-white"
>
  Tournaments
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
  <footer className="border-t border-zinc-800 mt-20">
  <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap gap-6 text-sm text-zinc-400">
    <a
      href="/about"
      className="hover:text-white transition-colors"
    >
      About
    </a>

   <a
  href="/privacy"
  className="hover:text-white transition-colors"
>
  Privacy Policy
</a>

<a
  href="/terms"
  className="hover:text-white transition-colors"
>
  Terms
</a>

    <a
  href="/contact"
  className="hover:text-white transition-colors"
>
  Contact
</a>
<a
  href="/disclaimer"
  className="hover:text-white transition-colors"
>
  Disclaimer
</a>
<a
  href="/best-ways-to-watch-tennis-online"
  className="hover:text-white transition-colors"
>
  Watch Online Guide
</a>
<a
  href="/affiliate-disclosure"
  className="hover:text-white transition-colors"
>
  Affiliate Disclosure
</a>

<a
  href="/cookie-policy"
  className="hover:text-white transition-colors"
>
  Cookie Policy
</a>
<a
  href="/editorial-policy"
  className="hover:text-white transition-colors"
>
  Editorial Policy
</a>

<a
  href="/how-we-source-data"
  className="hover:text-white transition-colors"
>
  How We Source Data
</a>
  </div>
</footer>
  <Analytics />
  <GoogleAnalytics gaId="G-Y9EP52NP5T" />
  <CookieBanner />
</body>
    </html>
  );
}

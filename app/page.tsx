import type { Metadata } from "next";
import Link from "next/link";
import CanIWatchClient from "@/app/can-i-watch/CanIWatchClient";
import { getBroadcastCountryOptions } from "@/src/data/tennisBroadcasts";

export const metadata: Metadata = {
  title: "Where to Watch Tennis | Find the Broadcaster for Any Match",
  description:
    "Pick your country and type a tournament or player to find official tennis broadcasters and streaming services for ATP, WTA and Grand Slam matches.",
  alternates: {
    canonical: "https://watchtennistoday.com",
  },
  openGraph: {
    title: "Where to Watch Tennis | Watch Tennis Today",
    description:
      "Find official broadcasters and streaming services for any ATP, WTA or Grand Slam match in your country.",
    url: "https://watchtennistoday.com",
    type: "website",
  },
};

const quickLinks = [
  { href: "/where-to-watch-wimbledon", label: "Where to watch Wimbledon" },
  { href: "/where-to-watch-french-open", label: "Where to watch the French Open" },
  { href: "/watch-tennis-in", label: "Watch tennis by country" },
  { href: "/broadcasters", label: "All broadcasters" },
];

export default function Home() {
  const countries = getBroadcastCountryOptions();

  return (
    <main className="min-h-screen bg-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Watch Tennis Today
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            Where can I watch this tennis match?
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
            Choose your country, then type the tournament or a player in the match.
            We show the official broadcasters and streaming services that carry it.
          </p>
        </header>

        <CanIWatchClient countries={countries} />

        <section aria-label="Popular where-to-watch pages" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-black hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
            >
              {link.label}
            </Link>
          ))}
        </section>

        <section
          aria-labelledby="support-project-title"
          className="mt-8 overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-zinc-950 to-zinc-950 p-6 md:flex md:items-center md:justify-between md:gap-10 md:p-8"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              Independent tennis resource
            </p>
            <h2 id="support-project-title" className="mt-2 text-2xl font-black md:text-3xl">
              Support the project
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base">
              Watch Tennis Today helps tennis fans find official viewing options.
              Your support helps cover hosting and the time needed to verify
              broadcaster information.
            </p>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              Support is optional and never affects our editorial choices.
            </p>
          </div>

          <a
            href="https://www.paypal.me/AnzhalikaSokalava"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-black text-black transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-black md:mt-0"
          >
            Support via PayPal
          </a>
        </section>
      </div>
    </main>
  );
}
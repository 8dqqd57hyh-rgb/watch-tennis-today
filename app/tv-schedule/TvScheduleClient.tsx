"use client";

import { useEffect, useState } from "react";
import AdSenseEditorialBlock from "@/app/components/AdSenseEditorialBlock";

type TvChannel = {
  name: string;
  country: string;
  platform: string;
  scheduleUrl: string;
  coverage: string[];
  verification: string;
};

export default function TvSchedulePage() {
  const [channels, setChannels] = useState<TvChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChannels() {
      try {
        const response = await fetch("/api/tv-channels");
        const data = await response.json();

        setChannels(Array.isArray(data) ? data : []);
      } catch {
        setChannels([]);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  const grouped = channels.reduce<Record<string, TvChannel[]>>(
    (acc, channel) => {
      if (!acc[channel.platform]) {
        acc[channel.platform] = [];
      }

      acc[channel.platform].push(channel);
      return acc;
    },
    {}
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <a
          href="/"
          className="inline-block mb-8 text-zinc-400 hover:text-white"
        >
          ← Back to matches
        </a>

        <section className="mt-8 mb-10">
  <h1 className="text-5xl font-black mb-4">
  Tennis on TV Today | ATP & WTA Schedule
</h1>

  <p className="text-zinc-400 text-lg leading-relaxed">
    Check today&apos;s tennis TV schedule, live matches and official
    broadcaster information. Tennis coverage depends on your country,
    tournament and subscription platform.
  </p>
</section>

<AdSenseEditorialBlock
  title="How to verify tennis TV coverage"
  intro="Tennis broadcast rights are regional and tournament-specific, so the safest TV schedule is one that points users toward official sources and explains how rights differ by event."
  paragraphs={[
    "ATP Tour, WTA Tour and Grand Slam events can have different broadcast partners in the same country. A subscription that shows one weekly tour event may not include Roland Garros, Wimbledon, the US Open or the Australian Open.",
    "Use this guide to identify likely official channels, then confirm the exact match on the broadcaster’s own schedule before paying for a subscription or planning your evening. Match times can move when previous matches run long.",
    "We avoid listing unofficial stream mirrors. If a match is not listed by an official broadcaster, it is better to check tournament pages, national TV listings or the official tour schedule instead of using unsafe stream sites.",
  ]}
  checklist={[
    "Confirm country and tournament rights.",
    "Check the broadcaster schedule before match time.",
    "Do not rely on unofficial stream mirrors.",
    "Use tournament pages for late court changes.",
  ]}
  links={[
    { href: "/official-tennis-broadcasters-guide", label: "Official broadcasters" },
    { href: "/how-to-watch-tennis-legally", label: "Legal guide" },
    { href: "/tennis-streaming-rights-explained", label: "Rights explained" },
  ]}
/>

<section className="mb-10">
  <h2 className="text-3xl font-black mb-6">
    Popular Tennis TV Schedule Pages
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <a
      href="/tv-schedule/jannik-sinner"
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition"
    >
      <h3 className="text-xl font-black mb-2">
        Jannik Sinner TV Schedule
      </h3>

      <p className="text-zinc-400">
        Match times, TV channels and streaming coverage.
      </p>
    </a>

    <a
      href="/tv-schedule/carlos-alcaraz"
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition"
    >
      <h3 className="text-xl font-black mb-2">
        Carlos Alcaraz TV Schedule
      </h3>

      <p className="text-zinc-400">
        Live ATP match schedule and TV coverage.
      </p>
    </a>

    <a
      href="/tv-schedule/novak-djokovic"
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition"
    >
      <h3 className="text-xl font-black mb-2">
        Novak Djokovic TV Schedule
      </h3>

      <p className="text-zinc-400">
        Tennis TV listings and streaming information.
      </p>
    </a>

    <a
      href="/tv-schedule/iga-swiatek"
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition"
    >
      <h3 className="text-xl font-black mb-2">
        Iga Swiatek TV Schedule
      </h3>

      <p className="text-zinc-400">
        WTA broadcast schedule and live streams.
      </p>
    </a>

    <a
      href="/tv-schedule/aryna-sabalenka"
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition"
    >
      <h3 className="text-xl font-black mb-2">
        Aryna Sabalenka TV Schedule
      </h3>

      <p className="text-zinc-400">
        Watch Sabalenka matches live on TV and online.
      </p>
    </a>

    <a
      href="/french-open-tv-schedule"
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition"
    >
      <h3 className="text-xl font-black mb-2">
        French Open TV Schedule
      </h3>

      <p className="text-zinc-400">
        Roland Garros TV channels and streaming schedule.
      </p>
    </a>
  </div>
</section>

        <section className="bg-gradient-to-br from-green-500 to-lime-400 text-black rounded-3xl p-6 mb-10">
  <h2 className="text-3xl font-black mb-3">
    🎾 Looking for live tennis streams?
  </h2>

  <p className="font-semibold mb-5">
    Find live ATP, WTA, Challenger and Grand Slam matches with official
    broadcaster links and streaming availability.
  </p>

  <a
    href="/live-tennis"
    className="inline-block bg-black text-white px-5 py-3 rounded-2xl font-black"
  >
    View Live Tennis
  </a>
</section>

        {loading ? (
          <p className="text-zinc-400">Loading channels...</p>
        ) : channels.length === 0 ? (
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="mb-4 text-3xl font-black">TV channel data is temporarily unavailable</h2>
            <p className="max-w-3xl leading-8 text-zinc-300">
              The official tennis TV schedule can change by country, tournament and subscription service.
              Use the live tennis hub, today&apos;s matches and broadcaster guide while the channel list refreshes.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="/live-tennis" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
                Live Tennis →
              </a>
              <a href="/today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
                Today&apos;s Matches →
              </a>
              <a href="/official-tennis-broadcasters-guide" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
                Broadcaster Guide →
              </a>
            </div>
          </section>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([platform, items]) => (
              <section
                key={platform}
                className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6"
              >
                <h2 className="text-3xl font-black mb-5">
                  {platform}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((channel) => (
                    <a
                      key={channel.name}
                      href={channel.scheduleUrl}
                      target="_blank"
                      className="block bg-black/40 rounded-3xl p-5 border border-zinc-800 hover:border-green-500 transition-all"
                    >
                      <h3 className="text-2xl font-black mb-2">
                        {channel.name}
                      </h3>

                      <p className="text-zinc-400 mb-3">
                        {channel.country}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {channel.coverage.map((item) => (
                          <span
                            key={item}
                            className="bg-zinc-800 rounded-full px-3 py-1 text-xs font-bold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <p className="text-green-400 text-sm font-semibold">
                        {channel.verification}
                      </p>

                      <p className="text-zinc-500 text-sm mt-2">
                        Open official schedule →
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

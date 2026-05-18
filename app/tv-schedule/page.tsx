"use client";

import { useEffect, useState } from "react";

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
      const response = await fetch("/api/tv-channels");
      const data = await response.json();

      setChannels(data);
      setLoading(false);
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
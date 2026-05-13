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

        <h1 className="text-5xl font-black mb-3">
          📺 Tennis TV Schedule
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Trusted TV channels and official schedule pages for tennis broadcasts.
        </p>

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
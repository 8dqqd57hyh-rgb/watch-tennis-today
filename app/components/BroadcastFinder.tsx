"use client";

import { useMemo, useState } from "react";
import { broadcastCountries } from "@/data/broadcastFinder";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import { withTracking } from "@/app/lib/tracking";

export default function BroadcastFinder() {
  const [selectedCountry, setSelectedCountry] = useState("poland");
  const country = useMemo(
    () => broadcastCountries.find((item) => item.slug === selectedCountry) || broadcastCountries[0],
    [selectedCountry]
  );

  return (
    <section className="rounded-[2.5rem] border border-sky-500/40 bg-gradient-to-br from-sky-950/30 via-zinc-950 to-black p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-sky-400 px-4 py-2 text-sm font-black text-black">
          🌍 Broadcast Finder
        </span>
        <span className="text-sm text-zinc-400">
          Helps users move from daily traffic to country-specific official viewing guides
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
            Find tennis TV channels by country
          </h2>
          <p className="mb-6 leading-8 text-zinc-300">
            Tennis rights change by tournament. Pick a country to see the most likely official broadcaster routes for ATP, WTA and Grand Slam tennis.
          </p>

          <label className="mb-2 block text-sm font-black uppercase tracking-[0.18em] text-zinc-500">
            Choose country
          </label>
          <select
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className="mb-6 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-4 font-bold text-white outline-none focus:border-sky-400"
          >
            {broadcastCountries.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.country}
              </option>
            ))}
          </select>

          <div className="grid gap-3">
            <a
              href={`/watch-tennis-in/${country.slug}`}
              className="rounded-2xl bg-sky-400 px-5 py-4 text-center font-black text-black hover:bg-sky-300"
            >
              Open {country.country} viewing guide →
            </a>
            <a
              href="/watch-tennis-abroad"
              className="rounded-2xl border border-emerald-500/40 px-5 py-4 text-center font-black text-emerald-300 hover:border-emerald-300"
            >
              Traveling abroad guide
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-sky-300">
              {country.country}
            </p>
            <h3 className="mb-4 text-2xl font-black text-white">
              Main viewing routes
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoList title="Primary options" items={country.primaryBroadcasters} />
              <InfoList title="Grand Slams" items={country.grandSlamBroadcasters} />
              <InfoList title="ATP" items={country.atpOptions} />
              <InfoList title="WTA" items={country.wtaOptions} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
              <h3 className="mb-3 text-xl font-black text-white">Official sources to verify</h3>
              <div className="grid gap-2">
                {country.officialDirectories.map((source) => (
                  <a
                    key={source.label}
                    href={withTracking(source.url, "broadcast_finder_official_source")}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-bold text-zinc-200 hover:border-sky-400"
                  >
                    {source.label} →
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5">
              <h3 className="mb-3 text-xl font-black text-white">Travel monetization bridge</h3>
              <p className="mb-4 text-sm leading-6 text-zinc-300">
                {country.travelTip}
              </p>
              <a
                href={affiliateLinks.nordvpn}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="block rounded-2xl bg-emerald-400 px-4 py-3 text-center font-black text-black hover:bg-emerald-300"
              >
                Check VPN option →
              </a>
            </div>
          </div>

          <p className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400">
            {country.notes} Watch Tennis Today does not stream matches; it points users toward official broadcaster information and legal viewing routes.
          </p>
        </div>
      </div>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <h4 className="mb-3 font-black text-white">{title}</h4>
      <ul className="space-y-2 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-sky-300">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

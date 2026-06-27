"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  findBroadcasts,
  formatBroadcastPrice,
  normalizePlayerName,
  normalizeTournament,
  getBroadcasterSlug,
  getCanIWatchQueryOptions,
  getCoverageSummary,
  type TennisBroadcastEntry,
} from "@/src/data/tennisBroadcasts";

type CountryOption = {
  slug: string;
  countryCode?: string;
  country: string;
};

const confidenceLabels: Record<TennisBroadcastEntry["confidenceLevel"], string> = {
  confirmed: "Confirmed from reviewed source",
  partial: "Partially confirmed",
  needs_check: "Needs match-week check",
};

function resultKey(entry: TennisBroadcastEntry) {
  return `${entry.countryCode}-${entry.tournamentId}-${entry.broadcasterName}-${entry.streamingServiceName}`;
}

export default function CanIWatchClient({ countries }: { countries: CountryOption[] }) {
  const queryOptions = useMemo(() => getCanIWatchQueryOptions(), []);
  const defaultCountrySlug = countries.some((country) => country.slug === "poland") ? "poland" : countries[0]?.slug ?? "poland";
  const [countrySlug, setCountrySlug] = useState(defaultCountrySlug);
  const [query, setQuery] = useState("Wimbledon");
  const selectedCountry = countries.find((country) => country.slug === countrySlug) ?? countries[0];
  const countryKey = selectedCountry?.countryCode ?? selectedCountry?.country ?? countrySlug;
  const querySlug = (normalizeTournament(query) ?? normalizePlayerName(query)) || "wimbledon";
  const entries = selectedCountry ? findBroadcasts(countryKey, query) : [];
  const summary = selectedCountry ? getCoverageSummary(countryKey, query) : null;
  const dedupedEntries = entries.filter((entry, index, all) => all.findIndex((item) => resultKey(item) === resultKey(entry)) === index);

  return (
    <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 md:p-8">
      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_auto]">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Country</span>
          <select
            value={countrySlug}
            onChange={(event) => setCountrySlug(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 font-bold text-white"
          >
            {countries.map((country) => (
              <option key={country.slug} value={country.slug}>{country.country}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Player or tournament</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            list="can-i-watch-options"
            placeholder="Wimbledon, Iga Swiatek, Carlos Alcaraz..."
            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 font-bold text-white"
          />
          <datalist id="can-i-watch-options">
            {queryOptions.map((option) => (
              <option key={`${option.type}-${option.slug}`} value={option.label} />
            ))}
          </datalist>
        </label>

        <div className="flex items-end">
          <Link
            href={`/can-i-watch/${querySlug}/${selectedCountry?.slug ?? countrySlug}`}
            className="w-full rounded-2xl bg-emerald-400 px-5 py-3 text-center font-black text-black hover:bg-emerald-300"
          >
            Open SEO page
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-black p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Broadcasters</p>
          <p className="mt-1 text-2xl font-black text-white">{summary?.broadcasterCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-black p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Free routes</p>
          <p className="mt-1 text-2xl font-black text-white">{summary?.freeRouteCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-black p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Paid routes</p>
          <p className="mt-1 text-2xl font-black text-white">{summary?.subscriptionRouteCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-black p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Last verified</p>
          <p className="mt-1 text-lg font-black text-white">{summary?.lastVerified ?? "No match"}</p>
        </div>
      </div>

      {summary?.warning ? (
        <div className="mt-5 rounded-2xl border border-amber-400/40 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
          {summary.warning}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {dedupedEntries.length > 0 ? dedupedEntries.map((entry) => (
          <article key={resultKey(entry)} className="rounded-2xl border border-zinc-800 bg-black p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">{entry.tournamentName}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{entry.broadcasterName}</h3>
                <p className="mt-1 text-zinc-400">Streaming route: {entry.streamingServiceName}</p>
              </div>
              <span className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-black text-zinc-300">
                {confidenceLabels[entry.confidenceLevel]}
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
              <div>
                <dt className="font-black text-zinc-500">Free / paid</dt>
                <dd>{entry.isFree ? "Free route listed" : formatBroadcastPrice(entry.price)}</dd>
              </div>
              <div>
                <dt className="font-black text-zinc-500">Subscription</dt>
                <dd>{entry.requiresSubscription ? "Usually required" : "Not usually required"}</dd>
              </div>
            </dl>
            <p className="mt-4 leading-7 text-zinc-400">{entry.coverageNotes}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/broadcaster/${getBroadcasterSlug(entry.broadcasterName)}`} className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-white hover:border-emerald-400">
                Broadcaster profile
              </Link>
              {entry.officialLinks.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="nofollow noopener noreferrer" className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-300 hover:border-emerald-400">
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        )) : (
          <div className="rounded-2xl border border-zinc-800 bg-black p-6 lg:col-span-2">
            <h3 className="text-2xl font-black text-white">No verified route in this database yet</h3>
            <p className="mt-3 leading-7 text-zinc-400">
              We could not verify coverage for this country and query. Check the tournament official broadcaster page and the ATP/WTA directories before paying for a service.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

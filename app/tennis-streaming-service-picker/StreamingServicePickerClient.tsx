"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getTennisBroadcast,
  tennisBroadcastCountries,
  tennisTournamentGroups,
  type TennisBroadcastConfidence,
  type TennisTournamentId,
} from "@/src/data/tennisBroadcasts";

const confidenceStyles: Record<TennisBroadcastConfidence, string> = {
  confirmed: "border-emerald-300 bg-emerald-400 text-black",
  partial: "border-amber-300 bg-amber-300 text-black",
  needs_check: "border-red-300 bg-red-300 text-black",
};

function formatBoolean(value: boolean | "unknown", yes: string, no: string) {
  if (value === "unknown") {
    return "Unknown - verify on the official source";
  }

  return value ? yes : no;
}

function formatPrice(price?: number, currency?: string) {
  if (price === undefined || !currency) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export default function StreamingServicePickerClient() {
  const [countryCode, setCountryCode] = useState("PL");
  const [tournamentId, setTournamentId] = useState<TennisTournamentId>("wimbledon");

  const selectedBroadcast = useMemo(
    () => getTennisBroadcast(countryCode, tournamentId),
    [countryCode, tournamentId],
  );

  const price = formatPrice(selectedBroadcast?.monthlyPrice, selectedBroadcast?.currency);
  const isStrongRecommendation = selectedBroadcast?.confidenceLevel === "confirmed";

  if (!selectedBroadcast) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-emerald-900 bg-emerald-950/20 p-6 shadow-2xl">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block rounded-2xl border border-zinc-800 bg-black/50 p-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Country</span>
          <select
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm font-bold text-white"
          >
            {tennisBroadcastCountries.map((country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.countryName}
              </option>
            ))}
          </select>
        </label>

        <label className="block rounded-2xl border border-zinc-800 bg-black/50 p-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Tournament group</span>
          <select
            value={tournamentId}
            onChange={(event) => setTournamentId(event.target.value as TennisTournamentId)}
            className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm font-bold text-white"
          >
            {tennisTournamentGroups.map((tournament) => (
              <option key={tournament.tournamentId} value={tournament.tournamentId}>
                {tournament.tournamentName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">
        Grand Slam rights, ATP Tour rights and WTA Tour rights may be separate. Broadcast rights can change. Verify on the official source before paying.
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          className={
            isStrongRecommendation
              ? "rounded-3xl border border-emerald-400 bg-emerald-950/40 p-6 shadow-[0_0_40px_rgba(16,185,129,0.18)]"
              : "rounded-3xl border border-amber-500/50 bg-black/60 p-6"
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Official recommendation</p>
            <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${confidenceStyles[selectedBroadcast.confidenceLevel]}`}>
              {selectedBroadcast.confidenceLevel.replace("_", " ")}
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-black text-white">
            {selectedBroadcast.tournamentName} in {selectedBroadcast.countryName}
          </h2>
          <p className="mt-4 leading-8 text-zinc-300">{selectedBroadcast.coverageNotes}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Broadcaster</p>
              <h3 className="mt-3 text-xl font-black text-white">{selectedBroadcast.broadcasterName}</h3>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Streaming service</p>
              <h3 className="mt-3 text-xl font-black text-white">{selectedBroadcast.streamingServiceName}</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Free or paid</p>
              <p className="mt-2 text-sm font-bold text-zinc-200">
                {selectedBroadcast.isFree ? "Free option exists" : selectedBroadcast.requiresSubscription ? "Paid subscription or TV package" : "No subscription flagged"}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Replays</p>
              <p className="mt-2 text-sm font-bold text-zinc-200">
                {formatBoolean(selectedBroadcast.replaysAvailable, "Replays likely available", "No replay access flagged")}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Commentary</p>
              <p className="mt-2 text-sm font-bold text-zinc-200">
                {formatBoolean(selectedBroadcast.englishCommentary, "English commentary likely", "Local-language commentary likely")}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Price note</p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {price ? `${price}/month. ` : ""}
              {selectedBroadcast.priceNote}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={selectedBroadcast.officialWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-black hover:bg-emerald-300"
            >
              Open official source
            </a>
            <Link href="/tennis-streaming-cost-calculator" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-emerald-300">
              Estimate cost
            </Link>
            <Link href="/tennis-streaming-checklist" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-emerald-300">
              Use checklist
            </Link>
            <Link href="/tennis-streaming-services" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-emerald-300">
              Compare services
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Verification details</p>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-sm font-black text-white">Supported devices</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedBroadcast.supportedDevices.map((device) => (
                <span key={device} className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300">
                  {device}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-sm font-black text-white">Last verified</p>
            <p className="mt-2 text-sm text-zinc-400">{selectedBroadcast.lastVerified}</p>
          </div>

          {selectedBroadcast.confidenceLevel !== "confirmed" ? (
            <div className="mt-4 rounded-2xl border border-amber-400/50 bg-amber-400/10 p-4">
              <p className="text-sm font-black text-amber-200">Needs a final check</p>
              <p className="mt-2 text-sm leading-6 text-amber-100">
                This row uses official tournament or tour directories, but the exact local package, court coverage or price still needs confirmation.
              </p>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-emerald-900 bg-emerald-950/20 p-4">
            <p className="text-sm font-black text-white">Official source buttons</p>
            <div className="mt-3 grid gap-2">
              {selectedBroadcast.officialSourceUrls.map((url, index) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-sm font-black text-zinc-100 hover:border-emerald-300"
                >
                  Official source {index + 1}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

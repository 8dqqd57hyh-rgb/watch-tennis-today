"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatBroadcastPrice,
  getCountryBroadcastEntries,
  getCountryServiceOptions,
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

function formatKnownPrice(price?: number, currency?: string) {
  if (price === undefined || !currency) return "Price not published";

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)}/month`;
}

const defaultTournamentIds: TennisTournamentId[] = ["atp-tour", "wta-tour", "wimbledon"];

export default function StreamingServicePickerClient() {
  const [countryCode, setCountryCode] = useState("US");
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<TennisTournamentId[]>(defaultTournamentIds);

  const countryEntries = useMemo(() => getCountryBroadcastEntries(countryCode), [countryCode]);
  const selectedEntries = useMemo(
    () => countryEntries.filter((entry) => selectedTournamentIds.includes(entry.tournamentId)),
    [countryEntries, selectedTournamentIds],
  );
  const serviceOptions = useMemo(() => getCountryServiceOptions(countryCode), [countryCode]);
  const recommendedServices = useMemo(
    () =>
      serviceOptions.filter((service) =>
        service.tournamentIds.some((tournamentId) => selectedTournamentIds.includes(tournamentId)),
      ),
    [selectedTournamentIds, serviceOptions],
  );
  const coveredTournamentIds = new Set(selectedEntries.map((entry) => entry.tournamentId));
  const uncoveredTournamentIds = selectedTournamentIds.filter((tournamentId) => !coveredTournamentIds.has(tournamentId));
  const selectedCountry = tennisBroadcastCountries.find((country) => country.countryCode === countryCode);

  function getSelectedServiceTournamentNames(service: (typeof serviceOptions)[number]) {
    return service.tournamentIds
      .map((id, index) => ({ id, name: service.tournamentNames[index] }))
      .filter((item) => selectedTournamentIds.includes(item.id))
      .map((item) => item.name)
      .join(", ");
  }

  function toggleTournament(tournamentId: TennisTournamentId) {
    setSelectedTournamentIds((current) => {
      if (current.includes(tournamentId)) {
        const next = current.filter((id) => id !== tournamentId);
        return next.length ? next : current;
      }

      return [...current, tournamentId];
    });
  }

  return (
    <section className="rounded-[2rem] border border-emerald-900 bg-emerald-950/20 p-5 shadow-2xl md:p-6">
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
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

        <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Tournaments you care about</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tennisTournamentGroups.map((tournament) => (
              <label key={tournament.tournamentId} className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm font-bold text-white">
                <input
                  type="checkbox"
                  checked={selectedTournamentIds.includes(tournament.tournamentId)}
                  onChange={() => toggleTournament(tournament.tournamentId)}
                  className="h-4 w-4 accent-emerald-400"
                />
                <span>{tournament.tournamentName}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">
        Grand Slam rights, ATP Tour rights and WTA Tour rights are stored separately. Prices marked Price not published are not included as known monthly costs.
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-emerald-400/50 bg-black/60 p-5 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Minimum service set</p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Recommended services for {selectedCountry?.countryName ?? "your country"}
          </h2>
          <p className="mt-3 leading-7 text-zinc-300">
            This groups selected tournaments by streaming service so users can avoid buying overlapping packages when one service covers multiple stored rows.
          </p>

          <div className="mt-5 grid gap-4">
            {recommendedServices.length ? (
              recommendedServices.map((service) => (
                <article key={service.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-white">{service.serviceName}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Covers: {getSelectedServiceTournamentNames(service)}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-400 px-3 py-2 text-xs font-black text-black">
                      {formatKnownPrice(service.knownMonthlyPrice, service.currency)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{service.priceLabel}</p>
                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Stored source data</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{service.sourceSummary}</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      Sources used: {service.officialLinks.slice(0, 3).map((link) => link.label).join(", ")}. Last verified: {service.lastVerified}.
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-300">
                No service recommendation is stored for this selection yet.
              </p>
            )}
          </div>

          {uncoveredTournamentIds.length ? (
            <div className="mt-5 rounded-2xl border border-red-400/50 bg-red-400/10 p-4">
              <p className="font-black text-red-100">Uncovered tournaments</p>
              <p className="mt-2 text-sm leading-6 text-red-100">
                {uncoveredTournamentIds
                  .map((id) => tennisTournamentGroups.find((group) => group.tournamentId === id)?.tournamentName ?? id)
                  .join(", ")}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tennis-streaming-cost-calculator" className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-black hover:bg-emerald-300">
              Estimate cost
            </Link>
            <Link href="/tennis-streaming-checklist" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-emerald-300">
              Use checklist
            </Link>
            <Link href="/watch-tennis-in" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-emerald-300">
              Country guides
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Selected rights rows</p>
          <div className="mt-4 grid gap-3">
            {selectedEntries.map((entry) => (
              <article key={entry.tournamentId} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-white">{entry.tournamentName}</h3>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-black uppercase ${confidenceStyles[entry.confidenceLevel]}`}>
                    {entry.confidenceLevel.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{entry.broadcasterName}</p>
                <p className="mt-1 text-sm text-zinc-400">{entry.streamingServiceName}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                  Price: {formatBroadcastPrice(entry.price)} | Last verified: {entry.lastVerified}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Source data: {entry.coverageNotes}
                </p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

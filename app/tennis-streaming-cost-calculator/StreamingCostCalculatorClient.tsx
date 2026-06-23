"use client";

import { useMemo, useState } from "react";
import {
  calculateKnownMonthlyTotal,
  getCountryServiceOptions,
  tennisBroadcastCountries,
  type TennisCountryServiceOption,
} from "@/src/data/tennisBroadcasts";

function formatMoney(value: number, currency: string | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function ServicePrice({ service }: { service: TennisCountryServiceOption }) {
  if (service.knownMonthlyPrice !== undefined && service.currency) {
    return (
      <span className="font-black text-neutral-950">
        {formatMoney(service.knownMonthlyPrice, service.currency)}/mo
      </span>
    );
  }

  return <span className="font-black text-amber-700">Price not published</span>;
}

export default function StreamingCostCalculatorClient() {
  const [countryCode, setCountryCode] = useState("US");
  const serviceOptions = useMemo(() => getCountryServiceOptions(countryCode), [countryCode]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const selectedCountry = tennisBroadcastCountries.find((country) => country.countryCode === countryCode);

  const selectedIdsForCountry = selectedServiceIds.filter((id) =>
    serviceOptions.some((service) => service.id === id),
  );
  const calculation = calculateKnownMonthlyTotal(serviceOptions, selectedIdsForCountry);

  function toggleService(serviceId: string) {
    setSelectedServiceIds((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  }

  return (
    <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 text-neutral-950 shadow-sm md:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Interactive planner</p>
          <h2 className="mt-2 text-3xl font-black">Estimate your tennis streaming cost</h2>
          <p className="mt-3 leading-7 text-neutral-700">
            Pick your country and the services you are considering. The page shows the broadcaster, tournament coverage, stored price status and source notes directly here; unknown prices stay out of the total instead of using fake estimates.
          </p>

          <label className="mt-5 block rounded-2xl border border-emerald-100 bg-white p-4">
            <span className="text-sm font-black text-neutral-700">Country</span>
            <select
              value={countryCode}
              onChange={(event) => {
                setCountryCode(event.target.value);
                setSelectedServiceIds([]);
              }}
              className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 font-bold"
            >
              {tennisBroadcastCountries.map((country) => (
                <option key={country.countryCode} value={country.countryCode}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 grid gap-3">
            {serviceOptions.map((service) => (
              <label key={service.id} className="block rounded-2xl border border-emerald-100 bg-white p-4">
                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIdsForCountry.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="mt-1 h-5 w-5 accent-emerald-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-black">{service.serviceName}</span>
                      <ServicePrice service={service} />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-neutral-600">
                      Covers: {service.tournamentNames.join(", ")}
                    </span>
                    <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                      {service.priceLabel}
                    </span>
                    <span className="mt-3 block rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs leading-5 text-neutral-700">
                      <strong className="text-neutral-950">Stored source data:</strong> {service.sourceSummary}
                    </span>
                    <span className="mt-2 block text-xs text-neutral-500">
                      Sources used: {service.officialLinks.map((link) => link.label).join(", ")}. Last verified: {service.lastVerified}.
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-neutral-200 bg-white p-5 md:p-6">
          <h3 className="text-2xl font-black">Monthly total</h3>
          <div className="mt-5 rounded-2xl bg-neutral-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">Known prices only</p>
            <p className="mt-2 text-4xl font-black">
              {formatMoney(calculation.total, calculation.currency)}
            </p>
            <p className="mt-2 text-xs leading-5 text-zinc-300">
              {calculation.hasMixedCurrencies
                ? "Selected services use mixed currencies, so do not treat this as a final bill."
                : `Currency: ${calculation.currency ?? "none selected"}.`}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border bg-neutral-50 p-4">
            <p className="font-black">Included in total</p>
            {calculation.knownServices.length ? (
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {calculation.knownServices.map((service) => (
                  <li key={service.id} className="flex justify-between gap-3">
                    <span>{service.serviceName}</span>
                    <span className="font-black">{formatMoney(service.knownMonthlyPrice ?? 0, service.currency)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-neutral-600">No known-price service selected yet.</p>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-black text-amber-900">No stable monthly price stored</p>
            {calculation.unknownServices.length ? (
              <ul className="mt-3 space-y-3 text-sm text-amber-900">
                {calculation.unknownServices.map((service) => (
                  <li key={service.id}>
                    <span className="font-bold">{service.serviceName}</span>
                    <p className="mt-1 text-xs leading-5">
                      Price is not included because the stored official source data does not publish a stable monthly checkout price for this country/service.
                    </p>
                    <p className="mt-1 text-xs leading-5">
                      Sources already reviewed: {service.officialLinks.slice(0, 3).map((link) => link.label).join(", ")}.
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-amber-900">No selected unknown-price services.</p>
            )}
          </div>

          <p className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
            Rights and prices can change by country, event and provider offer. This calculator shows the reviewed data stored on Watch Tennis Today and excludes services where a stable monthly price is not stored.
          </p>
        </aside>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-4">
        <h3 className="font-black">{selectedCountry?.countryName ?? "Selected country"} data coverage</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Services are derived from ATP, WTA and separate Grand Slam rows. If a service says Price not published, it is intentionally excluded from the calculated total.
        </p>
      </div>
    </section>
  );
}

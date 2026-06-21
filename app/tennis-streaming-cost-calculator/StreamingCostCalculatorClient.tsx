"use client";

import { useMemo, useState } from "react";
import { getKnownBroadcastPriceOptions } from "@/src/data/tennisBroadcasts";

type ServiceKey = "main" | "grandSlam" | "vpn" | "extra";
type CurrencyCode = "USD" | "EUR" | "GBP";

type ServiceOption = {
  id: string;
  name: string;
  monthlyCost: number;
  currency: CurrencyCode;
  coverageNote: string;
  priceNote: string;
};

type ServiceItem = {
  key: ServiceKey;
  label: string;
  help: string;
  options: ServiceOption[];
};

const knownBroadcastPriceOptions = getKnownBroadcastPriceOptions();

const serviceItems: ServiceItem[] = [
  {
    key: "main",
    label: "Known official service price",
    help: "Choose a service price that is stored in the reusable broadcaster database, or use a custom value for a provider that still needs checkout verification.",
    options: [
      ...knownBroadcastPriceOptions,
      {
        id: "custom-main",
        name: "Other / custom service",
        monthlyCost: 15,
        currency: "USD",
        coverageNote: "Use this for your local broadcaster, cable package or another legal service.",
        priceNote: "Custom value - edit it to match your real plan.",
      },
    ],
  },
  {
    key: "grandSlam",
    label: "Grand Slam add-on or separate service",
    help: "Grand Slam rights are often separate from regular tour coverage, so add the official service your country uses for the Slam you want.",
    options: [
      {
        id: "custom-slam",
        name: "Other / custom Grand Slam provider",
        monthlyCost: 10,
        currency: "USD",
        coverageNote: "Use this for BBC iPlayer, Eurosport, Stan Sport, beIN, TSN, DAZN, ESPN, Prime Video or another legal local option.",
        priceNote: "Custom value - verify the current price on the official broadcaster checkout page.",
      },
    ],
  },
  {
    key: "vpn",
    label: "Travel privacy tool",
    help: "Only include this if you use a VPN for public Wi-Fi privacy or your own legal account while traveling. Do not use it to bypass rights rules.",
    options: [
      {
        id: "vpn-basic",
        name: "Typical VPN monthly equivalent",
        monthlyCost: 5,
        currency: "USD",
        coverageNote: "Privacy tool only; it does not replace a legal subscription.",
        priceNote: "Generic monthly equivalent for long-term VPN plans.",
      },
      {
        id: "no-vpn",
        name: "No VPN",
        monthlyCost: 0,
        currency: "USD",
        coverageNote: "Best choice if you do not need a travel privacy tool.",
        priceNote: "No extra monthly cost.",
      },
      {
        id: "custom-vpn",
        name: "Other / custom VPN",
        monthlyCost: 4,
        currency: "USD",
        coverageNote: "Use your actual VPN monthly equivalent if you already pay for one.",
        priceNote: "Custom value - edit it to match your bill.",
      },
    ],
  },
  {
    key: "extra",
    label: "Extra sports bundle",
    help: "Add this only if you keep a bigger bundle mostly because of tennis coverage.",
    options: [
      {
        id: "sports-pack-custom",
        name: "Cable / sports pack custom",
        monthlyCost: 25,
        currency: "USD",
        coverageNote: "Use this for a local sports pack, cable add-on or TV provider bundle.",
        priceNote: "Custom value - edit it to match your real package.",
      },
      {
        id: "no-extra",
        name: "No extra bundle",
        monthlyCost: 0,
        currency: "USD",
        coverageNote: "Keep the setup lean if your main service already covers what you watch.",
        priceNote: "No extra monthly cost.",
      },
    ],
  },
];

const exchangeToUsd: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
};

const eventProfiles = [
  {
    label: "ATP/WTA weekly events",
    note: "The known-price dropdown is populated from the reusable broadcaster database where official pricing is available.",
  },
  {
    label: "Grand Slams",
    note: "Most Slam rows still need provider checkout verification, so use the custom add-on until a verified price is added to the data source.",
  },
  {
    label: "One favorite player only",
    note: "May be cheaper to subscribe around specific tournaments instead of keeping every service all season.",
  },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildInitialSelections() {
  return serviceItems.reduce<Record<ServiceKey, string>>((result, item) => {
    result[item.key] = item.options[0].id;
    return result;
  }, {} as Record<ServiceKey, string>);
}

function buildInitialCosts() {
  return serviceItems.reduce<Record<ServiceKey, number>>((result, item) => {
    result[item.key] = item.options[0].monthlyCost;
    return result;
  }, {} as Record<ServiceKey, number>);
}

function getSelectedOption(item: ServiceItem, selectedId: string) {
  return item.options.find((option) => option.id === selectedId) ?? item.options[0];
}

export default function StreamingCostCalculatorClient() {
  const [enabled, setEnabled] = useState<Record<ServiceKey, boolean>>({
    main: true,
    grandSlam: true,
    vpn: false,
    extra: false,
  });
  const [selectedServices, setSelectedServices] = useState<Record<ServiceKey, string>>(buildInitialSelections);
  const [costs, setCosts] = useState<Record<ServiceKey, number>>(buildInitialCosts);
  const [months, setMonths] = useState(6);

  const selectedItems = useMemo(
    () => serviceItems.map((item) => ({ item, option: getSelectedOption(item, selectedServices[item.key]) })),
    [selectedServices],
  );

  const monthlyTotal = useMemo(
    () => selectedItems.reduce((sum, { item, option }) => {
      if (!enabled[item.key]) {
        return sum;
      }

      return sum + costs[item.key] * exchangeToUsd[option.currency];
    }, 0),
    [costs, enabled, selectedItems],
  );

  const seasonalTotal = monthlyTotal * months;
  const fullYearTotal = monthlyTotal * 12;

  const recommendation =
    monthlyTotal >= 55
      ? "Your stack is getting expensive. Check whether you are paying for overlapping rights before adding another service."
      : monthlyTotal >= 25
        ? "This is a moderate tennis stack. It may be worth keeping during busy months and pausing in quieter weeks."
        : "This is a lean setup. The main risk is missing Grand Slam or country-specific rights, so verify the exact tournament before match day.";

  return (
    <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-neutral-950 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Interactive planner</p>
          <h2 className="mt-2 text-3xl font-black">Estimate your tennis streaming cost</h2>
          <p className="mt-3 leading-7 text-neutral-700">
            Choose the legal services you are considering. Known prices come from the shared broadcaster database; custom values are for providers that still need checkout verification.
          </p>
          <p className="mt-3 rounded-2xl border border-emerald-200 bg-white/80 p-3 text-sm leading-6 text-neutral-700">
            Prices are planning estimates, not live billing data. Streaming rights and offers change by country, season and platform, so always confirm the final price on the provider checkout page.
          </p>

          <div className="mt-6 space-y-4">
            {selectedItems.map(({ item, option }) => {
              const isCustom = option.id.includes("custom") || option.id === "sports-pack-custom";

              return (
                <div key={item.key} className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={enabled[item.key]}
                      onChange={(event) => setEnabled((current) => ({ ...current, [item.key]: event.target.checked }))}
                      className="mt-1 h-5 w-5 accent-emerald-600"
                    />
                    <span className="flex-1">
                      <span className="block font-black">{item.label}</span>
                      <span className="mt-1 block text-sm leading-6 text-neutral-600">{item.help}</span>
                    </span>
                  </label>

                  <label className="mt-4 block">
                    <span className="text-sm font-bold text-neutral-600">Service</span>
                    <select
                      value={selectedServices[item.key]}
                      onChange={(event) => {
                        const nextOption = getSelectedOption(item, event.target.value);

                        setSelectedServices((current) => ({ ...current, [item.key]: nextOption.id }));
                        setCosts((current) => ({ ...current, [item.key]: nextOption.monthlyCost }));
                      }}
                      className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 font-bold"
                      aria-label={`${item.label} service`}
                    >
                      {item.options.map((serviceOption) => (
                        <option key={serviceOption.id} value={serviceOption.id}>
                          {serviceOption.name} - {serviceOption.currency} {serviceOption.monthlyCost}/mo
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p className="text-sm leading-6 text-neutral-600">{option.coverageNote}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{option.priceNote}</p>
                    </div>
                    <label className="block">
                      <span className="text-sm font-bold text-neutral-600">Monthly cost</span>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-xl bg-neutral-100 px-3 py-2 text-sm font-black">{option.currency}</span>
                        <input
                          type="number"
                          min="0"
                          max="300"
                          step="1"
                          value={costs[item.key]}
                          onChange={(event) => setCosts((current) => ({ ...current, [item.key]: Number(event.target.value) || 0 }))}
                          className="w-28 rounded-xl border border-neutral-300 bg-white px-3 py-2 font-bold"
                          aria-label={`${item.label} monthly cost`}
                          readOnly={!isCustom}
                        />
                      </div>
                      {!isCustom ? (
                        <span className="mt-1 block text-xs text-neutral-500">Auto-filled from broadcaster database</span>
                      ) : (
                        <span className="mt-1 block text-xs text-neutral-500">Editable custom estimate</span>
                      )}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-neutral-200 bg-white p-6">
          <h3 className="text-2xl font-black">Your estimate</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-neutral-950 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">Monthly</p>
              <p className="mt-2 text-4xl font-black">{formatMoney(monthlyTotal)}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-300">Converted to USD for one simple comparison. Local checkout prices may differ.</p>
            </div>
            <label className="block">
              <span className="text-sm font-black text-neutral-700">Months you keep the setup</span>
              <input
                type="range"
                min="1"
                max="12"
                value={months}
                onChange={(event) => setMonths(Number(event.target.value))}
                className="mt-3 w-full accent-emerald-600"
              />
              <span className="mt-1 block text-sm text-neutral-600">{months} month{months === 1 ? "" : "s"}</span>
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Selected period</p>
                <p className="text-2xl font-black">{formatMoney(seasonalTotal)}</p>
              </div>
              <div className="rounded-2xl border bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Full year</p>
                <p className="text-2xl font-black">{formatMoney(fullYearTotal)}</p>
              </div>
            </div>
            <div className="rounded-2xl border bg-neutral-50 p-4">
              <p className="text-sm font-black text-neutral-700">Selected services</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                {selectedItems
                  .filter(({ item }) => enabled[item.key])
                  .map(({ item, option }) => (
                    <li key={item.key} className="flex justify-between gap-3">
                      <span>{option.name}</span>
                      <span className="font-black text-neutral-900">{option.currency} {costs[item.key]}/mo</span>
                    </li>
                  ))}
              </ul>
            </div>
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-neutral-700">
              {recommendation}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {eventProfiles.map((profile) => (
          <div key={profile.label} className="rounded-2xl border border-emerald-100 bg-white p-4">
            <h3 className="font-black">{profile.label}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{profile.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

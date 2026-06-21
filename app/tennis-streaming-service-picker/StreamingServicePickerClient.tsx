"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type CountryKey =
  | "us"
  | "uk"
  | "canada"
  | "australia"
  | "poland"
  | "germany"
  | "france"
  | "italy"
  | "spain"
  | "netherlands"
  | "ireland"
  | "other";
type GoalKey = "weekly" | "grand-slam" | "player" | "free" | "travel";
type SlamKey = "australian-open" | "roland-garros" | "wimbledon" | "us-open";
type BudgetKey = "low" | "medium" | "premium";

type ExternalSource = {
  label: string;
  href: string;
  note: string;
};

type Country = {
  id: CountryKey;
  label: string;
  weeklyServices: string[];
  weeklySource: ExternalSource;
  internalLink: string;
};

type Goal = {
  id: GoalKey;
  label: string;
  recommendation: string;
  warning: string;
};

type Slam = {
  id: SlamKey;
  label: string;
  officialSource: ExternalSource;
  advice: string;
  warning: string;
  countryBroadcasters: Partial<Record<CountryKey, string[]>>;
};

type Budget = {
  id: BudgetKey;
  label: string;
  advice: string;
};

const atpSource: ExternalSource = {
  label: "Official ATP TV schedule",
  href: "https://www.atptour.com/en/tournaments/tv-schedule",
  note: "Use this for weekly ATP tournaments. Select your country and then confirm the tournament week.",
};

const countries: Country[] = [
  {
    id: "us",
    label: "United States",
    weeklyServices: ["Tennis Channel", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/watch-tennis-in-usa",
  },
  {
    id: "uk",
    label: "United Kingdom",
    weeklyServices: ["Sky Sports", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/watch-tennis-in-uk",
  },
  {
    id: "canada",
    label: "Canada",
    weeklyServices: ["TSN/RDS", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/watch-tennis-in-canada",
  },
  {
    id: "australia",
    label: "Australia",
    weeklyServices: ["beIN Sports", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/watch-tennis-in-australia",
  },
  {
    id: "poland",
    label: "Poland",
    weeklyServices: ["Polsat for many ATP weeks", "Tennis TV for ATP streaming", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "germany",
    label: "Germany",
    weeklyServices: ["Sky/WOW", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "france",
    label: "France",
    weeklyServices: ["beIN Sports", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "italy",
    label: "Italy",
    weeklyServices: ["Sky Sport/NOW", "SuperTennis", "Tennis TV for ATP"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "spain",
    label: "Spain",
    weeklyServices: ["Movistar Plus+", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "netherlands",
    label: "Netherlands",
    weeklyServices: ["Ziggo Sport", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "ireland",
    label: "Ireland",
    weeklyServices: ["Sky Sports", "Tennis TV for ATP", "tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/tennis-tv-broadcast-finder",
  },
  {
    id: "other",
    label: "Another country",
    weeklyServices: ["Official ATP TV schedule", "Tennis TV", "official tournament broadcaster pages"],
    weeklySource: atpSource,
    internalLink: "/official-tennis-broadcasters-guide",
  },
];

const goals: Goal[] = [
  {
    id: "weekly",
    label: "Weekly ATP/WTA events",
    recommendation: "Start with the official tour broadcaster list, then check the exact tournament week before subscribing.",
    warning: "ATP, WTA and Grand Slam coverage are not the same product, so do not assume one subscription covers everything.",
  },
  {
    id: "grand-slam",
    label: "Grand Slams",
    recommendation: "Choose the exact Slam. The picker will show tournament-specific official sources and likely services to check.",
    warning: "Grand Slam rights are usually separate from weekly tour coverage.",
  },
  {
    id: "player",
    label: "One favorite player",
    recommendation: "Use the match schedule first, then pay only for the tournament where that player is actually entered.",
    warning: "A player can withdraw, lose early or play on a court not covered by every broadcaster.",
  },
  {
    id: "free",
    label: "Free legal options",
    recommendation: "Start with official free-to-air broadcasters, tournament YouTube channels and official live blogs.",
    warning: "Free legal live video is usually limited by country, tournament and court.",
  },
  {
    id: "travel",
    label: "Watching while traveling",
    recommendation: "Check your provider’s roaming rules and the official broadcaster list for your destination country.",
    warning: "A VPN can protect hotel Wi-Fi, but it should not be treated as a replacement for legal access.",
  },
];

const slams: Slam[] = [
  {
    id: "australian-open",
    label: "Australian Open",
    officialSource: {
      label: "Australian Open broadcast partners",
      href: "https://ausopen.com/broadcasters",
      note: "Official AO page with regional broadcast partners. Use it to verify your country before paying.",
    },
    advice: "For Europe, start by checking Eurosport/discovery+ coverage and then confirm your exact country on the official AO broadcaster page.",
    warning: "Australian Open matches can be overnight for Europe and North America, so replay access matters.",
    countryBroadcasters: {
      us: ["ESPN", "Tennis Channel", "AO official broadcaster page"],
      uk: ["Eurosport/discovery+", "AO official broadcaster page"],
      canada: ["TSN/RDS", "AO official broadcaster page"],
      australia: ["Nine/9Now", "Stan Sport", "AO official broadcaster page"],
      poland: ["Eurosport/discovery+", "AO official broadcaster page"],
      germany: ["Eurosport/discovery+", "AO official broadcaster page"],
      france: ["Eurosport/discovery+", "AO official broadcaster page"],
      italy: ["Eurosport/discovery+", "AO official broadcaster page"],
      spain: ["Eurosport/discovery+", "AO official broadcaster page"],
      netherlands: ["Eurosport/discovery+", "AO official broadcaster page"],
      ireland: ["Eurosport/discovery+", "AO official broadcaster page"],
    },
  },
  {
    id: "roland-garros",
    label: "Roland Garros",
    officialSource: {
      label: "Roland-Garros broadcasters",
      href: "https://www.rolandgarros.com/en-us/broadcasters",
      note: "Official Roland-Garros broadcaster page. Use it first because rights can change by territory.",
    },
    advice: "Check the official Roland-Garros broadcaster page first, then verify whether your option includes outside courts and night sessions.",
    warning: "Do not assume a general tennis service includes Roland Garros live matches.",
    countryBroadcasters: {
      us: ["TNT Sports/HBO Max style coverage", "Roland-Garros official broadcaster page"],
      uk: ["TNT Sports", "HBO Max", "Roland-Garros official broadcaster page"],
      canada: ["TSN/RDS", "Roland-Garros official broadcaster page"],
      australia: ["Stan Sport", "Roland-Garros official broadcaster page"],
      poland: ["Eurosport/discovery+", "Roland-Garros official broadcaster page"],
      germany: ["Eurosport/discovery+", "Roland-Garros official broadcaster page"],
      france: ["France Télévisions", "Prime Video for selected sessions", "Roland-Garros official broadcaster page"],
      italy: ["Eurosport/discovery+", "Roland-Garros official broadcaster page"],
      spain: ["Eurosport/discovery+", "Roland-Garros official broadcaster page"],
      netherlands: ["Eurosport/discovery+", "Roland-Garros official broadcaster page"],
      ireland: ["TNT Sports", "HBO Max", "Roland-Garros official broadcaster page"],
    },
  },
  {
    id: "wimbledon",
    label: "Wimbledon",
    officialSource: {
      label: "Wimbledon TV coverage",
      href: "https://www.wimbledon.com/en_GB/about/tv_coverage",
      note: "Official Wimbledon TV coverage page with country-by-country broadcasters.",
    },
    advice: "Open Wimbledon’s official TV coverage page and check your country. For Poland, Wimbledon lists Telewizja Polsat.",
    warning: "Wimbledon is especially broadcaster-specific, so verify your country before buying anything.",
    countryBroadcasters: {
      us: ["ESPN", "Wimbledon official TV coverage page"],
      uk: ["BBC/iPlayer", "Wimbledon official TV coverage page"],
      canada: ["TSN/RDS", "Wimbledon official TV coverage page"],
      australia: ["Nine/9Now", "Stan Sport", "Wimbledon official TV coverage page"],
      poland: ["Telewizja Polsat", "Wimbledon official TV coverage page"],
      germany: ["Prime Video", "Wimbledon official TV coverage page"],
      france: ["beIN Sports", "Wimbledon official TV coverage page"],
      italy: ["Sky Sport/NOW", "Wimbledon official TV coverage page"],
      spain: ["Movistar Plus+", "Wimbledon official TV coverage page"],
      netherlands: ["Ziggo Sport", "Wimbledon official TV coverage page"],
      ireland: ["BBC/iPlayer where available", "Wimbledon official TV coverage page"],
    },
  },
  {
    id: "us-open",
    label: "US Open",
    officialSource: {
      label: "US Open international broadcast partners",
      href: "https://www.usopen.org/en_US/about/tv_intl.html",
      note: "Official US Open international broadcast partner page. Check your territory before subscribing.",
    },
    advice: "Check the official US Open broadcast partner page, then verify night-session coverage and replay access.",
    warning: "US Open access often depends on local sports rights, not only a tennis-only subscription.",
    countryBroadcasters: {
      us: ["ESPN", "US Open official broadcast partners page"],
      uk: ["Sky Sports", "US Open official broadcast partners page"],
      canada: ["TSN/RDS", "US Open official broadcast partners page"],
      australia: ["Nine/9Now", "US Open official broadcast partners page"],
      poland: ["Eurosport/discovery+", "US Open official broadcast partners page"],
      germany: ["Sportdeutschland.TV", "US Open official broadcast partners page"],
      france: ["Eurosport/discovery+", "US Open official broadcast partners page"],
      italy: ["SuperTennis", "US Open official broadcast partners page"],
      spain: ["Movistar Plus+", "US Open official broadcast partners page"],
      netherlands: ["Ziggo Sport", "US Open official broadcast partners page"],
      ireland: ["Sky Sports", "US Open official broadcast partners page"],
    },
  },
];

const budgets: Budget[] = [
  {
    id: "low",
    label: "Lowest possible cost",
    advice: "Avoid annual plans until you know which tournaments you truly watch. Subscribe around major weeks, then cancel.",
  },
  {
    id: "medium",
    label: "Balanced setup",
    advice: "Use one regular tennis service plus short-term add-ons for Slams or special tournaments.",
  },
  {
    id: "premium",
    label: "Maximum coverage",
    advice: "Combine a tour service, a TV bundle and tournament-specific broadcasters, but verify overlap before paying twice.",
  },
];

function getSelected<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id) ?? items[0];
}

function ExternalSourceLink({ source }: { source: ExternalSource }) {
  return (
    <a
      href={source.href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-black hover:bg-emerald-300"
    >
      Open official source ↗
    </a>
  );
}

export default function StreamingServicePickerClient() {
  const [countryId, setCountryId] = useState<CountryKey>("poland");
  const [goalId, setGoalId] = useState<GoalKey>("grand-slam");
  const [slamId, setSlamId] = useState<SlamKey>("wimbledon");
  const [budgetId, setBudgetId] = useState<BudgetKey>("medium");

  const plan = useMemo(() => {
    const country = getSelected(countries, countryId);
    const goal = getSelected(goals, goalId);
    const slam = getSelected(slams, slamId);
    const budget = getSelected(budgets, budgetId);
    const isGrandSlam = goal.id === "grand-slam";
    const services = isGrandSlam
      ? slam.countryBroadcasters[country.id] ?? [slam.officialSource.label]
      : country.weeklyServices;
    const source = isGrandSlam ? slam.officialSource : country.weeklySource;

    const steps = [
      `Open the official source below and confirm ${country.label} before paying.`,
      `Check whether the package includes live matches, outside courts, replays and local-language commentary.`,
      isGrandSlam ? slam.advice : budget.advice,
      isGrandSlam ? slam.warning : goal.warning,
    ];

    return { country, goal, slam, budget, isGrandSlam, services, source, steps };
  }, [countryId, goalId, slamId, budgetId]);

  return (
    <section className="rounded-[2rem] border border-emerald-900 bg-emerald-950/20 p-6 shadow-2xl">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block rounded-2xl border border-zinc-800 bg-black/50 p-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Country</span>
          <select
            value={countryId}
            onChange={(event) => setCountryId(event.target.value as CountryKey)}
            className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm font-bold text-white"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.label}</option>
            ))}
          </select>
        </label>

        <label className="block rounded-2xl border border-zinc-800 bg-black/50 p-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Watching goal</span>
          <select
            value={goalId}
            onChange={(event) => setGoalId(event.target.value as GoalKey)}
            className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm font-bold text-white"
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>{goal.label}</option>
            ))}
          </select>
        </label>

        {plan.isGrandSlam ? (
          <label className="block rounded-2xl border border-zinc-800 bg-black/50 p-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Grand Slam</span>
            <select
              value={slamId}
              onChange={(event) => setSlamId(event.target.value as SlamKey)}
              className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm font-bold text-white"
            >
              {slams.map((slam) => (
                <option key={slam.id} value={slam.id}>{slam.label}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="block rounded-2xl border border-zinc-800 bg-black/50 p-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Budget style</span>
            <select
              value={budgetId}
              onChange={(event) => setBudgetId(event.target.value as BudgetKey)}
              className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm font-bold text-white"
            >
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>{budget.label}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-900 bg-black/40 p-4 text-sm leading-7 text-zinc-300">
        <strong className="text-emerald-300">Source-first recommendation:</strong> this picker now shows the service candidates and the official page to verify them. Tennis rights change, so the official source should be the last check before payment.
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-emerald-800 bg-black/60 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Recommended starting point</p>
          <h2 className="mt-3 text-3xl font-black text-white">
            {plan.isGrandSlam ? `${plan.slam.label} in ${plan.country.label}` : `${plan.goal.label} in ${plan.country.label}`}
          </h2>
          <p className="mt-4 leading-8 text-zinc-300">
            {plan.isGrandSlam ? plan.slam.advice : plan.goal.recommendation}
          </p>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Check these first</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {plan.services.map((service) => (
                <span key={service} className="rounded-full border border-zinc-700 bg-black px-3 py-2 text-xs font-black text-zinc-200">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Official verification source</p>
            <h3 className="mt-3 text-xl font-black text-white">{plan.source.label}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{plan.source.note}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ExternalSourceLink source={plan.source} />
            <Link href="/tennis-streaming-cost-calculator" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-emerald-300">
              Estimate monthly cost →
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Before you pay</p>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
            {plan.steps.map((step) => (
              <li key={step} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">{step}</li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl border border-emerald-900 bg-emerald-950/20 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Useful next action</p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              After opening the official source, search the page for <strong>{plan.country.label}</strong> and then check your service’s cancellation terms.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

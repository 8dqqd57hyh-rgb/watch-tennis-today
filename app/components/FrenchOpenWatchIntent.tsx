import Link from "next/link";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

const intentCards = [
  {
    eyebrow: "Live now",
    title: "I want to watch a match now",
    text: "Start with live matches, then jump to the broadcaster guide if the match is available in your country.",
    href: "/french-open-live",
    cta: "Open live matches",
  },
  {
    eyebrow: "Today",
    title: "I want to know what plays next",
    text: "Use today's schedule to find upcoming Roland Garros matches and plan when to come back.",
    href: "/french-open-today",
    cta: "See today’s matches",
  },
  {
    eyebrow: "Country guide",
    title: "I need the legal broadcaster",
    text: "Check official French Open TV and streaming options by country before choosing a service.",
    href: "/where-to-watch-french-open",
    cta: "Find where to watch",
  },
  {
    eyebrow: "Schedule path",
    title: "I follow a player, not a schedule",
    text: "Track who is still in the schedule, next opponents and the matches that matter most.",
    href: "/french-open-schedule",
    cta: "Open schedule tracker",
  },
];

export default function FrenchOpenWatchIntent({ compact = false }: { compact?: boolean }) {
  return (
    <section
      data-track-area="french-open-watch-intent"
      className="my-10 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-orange-950/35 via-zinc-950 to-black p-6 text-white"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-orange-300">
            Watch intent router
          </p>
          <h2 className="text-3xl font-black md:text-4xl">
            What do you want to do at Roland Garros?
          </h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            Send visitors to the right high-intent page quickly: live matches,
            today’s schedule, the active schedule or official broadcaster guides.
          </p>
        </div>

        <Link
          href="/where-to-watch-french-open"
          data-track-category="money_internal"
          data-track-id="watch_intent_primary_broadcaster"
          className="rounded-2xl bg-orange-500 px-5 py-4 text-center font-black text-black transition hover:bg-orange-400"
        >
          Where to watch French Open →
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {intentCards.slice(0, compact ? 3 : intentCards.length).map((card) => (
          <Link
            key={card.href}
            href={card.href}
            data-track-category="intent_internal"
            data-track-id={`watch_intent_${card.href.replace(/\//g, "_")}`}
            className="rounded-3xl border border-zinc-800 bg-black/60 p-5 transition hover:border-orange-400 hover:bg-zinc-900"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-300">
              {card.eyebrow}
            </p>
            <h3 className="mb-3 text-xl font-black leading-tight">{card.title}</h3>
            <p className="mb-5 text-sm leading-6 text-zinc-400">{card.text}</p>
            <span className="text-sm font-black text-orange-200">{card.cta} →</span>
          </Link>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-zinc-800 bg-black/50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-zinc-200">
              Traveling or using public Wi‑Fi during the tournament?
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Compare VPN options for privacy/travel access to your own legal streaming subscriptions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/best-vpn-for-roland-garros"
              data-track-category="money_internal"
              data-track-id="watch_intent_vpn_guide"
              className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-black transition hover:border-orange-400"
            >
              VPN guide
            </Link>
            <a
              href={affiliateLinks.nordvpn}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              data-track-category="affiliate"
              data-track-id="watch_intent_nordvpn"
              className="rounded-2xl border border-orange-500/50 px-4 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black"
            >
              View VPN deal
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

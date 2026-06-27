import Link from "next/link";

const wimbledonFacts = [
  { label: "Main Championships", value: "29 Jun - 12 Jul 2026" },
  { label: "Qualifying", value: "22 - 25 Jun 2026" },
  { label: "Prize money", value: "GBP64.2m total" },
  { label: "Singles champions", value: "GBP3.6m each" },
];

const planningLinks = [
  { href: "/wimbledon-live", label: "Live hub" },
  { href: "/wimbledon-schedule", label: "Schedule" },
  { href: "/wimbledon-order-of-play", label: "Order of play" },
  { href: "/where-to-watch-wimbledon", label: "Where to watch" },
  { href: "/wimbledon-results", label: "Results" },
];

const drawLinks = [
  {
    href: "https://www.wimbledon.com/en_GB/draws/index.html",
    label: "Wimbledon draws",
  },
  {
    href: "https://www.atptour.com/en/scores/current/wimbledon/540/draws",
    label: "ATP singles draw",
  },
  {
    href: "https://www.wtatennis.com/tournaments/wimbledon/draws",
    label: "WTA singles draw",
  },
];

const drawHighlights = [
  {
    title: "Sinner and Djokovic",
    body: "Jannik Sinner and Novak Djokovic are in the same half, creating a possible semi-final route.",
  },
  {
    title: "Fritz vs Draper",
    body: "Taylor Fritz and Jack Draper drew one of the headline first-round men's matches.",
  },
  {
    title: "Swiatek and Serena",
    body: "Wimbledon previews a possible Iga Swiatek vs Serena Williams third-round meeting.",
  },
  {
    title: "Women's top line",
    body: "Aryna Sabalenka opens the WTA draw as the No. 1 seed, with Swiatek defending the title.",
  },
];

const wimbledonUpdates = [
  "The official schedule lists 14 Championship days, with the main draw opening on Monday, June 29.",
  "Official TV coverage varies by territory, so match-day checks should start with Wimbledon broadcaster listings.",
  "The 2026 fund is listed at GBP64,200,000, with equal GBP3,600,000 singles champion payouts.",
  "Electronic Line Calling is in use across courts, with additional scoreboard indicators for out and fault calls.",
  "Video Review technology is part of the 2026 on-court operations update.",
  "Entry lists, wild cards, draws and daily order of play should be treated as live sources during the fortnight.",
];

const officialSources = [
  {
    href: "https://www.wimbledon.com/en_GB/the_championships/schedule",
    label: "Official schedule",
  },
  {
    href: "https://www.wimbledon.com/en_GB/about/tv_coverage",
    label: "Official TV coverage",
  },
  {
    href: "https://www.wimbledon.com/en_GB/the_championships/prize_money_and_finance",
    label: "Prize money",
  },
  {
    href: "https://www.wimbledon.com/en_GB/news/whats-new-for-wimbledon-2026",
    label: "What's new",
  },
  {
    href: "https://www.wimbledon.com/en_GB/news/wimbledon_2026_mens_singles_draw_preview",
    label: "Men's draw preview",
  },
  {
    href: "https://www.wimbledon.com/en_GB/news/wimbledon_2026_womens_singles_draw_preview",
    label: "Women's draw preview",
  },
];

export default function HomepageWimbledonBanner() {
  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-green-500/50 bg-[#07150d] text-white shadow-2xl shadow-black/30">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-5 md:p-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-green-300">
            Wimbledon 2026 command center
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            Wimbledon starts Monday. Plan the fortnight before the first ball.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 md:text-base">
            Main-draw tennis runs from June 29 to July 12, 2026. Use this hub to jump from
            today&apos;s matches into the official order of play, legal broadcast checks, draw
            context and result tracking without digging through expired qualifying links.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {wimbledonFacts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-green-300">{fact.label}</p>
                <p className="mt-2 text-xl font-black text-white">{fact.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {planningLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  index === 0
                    ? "rounded-full bg-green-400 px-4 py-2 text-sm font-black text-black hover:bg-green-300"
                    : "rounded-full border border-white/15 px-4 py-2 text-sm font-black text-zinc-100 hover:border-green-400"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative min-h-[340px] border-t border-white/10 bg-green-950/60 p-5 lg:border-l lg:border-t-0 md:p-7">
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-x-8 top-8 bottom-8 rounded-[28px] border-2 border-white/30" />
            <div className="absolute left-1/2 top-8 bottom-8 w-px bg-white/30" />
            <div className="absolute left-8 right-8 top-1/2 h-px bg-white/30" />
            <div className="absolute left-[22%] top-8 bottom-8 w-px bg-white/20" />
            <div className="absolute right-[22%] top-8 bottom-8 w-px bg-white/20" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0,transparent_34%,rgba(74,222,128,0.12)_100%)]" />
          </div>

          <div className="relative">
            <div className="mb-4 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-300">Draw watch</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {drawHighlights.map((item) => (
                  <article key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <h3 className="text-sm font-black text-white">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-300">{item.body}</p>
                  </article>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {drawLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-green-300/25 bg-green-300/10 px-3 py-2 text-xs font-black text-green-100 hover:border-green-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-300">2026 notes</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-zinc-200">
                {wimbledonUpdates.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                Official source checks
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {officialSources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-3 py-2 text-xs font-black text-zinc-100 hover:border-green-400"
                  >
                    {source.label}
                  </a>
                ))}
              </div>
              <p className="mt-3 text-xs font-bold text-zinc-500">Checked June 27, 2026.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

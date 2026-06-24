import Link from "next/link";

type HubLink = {
  href: string;
  title: string;
  description: string;
  label?: string;
};

type TennisNavigationHubProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  links?: HubLink[];
  dark?: boolean;
  className?: string;
};

const DEFAULT_LINKS: HubLink[] = [
  {
    href: "/live-tennis",
    title: "Live tennis today",
    description: "Follow ATP and WTA matches that are live, starting soon or finished today.",
    label: "Live hub",
  },
  {
    href: "/today",
    title: "Today’s tennis schedule",
    description: "Plan the day with live, upcoming and completed tennis matches in one place.",
    label: "Schedule",
  },
  {
    href: "/tennis-on-tv-today",
    title: "Tennis on TV today",
    description: "Check legal TV and streaming paths before match time.",
    label: "Viewing",
  },
  {
    href: "/players",
    title: "Player pages",
    description: "Browse player schedules, next matches and related match pages.",
    label: "Players",
  },
  {
    href: "/tournament",
    title: "Tournament pages",
    description: "Find tournament schedules, live matches, results and watch guides.",
    label: "Tournaments",
  },
  {
    href: "/tennis-guides",
    title: "Tennis guides",
    description: "Learn how schedules, streaming rights, scores and tournament levels work.",
    label: "Guides",
  },
];

export function tennisHubLinks(overrides: HubLink[] = []) {
  const seen = new Set<string>();
  return [...overrides, ...DEFAULT_LINKS].filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export default function TennisNavigationHub({
  title = "What to watch next",
  eyebrow = "Keep browsing",
  description = "Use these internal links to move between live scores, schedules, player pages, tournament pages and legal viewing guides without hitting a dead end.",
  links = DEFAULT_LINKS,
  dark = true,
  className = "",
}: TennisNavigationHubProps) {
  const items = tennisHubLinks(links).slice(0, 8);

  const shellClass = dark
    ? "border-zinc-800 bg-zinc-950 text-white"
    : "border-zinc-200 bg-white text-zinc-950";
  const eyebrowClass = dark ? "text-emerald-300" : "text-emerald-700";
  const descriptionClass = dark ? "text-zinc-400" : "text-zinc-600";
  const cardClass = dark
    ? "border-zinc-800 bg-black text-zinc-300 hover:border-emerald-400 hover:text-white"
    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-500 hover:text-zinc-950";
  const labelClass = dark ? "text-zinc-500" : "text-zinc-500";

  return (
    <section className={`rounded-3xl border p-6 md:p-8 ${shellClass} ${className}`} data-testid="tennis-navigation-hub">
      <p className={`text-xs font-black uppercase tracking-[0.2em] ${eyebrowClass}`}>{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black md:text-3xl">{title}</h2>
      <p className={`mt-3 max-w-3xl leading-7 ${descriptionClass}`}>{description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-2xl border p-4 transition ${cardClass}`}
            data-testid="navigation-hub-link"
          >
            {link.label ? (
              <span className={`mb-2 block text-xs font-black uppercase tracking-[0.18em] ${labelClass}`}>
                {link.label}
              </span>
            ) : null}
            <span className="block font-black">{link.title}</span>
            <span className="mt-2 block text-sm leading-6 opacity-80">{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

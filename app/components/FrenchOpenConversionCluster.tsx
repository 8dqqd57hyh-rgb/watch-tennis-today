import Link from "next/link";

const clusters = [
  {
    eyebrow: "Catch up",
    title: "Yesterday, today, tomorrow",
    description:
      "Move visitors through the daily French Open loop instead of letting them leave after one result page.",
    links: [
      ["Yesterday’s recap", "/roland-garros-recap"],
      ["French Open today", "/french-open"],
      ["Tomorrow’s schedule", "/tomorrow"],
    ],
  },
  {
    eyebrow: "Watch legally",
    title: "TV and streaming intent",
    description:
      "Send high-intent visitors toward broadcaster, country and safe streaming pages that can monetize better.",
    links: [
      ["TV schedule", "/where-to-watch-french-open"],
      ["Where to watch", "/where-to-watch-french-open"],
      ["Streaming countries", "/where-to-watch-french-open"],
    ],
  },
  {
    eyebrow: "Follow the tournament",
    title: "Schedule and results context",
    description:
      "Give users the bracket context they search for after a match: results, schedule paths and upcoming order of play.",
    links: [
      ["French Open results", "/french-open-results"],
      ["French Open schedule", "/french-open-order-of-play"],
      ["Order of play", "/french-open-order-of-play"],
    ],
  },
];

type FrenchOpenConversionClusterProps = {
  compact?: boolean;
  title?: string;
};

export default function FrenchOpenConversionCluster({
  compact = false,
  title = "French Open fan hub",
}: FrenchOpenConversionClusterProps) {
  return (
    <section className={`${compact ? "my-8" : "mb-12"} rounded-[2rem] border border-orange-500/30 bg-gradient-to-br from-orange-950/35 via-zinc-950 to-black p-6 text-white`}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-orange-300">
            Internal money path
          </p>
          <h2 className="text-3xl font-black md:text-4xl">{title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            A single hub that connects daily match intent, official broadcaster
            intent and tournament-following intent — the three paths most likely
            to create repeat visits and affiliate clicks.
          </p>
        </div>

        <Link
          href="/french-open"
          className="rounded-2xl border border-orange-500/60 px-5 py-3 text-sm font-black text-orange-200 transition hover:border-orange-300 hover:text-orange-100"
        >
          Open full hub →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <div
            key={cluster.title}
            className="rounded-3xl border border-zinc-800 bg-black/55 p-5"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-300">
              {cluster.eyebrow}
            </p>
            <h3 className="mb-3 text-2xl font-black">{cluster.title}</h3>
            <p className="mb-5 leading-7 text-zinc-400">{cluster.description}</p>

            <div className="grid gap-3">
              {cluster.links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 font-bold text-zinc-200 transition hover:border-orange-400 hover:text-white"
                >
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

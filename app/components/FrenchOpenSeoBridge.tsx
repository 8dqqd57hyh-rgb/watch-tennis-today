import Link from "next/link";

const intentCards = [
  {
    eyebrow: "Missed yesterday",
    title: "Roland Garros recap",
    text: "See who advanced, who was eliminated and which completed matches mattered most.",
    href: "/roland-garros-recap",
  },
  {
    eyebrow: "Watching today",
    title: "French Open today",
    text: "Jump to live, upcoming and completed Roland Garros matches from the current day.",
    href: "/french-open",
  },
  {
    eyebrow: "Planning ahead",
    title: "Tomorrow’s schedule",
    text: "Check the next matches early and decide what is worth watching before the day starts.",
    href: "/tomorrow",
  },
  {
    eyebrow: "Legal streaming",
    title: "Where to watch",
    text: "Find official French Open broadcasters and streaming options by location.",
    href: "/where-to-watch-french-open",
  },
];

export default function FrenchOpenSeoBridge({ compact = false }: { compact?: boolean }) {
  return (
    <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-300">
            French Open search hub
          </p>
          <h2 className="text-3xl font-black">
            Fast paths for every Roland Garros fan intent
          </h2>
          {!compact ? (
            <p className="mt-3 max-w-3xl leading-8 text-zinc-400">
              This block keeps visitors moving between yesterday, today,
              tomorrow and legal streaming pages instead of leaving after one
              result check.
            </p>
          ) : null}
        </div>
        <Link
          href="/french-open"
          className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold transition hover:border-orange-400"
        >
          Open French Open hub →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {intentCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-zinc-800 bg-black p-5 transition hover:border-orange-400 hover:bg-zinc-900"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-500">
              {card.eyebrow}
            </p>
            <h3 className="mb-3 text-xl font-black">{card.title}</h3>
            <p className="leading-7 text-zinc-400">{card.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

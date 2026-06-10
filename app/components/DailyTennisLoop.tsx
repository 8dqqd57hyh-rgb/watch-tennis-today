type DailyTennisLoopProps = {
  tournamentName?: string;
  compact?: boolean;
};

const dailyLinks = [
  {
    label: "Yesterday",
    title: "Roland Garros Recap",
    description: "Who advanced, who went out and the biggest finished matches.",
    href: "/roland-garros-recap",
    accent: "orange",
  },
  {
    label: "Today",
    title: "French Open Today",
    description: "Live matches, current schedule and official viewing links.",
    href: "/french-open",
    accent: "green",
  },
  {
    label: "Tomorrow",
    title: "Tomorrow’s Schedule",
    description: "Plan what to watch next before the order of play gets busy.",
    href: "/tomorrow",
    accent: "blue",
  },
  {
    label: "Schedule",
    title: "French Open Schedule",
    description: "Follow player paths, next opponents and bracket context.",
    href: "/french-open-order-of-play",
    accent: "purple",
  },
];

const accentClasses: Record<string, string> = {
  orange: "border-orange-500/40 hover:border-orange-400 text-orange-300",
  green: "border-green-500/40 hover:border-green-400 text-green-300",
  blue: "border-blue-500/40 hover:border-blue-400 text-blue-300",
  purple: "border-purple-500/40 hover:border-purple-400 text-purple-300",
};

export default function DailyTennisLoop({
  tournamentName = "Roland Garros",
  compact = false,
}: DailyTennisLoopProps) {
  return (
    <section className={`${compact ? "my-8" : "mb-12"} rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 text-white`}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-orange-300">
            Daily tennis loop
          </p>
          <h2 className="text-3xl font-black md:text-4xl">
            Missed a day? Jump between yesterday, today and tomorrow
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Keep {tournamentName} visitors moving through the site with one clear path: catch up, check today, plan tomorrow, then verify where to watch legally.
          </p>
        </div>

        <a
          href="/where-to-watch-french-open"
          className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-black transition hover:border-orange-400"
        >
          TV schedule →
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dailyLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`rounded-3xl border bg-black/50 p-5 transition ${accentClasses[item.accent]}`}
          >
            <p className="mb-3 text-sm font-black uppercase tracking-widest">
              {item.label}
            </p>
            <h3 className="mb-3 text-2xl font-black text-white">
              {item.title}
            </h3>
            <p className="leading-7 text-zinc-400">{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

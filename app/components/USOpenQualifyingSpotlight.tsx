import Link from "next/link";

const officialLinks = [
  {
    href: "https://www.usopen.org/en_US/scores/schedule/index.html",
    label: "Order of play",
  },
  {
    href: "https://www.usopen.org/en_US/draws/mens-qual-singles.html",
    label: "Men’s draw",
  },
  {
    href: "https://www.usopen.org/en_US/draws/womens-qual-singles.html",
    label: "Women’s draw",
  },
];

const firstRoundNotes = [
  "Kei Nishikori beat No. 16 seed Sebastian Ofner in three sets.",
  "Grigor Dimitrov opened with a 6–0, 6–3 win over Lorenzo Giustino.",
  "Bianca Andreescu and Zheng Qinwen both advanced in straight sets.",
  "Linda Fruhvirtova knocked out women’s top seed Polina Kudermetova.",
];

export default function USOpenQualifyingSpotlight() {
  return (
    <section
      aria-labelledby="us-open-qualifying-title"
      className="mb-6 overflow-hidden rounded-3xl border border-blue-400/35 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_42%),linear-gradient(135deg,#18181b,#09090b)] p-5 md:p-7"
      data-testid="us-open-qualifying-spotlight"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
              US Open 2026 · Qualifying
            </p>
            <span className="rounded-full bg-green-400 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-black">
              In progress
            </span>
          </div>
          <h2 id="us-open-qualifying-title" className="mt-3 text-2xl font-black md:text-4xl">
            256 players. 32 main-draw places.
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base">
            The second round is being played Wednesday, August 26, with the final
            qualifying round on Thursday. Players must win three matches to claim
            one of 16 men’s or 16 women’s singles places in the main draw.
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 text-center sm:grid-cols-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <strong className="block text-xl text-white">Aug 24–27</strong>
            <span className="text-xs text-zinc-400">Qualifying</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <strong className="block text-xl text-white">3 wins</strong>
            <span className="text-xs text-zinc-400">To qualify</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <strong className="block text-xl text-white">Courts 4–17</strong>
            <span className="text-xs text-zinc-400">New York</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <strong className="block text-xl text-white">Free entry</strong>
            <span className="text-xs text-zinc-400">Fan Access Pass</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-white/10 bg-black/30 p-4 md:p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
            First-round headlines
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-200 sm:grid-cols-2">
            {firstRoundNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-white/10 bg-black/30 p-4 md:p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
            Follow it live
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Play starts at 11:00 a.m. ET on Wednesday. In the United States,
            qualifying coverage is on ESPN platforms; international rights vary by country.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {officialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-blue-400/35 px-3 py-2 text-xs font-black text-blue-200 hover:border-blue-300 hover:text-white"
              >
                {link.label} ↗
              </a>
            ))}
            <Link
              href="/us-open"
              className="rounded-full bg-blue-400 px-3 py-2 text-xs font-black text-black hover:bg-blue-300"
            >
              US Open guide
            </Link>
          </div>
        </article>
      </div>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Updated August 26, 2026. Match order and start times can change; official US Open links above are the source of record.
      </p>
    </section>
  );
}

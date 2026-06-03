type PlayerAuthoritySectionsProps = {
  playerName: string;
  playerSlug: string;
  tour: "ATP" | "WTA";
  nationality: string;
  playingStyle: string;
  keyStrengths: string[];
  surfaces: string;
};

const countryGuides = [
  { label: "United States", href: "/watch-tennis-in/usa" },
  { label: "United Kingdom", href: "/watch-tennis-in/uk" },
  { label: "Canada", href: "/watch-tennis-in/canada" },
  { label: "Australia", href: "/watch-tennis-in/australia" },
  { label: "Germany", href: "/watch-tennis-in/germany" },
  { label: "Poland", href: "/watch-tennis-in/poland" },
];

const tournamentGuides = [
  { label: "French Open live", href: "/french-open-live" },
  { label: "French Open TV schedule", href: "/french-open-tv-schedule" },
  { label: "Grand Slam live guide", href: "/grand-slam-live" },
  { label: "Today’s tennis schedule", href: "/today" },
];

export default function PlayerAuthoritySections({
  playerName,
  playerSlug,
  tour,
  nationality,
  playingStyle,
  keyStrengths,
  surfaces,
}: PlayerAuthoritySectionsProps) {
  return (
    <>
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Player watching guide
        </p>
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          What to know before watching {playerName} live
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-500">Tour</p>
            <p className="mt-1 text-lg font-bold text-neutral-950">{tour}</p>
          </div>
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-500">Country</p>
            <p className="mt-1 text-lg font-bold text-neutral-950">{nationality}</p>
          </div>
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-500">Best surface context</p>
            <p className="mt-1 text-lg font-bold text-neutral-950">{surfaces}</p>
          </div>
        </div>
        <p className="mt-5 text-base leading-7 text-neutral-700">{playingStyle}</p>
      </section>

      <section className="rounded-3xl border bg-neutral-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          Why {playerName} matches are often high-demand streams
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {keyStrengths.map((strength) => (
            <li key={strength} className="rounded-2xl border bg-white p-4 text-base leading-7 text-neutral-700">
              <span className="font-bold text-emerald-700">✓</span> {strength}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-base leading-7 text-neutral-700">
          Demand usually rises during Grand Slams, late-round matches, prime-time sessions
          and high-profile matchups. Before paying for a subscription, check the tournament,
          court assignment, local broadcaster and start time because tennis schedules can
          move after long matches or weather delays.
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          Where to watch {playerName} by country
        </h2>
        <p className="mb-5 text-base leading-7 text-neutral-700">
          Tennis rights are territorial. Use these country guides to check official TV and
          streaming options before the match starts.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {countryGuides.map((guide) => (
            <a
              key={guide.href}
              href={guide.href}
              className="rounded-2xl border p-4 font-semibold text-neutral-900 hover:border-emerald-500 hover:bg-emerald-50"
            >
              Watch tennis in {guide.label}
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-neutral-950 p-6 text-white">
        <h2 className="mb-4 text-2xl font-bold">
          Related tennis guides for {playerName} fans
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tournamentGuides.map((guide) => (
            <a
              key={guide.href}
              href={guide.href}
              className="rounded-2xl border border-zinc-800 p-4 font-semibold text-white hover:border-emerald-400"
            >
              {guide.label}
            </a>
          ))}
          <a
            href={`/next-match/${playerSlug}`}
            className="rounded-2xl border border-zinc-800 p-4 font-semibold text-white hover:border-emerald-400"
          >
            {playerName} next match
          </a>
          <a
            href={`/watch-player-live/${playerSlug}`}
            className="rounded-2xl border border-zinc-800 p-4 font-semibold text-white hover:border-emerald-400"
          >
            {playerName} live match hub
          </a>
        </div>
      </section>
    </>
  );
}

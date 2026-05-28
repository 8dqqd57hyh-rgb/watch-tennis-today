
export const metadata = {
  title: "ATP Players",
  description: "ATP tennis players, live schedules, rankings and tournament coverage.",
};
const atpPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Daniil Medvedev",
  "Alexander Zverev",
  "Holger Rune",
  "Taylor Fritz",
  "Andrey Rublev",
  "Stefanos Tsitsipas",
  "Casper Ruud",
  "Alex de Minaur",
  "Ben Shelton",
  "Tommy Paul",
  "Frances Tiafoe",
  "Lorenzo Musetti",
];

function playerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ATPPlayersPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <a
          href="/players"
          className="text-zinc-400 hover:text-white"
        >
          ← Back to Players
        </a>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
            ATP Tour
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            ATP Tennis Players
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Follow ATP tennis players, live matches, ATP Tour schedules,
            streaming coverage and tournament updates.
          </p>
        </section>

        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {atpPlayers.map((player) => (
              <a
                key={player}
                href={`/player/${playerSlug(player)}`}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
              >
                <h2 className="text-2xl font-black mb-3">
                  {player}
                </h2>

                <p className="text-zinc-400">
                  ATP live matches, schedules and streaming coverage
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">
            🔴 ATP Live Coverage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/live-tennis"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all"
            >
              Live ATP Matches
            </a>

            <a
              href="/players/live-now"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all"
            >
              ATP Players Live Now
            </a>

            <a
              href="/tennis-trending-now"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all"
            >
              Trending Tennis Now
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

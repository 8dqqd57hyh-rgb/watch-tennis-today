
export const metadata = {
  title: "Tennis Players Directory",
  description: "Browse ATP and WTA player profiles, schedules, rankings and live match information.",
};
const players = [
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

  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
  "Elena Rybakina",
  "Jessica Pegula",
  "Ons Jabeur",
  "Maria Sakkari",
  "Jasmine Paolini",
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

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <section className="mt-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Tennis Players
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Follow ATP and WTA tennis players, live matches, streaming
            schedules, tournament coverage and player match pages.
          </p>
        </section>
        <section className="mb-14 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
  <h2 className="text-3xl font-black mb-5">
    ATP & WTA Player Hubs
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a
      href="/players/atp"
      className="bg-black border border-zinc-800 rounded-2xl p-6 font-black hover:border-green-500 transition-all"
    >
      ATP Tennis Players
    </a>

    <a
      href="/players/wta"
      className="bg-black border border-zinc-800 rounded-2xl p-6 font-black hover:border-purple-500 transition-all"
    >
      WTA Tennis Players
    </a>
  </div>
</section>

        <section className="mb-14">
          <h2 className="text-4xl font-black mb-6">
            ⭐ Popular Tennis Players
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {players.map((player) => (
             <a
  key={player}
  href={`/player/${playerSlug(player)}`}
  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
>
  <h3 className="text-2xl font-black mb-3">
    {player}
  </h3>

  <p className="text-zinc-400 mb-5">
    Live matches, schedules and streaming coverage
  </p>

  <div className="flex flex-wrap gap-3">
    <span className="inline-block bg-zinc-800 px-4 py-2 rounded-xl font-bold">
      Player Profile
    </span>

    <span className="inline-block bg-green-500 text-black px-4 py-2 rounded-xl font-black">
      Watch Live →
    </span>
  </div>
</a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">
            🔴 Live Tennis Coverage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/live-tennis"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all"
            >
              Live Tennis Today
            </a>

            <a
              href="/players/live-now"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all"
            >
              Live Players Now
            </a>

            <a
              href="/tennis-trending-now"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all"
            >
              Tennis Trending Now
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

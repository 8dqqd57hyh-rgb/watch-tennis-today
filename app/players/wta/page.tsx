const wtaPlayers = [
  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
  "Elena Rybakina",
  "Jessica Pegula",
  "Madison Keys",
  "Jasmine Paolini",
  "Emma Navarro",
  "Mirra Andreeva",
  "Naomi Osaka",
  "Jelena Ostapenko",
  "Elina Svitolina",
  "Ons Jabeur",
  "Maria Sakkari",
  "Qinwen Zheng",
];

function playerSlug(name: string) {
  return name.toLowerCase().replace(/,/g, "").replace(/\//g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function WTAPlayersPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <a href="/players" className="text-zinc-400 hover:text-white">
          ← Back to Players
        </a>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-purple-500/20 px-4 py-2 text-sm font-bold text-purple-400 mb-5">
            WTA Tour
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            WTA Tennis Players
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Follow WTA tennis players, live matches, WTA Tour schedules,
            streaming coverage and tournament updates.
          </p>
        </section>

        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {wtaPlayers.map((player) => (
              <a
                key={player}
                href={`/player/${playerSlug(player)}`}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-purple-500 transition-all"
              >
                <h2 className="text-2xl font-black mb-3">{player}</h2>
                <p className="text-zinc-400">
                  WTA live matches, schedules and streaming coverage
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">🔴 WTA Live Coverage</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/live-tennis" className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all">
              Live WTA Matches
            </a>

            <a href="/players/live-now" className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-red-500 transition-all">
              WTA Players Live Now
            </a>

            <a href="/players/atp" className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all">
              ATP Players
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

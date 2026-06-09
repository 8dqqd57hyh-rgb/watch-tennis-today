import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { safePlayerUrl } from "@/data/playerSlugs";

export const metadata = {
  title: "Best Tennis Players to Follow | ATP & WTA Player Guide",
  description:
    "A Watch Tennis Today guide to major ATP and WTA players, playing styles, surfaces, match context and where to follow player schedules.",
  alternates: { canonical: "https://watchtennistoday.com/best-tennis-players" },
};

const players = [
  { name: "Carlos Alcaraz", tour: "ATP", style: "Explosive all-court attacker", strength: "Creativity, speed, forehand variety and fast momentum swings.", watch: "Especially compelling on clay and hard courts because rallies can turn from defense to attack in one shot." },
  { name: "Jannik Sinner", tour: "ATP", style: "Clean baseline pressure player", strength: "Early ball-striking, pace control and calm point construction.", watch: "Often useful for fans learning how modern hard-court tennis is built around depth and timing." },
  { name: "Novak Djokovic", tour: "ATP", style: "Return and control specialist", strength: "Return games, flexibility, tactical adjustment and pressure management.", watch: "A strong reference point for understanding why scoreboard pressure is not only about winners." },
  { name: "Daniil Medvedev", tour: "ATP", style: "Deep-court counterpuncher", strength: "Unusual court position, defense, hard-court patience and tactical disruption.", watch: "Helpful for understanding how court geometry can frustrate aggressive opponents." },
  { name: "Alexander Zverev", tour: "ATP", style: "Power baseliner with a major first serve", strength: "Serve patterns, backhand stability and high-volume baseline pressure.", watch: "Often important in big-event draws because his matches can affect title paths for other top players." },
  { name: "Iga Swiatek", tour: "WTA", style: "Heavy topspin and movement leader", strength: "Clay-court dominance, return pressure and rapid point control.", watch: "One of the best examples of how footwork and spin can shape a match before the score looks dramatic." },
  { name: "Aryna Sabalenka", tour: "WTA", style: "First-strike power player", strength: "Serve power, return aggression and baseline acceleration.", watch: "Useful for fans learning how controlled aggression can shorten rallies and change match rhythm." },
  { name: "Coco Gauff", tour: "WTA", style: "Athletic defender and improving attacker", strength: "Movement, defensive reach, competitive resilience and transition play.", watch: "Her matches often show how elite defense can become offense across long rallies." },
  { name: "Elena Rybakina", tour: "WTA", style: "Calm power server", strength: "Serve efficiency, flat hitting and controlled baseline patterns.", watch: "A good player to follow when learning how serve quality shapes return games and tiebreaks." },
  { name: "Jessica Pegula", tour: "WTA", style: "Compact, efficient hard-court player", strength: "Timing, clean decisions and low-error baseline structure.", watch: "Her matches are useful examples of consistent professional patterns rather than only highlight shots." },
];

const faq = [
  { question: "Is this a live ranking page?", answer: "No. This is an editorial player guide. Live rankings can move weekly, so this page focuses on stable player context, style and internal navigation." },
  { question: "Why include playing style?", answer: "Playing style helps a fan understand why a match matters. Two players can have similar rankings but very different tactical matchups, surfaces and broadcast interest." },
  { question: "Where should I follow live player matches?", answer: "Use the linked player profile pages, live tennis page and daily schedule pages. Watch Tennis Today does not host video streams." },
];

export default function BestTennisPlayersPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: "Best Tennis Players to Follow", url: "https://watchtennistoday.com/best-tennis-players", description: metadata.description },
      { "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" },
        { "@type": "ListItem", position: 2, name: "Best Tennis Players", item: "https://watchtennistoday.com/best-tennis-players" },
      ] },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400"><Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Best Tennis Players</span></nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Player authority hub</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Best tennis players to follow on the ATP and WTA tours</h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>A strong tennis site should not treat every player page as the same template with a different name. Fans need to know why a player is worth following, how their style affects matchups, which surfaces amplify their strengths and where to check live schedules or official broadcasts.</p>
            <p>This hub gives Watch Tennis Today a stable editorial layer above individual player pages. It links users toward player profiles while explaining the sporting context in plain language. That improves navigation, builds topical authority and reduces the risk that player pages feel like thin programmatic pages.</p>
            <p>The list below is not a live ranking. It is a practical guide to widely followed ATP and WTA players whose matches often create strong search demand, broadcast interest and useful learning examples for newer fans.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {players.map((player) => (
            <article key={player.name} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-black">{player.name}</h2>
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-black">{player.tour}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-emerald-300">{player.style}</p>
              <p className="mt-3 leading-8 text-zinc-300"><strong className="text-white">Why they matter:</strong> {player.strength}</p>
              <p className="mt-3 leading-8 text-zinc-300"><strong className="text-white">What to watch:</strong> {player.watch}</p>
              <Link href={safePlayerUrl(player.name) || "/players"} className="mt-5 inline-block rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black">Open player profile</Link>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Player research links</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Link href="/players" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">All players</Link>
            <Link href="/players/atp" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">ATP players</Link>
            <Link href="/players/wta" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">WTA players</Link>
            <Link href="/live-tennis" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Live tennis</Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => <div key={item.question} className="border-t border-zinc-800 pt-5"><h3 className="font-black">{item.question}</h3><p className="mt-2 leading-8 text-zinc-300">{item.answer}</p></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}

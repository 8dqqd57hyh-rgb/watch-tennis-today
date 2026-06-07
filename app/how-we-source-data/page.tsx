import Link from "next/link";

export const metadata = {
  title: "How We Source Tennis Data | Watch Tennis Today",
  description:
    "A transparent explanation of how Watch Tennis Today sources tennis schedules, match status, broadcaster references and correction requests.",
  alternates: { canonical: "https://watchtennistoday.com/how-we-source-data" },
};

export const dynamic = "force-dynamic";

export default function HowWeSourceDataPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-zinc-400 hover:text-white">← Back</Link>
        <header className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Data transparency</p>
          <h1 className="text-4xl font-black md:text-6xl">How We Source Tennis Data</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Watch Tennis Today combines schedule data, public tournament context and broadcaster research to help fans understand what is happening today and where legal viewing information should be checked.
          </p>
        </header>

        <div className="mt-8 space-y-7 text-lg leading-9 text-zinc-300">
          {[
            ["Match and schedule data", "Our match pages and daily schedule pages may use tennis data providers, public tournament schedules and manually reviewed event information. Tennis is not a fixed-clock sport: one long match can delay an entire court, rain can suspend play, and a withdrawal can remove a match after it has already appeared on an order of play. Because of that, we treat live data as a useful guide rather than an official result certificate."],
            ["Status labels and score changes", "A match can be listed as upcoming, live, finished, suspended, retired, walkover or delayed. Those labels are especially important for fans because the same score line means different things depending on status. We avoid inventing point-by-point details when a feed does not provide them reliably; showing less data is better than showing fake precision."],
            ["Broadcaster references", "Broadcaster information is researched separately from score data because video rights are territorial. A service can show a tournament in one country and not in another. We point readers toward official broadcasters, tournament listings and legal streaming checks, but we do not claim that every match is available everywhere."],
            ["Tournament and tour context", "Pages may use tournament names, tour level, round, surface and player context to explain why a match matters. A Grand Slam main-court match, a Challenger semifinal and an ITF qualifying match do not have the same broadcast footprint. Explaining those differences makes the site more useful than a raw schedule feed."],
            ["What readers should verify", "Before paying for a subscription or planning around a specific match, readers should verify the final order of play, the local broadcaster schedule, subscription restrictions, device support and whether coverage includes the court they want. This is especially important during Grand Slams, combined ATP/WTA events and rain-affected days."],
            ["Corrections", "If a page looks outdated, we ask readers to send the page URL and the official source that shows the correction. Useful corrections include changed start times, moved courts, incorrect broadcaster references, retired matches, wrong player names and local-rights updates."],
          ].map(([title, body]) => (
            <section key={title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-3 text-2xl font-black text-white">{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>

        <aside className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6 text-zinc-300">
          <h2 className="text-2xl font-black text-white">Legal streaming note</h2>
          <p className="mt-3 leading-8">Watch Tennis Today does not host, embed, retransmit or unlock live tennis broadcasts. Our role is to organize tennis information and guide readers toward legal verification paths.</p>
          <Link href="/contact" className="mt-4 inline-block font-black text-emerald-300 hover:text-white">Contact us about a correction →</Link>
        </aside>
      </article>
    </main>
  );
}

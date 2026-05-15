export const metadata = {
  title: "About | Watch Tennis Today",
  description:
    "About Watch Tennis Today — live tennis matches, TV schedules, official broadcasters and legal streaming information.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          About Watch Tennis Today
        </h1>

        <div className="space-y-6 text-zinc-300 leading-8 text-lg">
          <p>
            Watch Tennis Today helps tennis fans find live tennis matches,
            official broadcasters, TV schedules and streaming information for
            ATP, WTA, Challenger and Grand Slam tournaments.
          </p>

          <p>
            The goal is to make tennis easier to follow by organizing live match
            schedules, streaming availability and tournament coverage in one
            place for fans around the world.
          </p>

          <p>
            Watch Tennis Today does not host, stream or retransmit tennis
            matches directly. The site links to official broadcasters,
            tournament websites and legal streaming providers whenever possible.
          </p>

          <p>
            Broadcasting rights may vary depending on country, tournament,
            broadcaster and platform availability. Users should always verify
            access and streaming rights with the official provider in their
            region.
          </p>

          <p>
            Live tennis match information and schedules may be updated
            automatically using sports data providers and publicly available
            match information sources.
          </p>

          <p>
            The site is designed for tennis fans looking for a simpler way to
            discover what tennis matches are live today, where to watch them
            legally and how to follow tournaments more easily.
          </p>
        </div>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            What Watch Tennis Today Provides
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-zinc-300 leading-8">
            <li>Live tennis match information</li>
            <li>ATP, WTA, Challenger and Grand Slam schedules</li>
            <li>Country-based tennis broadcaster guides</li>
            <li>Official streaming and TV channel information</li>
            <li>Player, tournament and match pages</li>
          </ul>
        </section>

        <section className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            Legal Notice
          </h2>

          <p className="text-zinc-300 leading-8">
            Watch Tennis Today is an informational website. We do not provide
            illegal streams, pirated broadcasts or unauthorized tennis video
            content. All users should watch tennis through official broadcasters,
            licensed streaming platforms or tournament partners.
          </p>
        </section>

        <section className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            Contact
          </h2>

          <p className="text-zinc-300 leading-8 mb-5">
            For corrections, partnership inquiries or feedback, please use the
            contact page.
          </p>

          <a
            href="/contact"
            className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black hover:bg-green-400 transition-all"
          >
            Contact Watch Tennis Today
          </a>
        </section>
      </div>
    </main>
  );
}
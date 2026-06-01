import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis Time Zone Converter | Watch Tennis Today",
  description:
    "Convert tennis match start times to your local timezone and plan ATP, WTA and Grand Slam viewing without missing live matches.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-time-zone-converter",
  },
};

const examples = [
  {
    title: "Grand Slam night sessions",
    copy: "Australian Open, US Open and Roland-Garros evening matches often land at awkward hours for international fans. Check the local-time planner before you stay up late.",
  },
  {
    title: "ATP and WTA weekly events",
    copy: "Tour events can move between Europe, North America, Asia and Australia in the same month, so browser-local match times are safer than mental timezone conversion.",
  },
  {
    title: "Saved-player tracking",
    copy: "Combine this page with My Players and My Tournament to quickly see when your favorite players are live or scheduled next.",
  },
];

export default function TennisTimeZoneConverterPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Tennis Time Zone Converter",
          url: "https://watchtennistoday.com/tennis-time-zone-converter",
          description:
            "A guide to using Watch Tennis Today for local tennis start times, live matches and international tennis schedules.",
        }}
      />

      <div className="mx-auto max-w-5xl">
        <Link href="/today" className="text-zinc-400 hover:text-white">
          ← Back to tennis today
        </Link>

        <section className="mt-10 rounded-[2.5rem] border border-sky-400/40 bg-gradient-to-br from-sky-950/40 via-zinc-950 to-black p-8 md:p-10">
          <div className="mb-5 inline-flex rounded-full bg-sky-400 px-4 py-2 text-sm font-black text-black">
            🌍 Tennis time zone helper
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Tennis Time Zone Converter
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Use Watch Tennis Today to see ATP, WTA and Grand Slam match times in your local browser timezone. This is useful when tournaments are played in Europe, Australia, Asia or North America and you want a quick answer to “when does this tennis match start for me?”
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/today"
              className="rounded-2xl bg-sky-400 px-6 py-4 font-black text-black hover:bg-sky-300"
            >
              See today&apos;s local times →
            </Link>
            <Link
              href="/my-tournament"
              className="rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-sky-400"
            >
              Open My Tournament
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {examples.map((item) => (
            <article key={item.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-3 text-xl font-black text-white">{item.title}</h2>
              <p className="leading-7 text-zinc-400">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="mb-4 text-3xl font-black">How to use it</h2>
          <ol className="space-y-3 text-zinc-300">
            <li>1. Open the Tennis Today page.</li>
            <li>2. Check the Local time planner block near the top of the page.</li>
            <li>3. Use the Live now and Next up sections first.</li>
            <li>4. Save favorite players to make My Tournament and Watchlist pages more personal.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}

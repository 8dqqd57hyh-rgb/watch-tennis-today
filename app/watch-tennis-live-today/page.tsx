import Link from "next/link";
import LiveTennisPage from "../live-tennis/page";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Watch Tennis Live Today | ATP & WTA Live Matches",
  description:
    "Watch tennis live today with ATP, WTA, Challenger and ITF schedules, live scores, streaming guides and TV channels.",
};

export default function WatchTennisLiveTodayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Watch Tennis Live Today
        </h1>

        <p className="text-zinc-300 text-lg mt-6 max-w-3xl">
          Follow today’s ATP, WTA, Challenger and ITF matches with live
          schedules, scores and official streaming information.
        </p>

        <p className="text-zinc-400 mt-4 max-w-3xl">
  Watch Tennis Today does not host, embed or restream live tennis broadcasts.
  We provide tennis schedules, match information and links to official
  broadcaster resources only.
</p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/atp-live-today"
            className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            ATP Matches
          </Link>

          <Link
            href="/wta-live-today"
            className="bg-zinc-900 border border-zinc-700 px-5 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition"
          >
            WTA Matches
          </Link>

          <Link
            href="/grand-slam-live"
            className="bg-zinc-900 border border-zinc-700 px-5 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition"
          >
            Grand Slams
          </Link>
        </div>
      </section>

<section className="max-w-6xl mx-auto px-4 py-10">
  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
    <h2 className="text-3xl font-bold">
      Live tennis matches right now
    </h2>

    <p className="text-zinc-300 mt-4 max-w-2xl">
      See current live tennis matches, scores and match pages in one place.
    </p>

    <Link
      href="/live-tennis"
      className="inline-block mt-6 bg-green-500 text-black px-5 py-3 rounded-xl font-bold hover:bg-green-400 transition"
    >
      View Live Matches
    </Link>
  </div>
</section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm uppercase tracking-wide text-zinc-400">
            Tennis streaming
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Watch tennis safely while traveling
          </h2>

          <p className="text-zinc-300 mt-4 max-w-2xl">
            Some tennis streams and broadcasters may be unavailable in your
            country while traveling. Many tennis fans use VPN services to
            access their usual sports platforms securely abroad.
          </p>

          <Link
            href="/best-vpn-for-tennis-streaming"
            className="inline-block mt-6 bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Best VPNs for Tennis
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold">
          Popular Tennis Pages
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <Link
            href="/watch-sinner-live"
            className="border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-900 transition"
          >
            Watch Sinner Live
          </Link>

          <Link
            href="/watch-swiatek-live"
            className="border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-900 transition"
          >
            Watch Swiatek Live
          </Link>

          <Link
            href="/french-open-live-stream"
            className="border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-900 transition"
          >
            French Open Live Stream
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Watch Tennis Today",
  description:
    "Disclaimer for Watch Tennis Today, including information about broadcaster availability, schedules, external links and affiliate relationships.",
  alternates: {
    canonical: "https://watchtennistoday.com/disclaimer",
  },
};

export const dynamic = "force-dynamic";
export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          Disclaimer
        </h1>

        <section className="mt-8 space-y-6 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today is an independent tennis information website. The
            site provides schedules, match discovery pages, tournament guides and
            broadcaster information to help fans find legal ways to follow tennis.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No illegal streaming
            </h2>
            <p>
              Watch Tennis Today does not host, embed or link to illegal tennis
              streams. Any broadcaster or streaming information is intended to
              point users toward official, licensed or legally available viewing
              options.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Broadcaster availability
            </h2>
            <p>
              Tennis broadcast rights vary by country, tournament, platform and
              season. Availability may change without notice. Users should always
              confirm final coverage directly with the relevant broadcaster or
              streaming service before subscribing, purchasing access or relying
              on a listing.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Match schedules and data
            </h2>
            <p>
              Match times, player availability, tournament schedules and results
              may change due to weather, withdrawals, court changes, broadcast
              decisions or official tournament updates. Watch Tennis Today aims
              to keep information useful, but it cannot guarantee that every
              listing is complete, final or available in every region.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              External links
            </h2>
            <p>
              This website may link to official broadcasters, tournament pages,
              streaming platforms, affiliate partners or other third-party
              websites. Watch Tennis Today is not responsible for the content,
              pricing, availability, policies or technical behavior of external
              websites.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Affiliate disclosure
            </h2>
            <p>
              Some links may be affiliate links. If a user clicks an affiliate
              link and makes a purchase, Watch Tennis Today may earn a commission
              at no additional cost to the user. Affiliate relationships do not
              change the goal of helping users find legal tennis viewing options.
            </p>

            <a
              href="/affiliate-disclosure"
              className="inline-block mt-4 text-white underline underline-offset-4"
            >
              Read the affiliate disclosure
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

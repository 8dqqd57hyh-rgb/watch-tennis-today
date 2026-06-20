import Link from "next/link";

export const metadata = {
  title: "Terms of Use | Watch Tennis Today",
  description:
    "Terms of Use for Watch Tennis Today, including tennis schedules, streaming guides, external links, affiliate links and website limitations.",
  alternates: {
    canonical: "https://watchtennistoday.com/terms",
  },
};

export const dynamic = "force-dynamic";
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-6">Terms of Use</h1>

        <p className="text-zinc-400 mb-8">Last updated: May 20, 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              1. Website purpose
            </h2>
            <p>
              Watch Tennis Today provides tennis schedules, live match
              information, tournament pages, broadcaster guides and streaming
              related articles. The website is intended for informational
              purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              2. Accuracy of information
            </h2>
            <p>
              Tennis schedules, scores, start times, match statuses and
              broadcaster availability may change without notice. We try to keep
              information useful and accurate, but we cannot guarantee that all
              information is always complete, current or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              3. External links
            </h2>
            <p>
              This website may link to official broadcasters, tournament
              websites, streaming platforms, affiliate partners and other third
              party resources. We are not responsible for the content,
              availability, pricing, privacy practices or terms of external
              websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              4. Streaming availability
            </h2>
            <p>
              Streaming rights vary by country, tournament and provider. Users
              should always verify access, subscriptions, blackout restrictions
              and local availability directly with official broadcasters or
              streaming services before watching.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              5. Affiliate disclosure
            </h2>
            <p>
              Some links on Watch Tennis Today may be affiliate links. If you
              click these links or purchase through them, we may earn a
              commission at no additional cost to you. Affiliate relationships do
              not change our goal of providing useful tennis information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              6. No official affiliation
            </h2>
            <p>
              Watch Tennis Today is an independent website and is not officially
              affiliated with ATP, WTA, Grand Slam tournaments, broadcasters or
              streaming services unless clearly stated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              7. Contact
            </h2>
            <p>
              If you notice incorrect information, broken links or have
              questions about these Terms, please contact us through the Contact
              page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

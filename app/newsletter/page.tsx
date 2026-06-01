import EmailSignup from "@/app/components/EmailSignup";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis Newsletter | Live Match Alerts & Streaming Updates",
  description:
    "Subscribe to the Watch Tennis Today newsletter for live tennis match alerts, Grand Slam reminders, ATP/WTA schedules and streaming updates.",
  alternates: {
    canonical: "https://watchtennistoday.com/newsletter",
  },
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <article className="mt-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <p className="text-green-400 font-black mb-4">
            Free Tennis Alerts
          </p>

          <h1 className="text-5xl font-black mb-6">
            Tennis Newsletter
          </h1>

          <p className="text-zinc-300 text-lg leading-8 mb-8">
            Get live tennis match alerts, ATP and WTA schedule updates, Grand
            Slam reminders and streaming tips from Watch Tennis Today.
          </p>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-black border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-2xl font-black mb-3">
                🔴 Live match alerts
              </h2>
              <p className="text-zinc-400 leading-7">
                Get notified about important live and upcoming tennis matches.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-2xl font-black mb-3">
                🏆 Grand Slam reminders
              </h2>
              <p className="text-zinc-400 leading-7">
                Follow Australian Open, Roland Garros, Wimbledon and US Open
                schedule updates.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-2xl font-black mb-3">
                📺 Streaming updates
              </h2>
              <p className="text-zinc-400 leading-7">
                Find official broadcaster and streaming information by country.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-2xl font-black mb-3">
                ⭐ Player updates
              </h2>
              <p className="text-zinc-400 leading-7">
                Follow featured ATP and WTA players, match pages and live
                schedules.
              </p>
            </div>
          </section>

          <section className="bg-black border border-zinc-800 rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-black mb-4">
              Subscribe for free
            </h2>

            <p className="text-zinc-400 leading-7 mb-6">
              No spam — only tennis schedules, match alerts and useful streaming
              updates.
            </p>

            <EmailSignup
              title="Subscribe for useful tennis alerts"
              description="Get practical schedule notes, Grand Slam reminders and official viewing updates. We keep this opt-in and low-noise."
              source="newsletter-page"
              buttonLabel="Subscribe"
            />
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black mb-4">
              Useful tennis pages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/live-tennis"
                className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Live Tennis Today
              </a>

              <a
                href="/tennis-trending-now"
                className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Tennis Trending Now
              </a>

              <a
                href="/grand-slam-live"
                className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Grand Slam Live
              </a>

              <a
                href="/best-ways-to-watch-tennis-online"
                className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Best Ways to Watch Tennis Online
              </a>
            </div>
          </section>

          <AuthorBox />
        </article>
      </div>

      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: "https://watchtennistoday.com",
          },
          {
            name: "Newsletter",
            url: "https://watchtennistoday.com/newsletter",
          },
        ]}
      />
    </main>
  );
}

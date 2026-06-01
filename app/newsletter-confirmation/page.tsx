import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "You’re Subscribed | Watch Tennis Today",
  description:
    "You are subscribed to Watch Tennis Today tennis alerts, live match updates and streaming guides.",
  alternates: {
    canonical: "https://watchtennistoday.com/newsletter-confirmation",
  },
};

export default function NewsletterConfirmationPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <article className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <p className="text-green-400 font-black mb-4">
            Subscription confirmed
          </p>

          <h1 className="text-5xl font-black mb-6">
            You’re subscribed 🎾
          </h1>

          <p className="text-zinc-300 text-lg leading-8 mb-8">
            You’ll get tennis match alerts, Grand Slam reminders, streaming
            updates and useful tennis schedule links from Watch Tennis Today.
          </p>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <a
              href="/live-tennis"
              className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <h2 className="text-2xl font-black mb-3">🔴 Live Tennis Today</h2>
              <p className="text-zinc-400">
                Check live and upcoming tennis matches now.
              </p>
            </a>

            <a
              href="/tennis-trending-now"
              className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <h2 className="text-2xl font-black mb-3">🔥 Trending Tennis</h2>
              <p className="text-zinc-400">
                See popular live matches, players and tournament pages.
              </p>
            </a>

            <a
              href="/grand-slam-live"
              className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <h2 className="text-2xl font-black mb-3">🏆 Grand Slam Live</h2>
              <p className="text-zinc-400">
                Follow Australian Open, Roland Garros, Wimbledon and US Open.
              </p>
            </a>

            <a
              href="/best-ways-to-watch-tennis-online"
              className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <h2 className="text-2xl font-black mb-3">📺 Watch Tennis Online</h2>
              <p className="text-zinc-400">
                Compare legal ways to watch ATP, WTA and Grand Slam tennis.
              </p>
            </a>
          </section>

          <section className="rounded-3xl border border-green-500/40 bg-black p-6">
            <h2 className="text-3xl font-black mb-4">
              Watching tennis while traveling?
            </h2>

            <p className="text-zinc-300 leading-8 mb-6">
              Tennis streaming availability may change by country. A VPN can
              help keep your connection private while checking your usual
              streaming services on hotel or public Wi-Fi.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={affiliateLinks.nordvpn}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
              >
                Try NordVPN
              </a>

              <a
                href="/best-vpn-for-tennis-streaming"
                className="border border-zinc-700 px-6 py-4 rounded-2xl font-black hover:border-green-500 hover:text-green-400 transition-all"
              >
                Best VPN for Tennis
              </a>
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Affiliate disclosure: we may earn a commission if you purchase
              through links on this page.
            </p>
          </section>
        </article>
      </div>

      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: "https://watchtennistoday.com",
          },
          {
            name: "Newsletter Confirmation",
            url: "https://watchtennistoday.com/newsletter-confirmation",
          },
        ]}
      />
    </main>
  );
}

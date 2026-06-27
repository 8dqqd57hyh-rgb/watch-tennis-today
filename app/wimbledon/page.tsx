import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import PlayerFollowCTA from "@/components/PlayerFollowCTA";
import LegalStreamingOptions from "@/components/LegalStreamingOptions";

export const metadata: Metadata = {
  title: "Wimbledon Live Stream, Schedule & Legal TV Guide | Watch Tennis Today",
  description: "A practical Wimbledon hub with legal streaming notes, schedule context, player storylines and country-specific viewing guidance.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon" },
};

const faq = [
  { q: "Where can I watch Wimbledon legally?", a: "Use official tournament broadcasters and licensed services in your country. Rights differ by market, so confirm coverage on the provider site before subscribing." },
  { q: "Does Tennis TV show Wimbledon?", a: "Grand Slam rights are separate from regular ATP Tour rights. Tennis TV is useful for many ATP events, but Grand Slam coverage normally requires event-specific broadcasters." },
  { q: "Why can match times change?", a: "Tennis schedules depend on previous matches, weather, withdrawals and court assignments. Treat listed times as planning information until the official order of play is confirmed." },
];

export default function Page() {
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" },
    { "@type": "ListItem", position: 2, name: "Wimbledon", item: "https://watchtennistoday.com/wimbledon" },
  ] };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return <main className="mx-auto max-w-5xl p-4 text-zinc-900">
    <JsonLd data={[breadcrumb, faqSchema]} />
    <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500"><Link href="/">Home</Link><span>/</span><span>Wimbledon</span></nav>
    <section className="rounded-3xl bg-zinc-950 p-8 text-white">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Grand Slam hub</p>
      <h1 className="mt-3 text-4xl font-black md:text-6xl">Wimbledon live stream, schedule and legal TV guide</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">Use this page as a calm, legal starting point for following Wimbledon. We combine schedule context, country viewing notes, player storylines and internal links without promising streams we do not host or verify.</p>
      <div className="mt-6 flex flex-wrap gap-3"><a href="#how-to-watch" className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black">How to watch</a><a href="#schedule" className="rounded-2xl bg-white/10 px-5 py-3 font-black">Schedule notes</a><a href="#faq" className="rounded-2xl bg-white/10 px-5 py-3 font-black">FAQ</a></div>
    </section>
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <article className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-700 shadow-sm">
        <h2 className="text-2xl font-black text-zinc-950">Tournament overview</h2>
        <p>Wimbledon is one of the major events that casual fans, committed tennis followers and search visitors all track differently. Some people arrive looking for a specific player, some want the order of play, and others only need to know which legal service carries the match in their country. This hub is designed to serve all three needs without turning the page into a thin list of links.</p>
        <p>The tournament is associated with the All England Club, grass-court conditions and the summer part of the tennis calendar. Those details matter because viewing demand rises when a draw moves from early rounds into seeded clashes, night sessions, semifinals and finals. Instead of inventing live data when a feed is incomplete, this page points readers toward official schedule sources, player pages and legal streaming guides.</p>
        <p>Grass changes the way fans read a match. Big servers can protect service games, returners must react quickly, and players with strong transition games often become more dangerous. Wimbledon also attracts many non-regular tennis viewers, so clear country guidance and legal viewing language are especially important.</p>
        <p>For monetization, the page is intentionally built around high-intent questions: where to watch legally, whether a service is appropriate for the event, and how to avoid unsafe streams. That is better for users and safer for AdSense than doorway pages or copied broadcaster lists. Any commercial link should be configured through the streaming partner file, not hard-coded into article text.</p>
      </article>
      <PlayerFollowCTA tournamentName="Wimbledon" source="wimbledon-hub" />
    </section>
    <section id="how-to-watch" className="mt-8"><LegalStreamingOptions title="How to watch Wimbledon legally" /></section>
    <section id="schedule" className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Schedule and order-of-play context</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm leading-7 text-zinc-700">
        <div className="rounded-2xl bg-zinc-50 p-4"><h3 className="font-black text-zinc-950">Before play starts</h3><p>Check the official order of play and your local time zone. Tennis sessions can move because of weather and previous matches.</p></div>
        <div className="rounded-2xl bg-zinc-50 p-4"><h3 className="font-black text-zinc-950">During live play</h3><p>Use <Link href="/live-tennis" className="font-bold text-green-700">live tennis</Link> and player pages for status context, then confirm broadcast coverage with the provider.</p></div>
        <div className="rounded-2xl bg-zinc-50 p-4"><h3 className="font-black text-zinc-950">After matches</h3><p>Use result pages and tournament pages to continue browsing without relying on expired watch links.</p></div>
      </div>
    </section>
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Country-specific watching notes</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-700">Grand Slam rights are country-specific. Start with the country guide closest to your location, then verify the exact event, court and subscription package on the broadcaster website.</p>
      <div className="mt-4 flex flex-wrap gap-3"><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/how-to-watch-wimbledon-in-usa">USA Wimbledon guide</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/how-to-watch-wimbledon-in-uk">UK Wimbledon guide</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/how-to-watch-wimbledon-in-canada">Canada Wimbledon guide</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/how-to-watch-wimbledon-in-australia">Australia Wimbledon guide</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/how-to-watch-wimbledon-in-poland">Poland Wimbledon guide</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/where-to-watch-wimbledon">All Wimbledon broadcaster checks</Link></div>
    </section>
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Player storylines to follow</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-700">The best viewing pages connect tournament context to players. Follow top profiles such as <Link href="/player/carlos-alcaraz" className="font-bold text-green-700">Carlos Alcaraz</Link>, <Link href="/player/jannik-sinner" className="font-bold text-green-700">Jannik Sinner</Link>, <Link href="/player/novak-djokovic" className="font-bold text-green-700">Novak Djokovic</Link>, <Link href="/player/iga-swiatek" className="font-bold text-green-700">Iga Swiatek</Link> and <Link href="/player/aryna-sabalenka" className="font-bold text-green-700">Aryna Sabalenka</Link> when they are in the draw.</p>
    </section>
    <section id="faq" className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">FAQ</h2><div className="mt-4 space-y-4">{faq.map((item) => <div key={item.q}><h3 className="font-black">{item.q}</h3><p className="mt-1 text-sm leading-7 text-zinc-700">{item.a}</p></div>)}</div></section>
  </main>;
}

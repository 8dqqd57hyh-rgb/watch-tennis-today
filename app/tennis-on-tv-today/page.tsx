import type { Metadata } from "next";
import Link from "next/link";
import { getServerMatchesWindow, type ServerMatch } from "@/app/lib/serverMatches";
import LocalTvTime from "@/app/components/LocalTvTime";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis on TV Today | Live Tennis Channels and Legal Streams",
  description:
    "Find tennis on TV today with live and upcoming matches, localized start times, channel discovery and legal streaming routes.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-on-tv-today" },
};

const faq = [
  { question: "What tennis is on TV today?", answer: "The live TV guide above lists today's available matches from our fixture feed, with tournament, status, start time and verified viewing providers when supplied." },
  { question: "Where can I watch ATP tennis?", answer: "ATP coverage varies by tournament and country. Check the provider shown beside a match, then confirm that the selected court is included in your local package." },
  { question: "Where can I watch WTA tennis?", answer: "WTA rights vary by market and event. Use the match provider links above and verify the current channel or streaming schedule before play starts." },
  { question: "How often is the TV schedule updated?", answer: "The match feed is refreshed throughout the day. Start times and coverage can still move because of weather, long earlier matches and broadcaster schedule changes." },
];

const popularBroadcasters = [
  { name: "ESPN", href: "/watch-tennis-in/usa" },
  { name: "Tennis Channel", href: "/watch-tennis-in/usa" },
  { name: "Sky Sports", href: "/watch-tennis-in/uk" },
  { name: "Eurosport", href: "/official-tennis-broadcasters-guide" },
  { name: "beIN Sports", href: "/official-tennis-broadcasters-guide" },
  { name: "Tennis TV", href: "/tennis-tv-broadcast-finder" },
];

const editorialSections = [
  { title: "How tennis TV rights work", body: "Tennis rights are sold by tournament and territory. The same match can be on cable in one country, streaming-only in another, or unavailable on a main channel. Always confirm the selected court with the local broadcaster." },
  { title: "Why listings can change", body: "Long matches, rain delays and court changes can move both start times and broadcast windows. Channel grids may update after the tournament order of play, so recheck the official provider close to first ball." },
  { title: "Country availability", body: "A provider listed for a match is a viewing starting point, not a promise of access in every country. Subscription tier, location, court and replay rights can all affect availability." },
  { title: "Legal viewing only", body: "Watch Tennis Today does not host or retransmit matches. We surface fixture data and recognized provider routes so viewers can reach legal coverage and avoid unreliable stream pages." },
];

function normalizeStatus(status?: string) {
  return String(status || "").toUpperCase();
}

function dayKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(value);
}

function matchDay(match: ServerMatch) {
  return match.startTime ? dayKey(new Date(match.startTime)) : "";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/,/g, "").replace(/\//g, "-").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function matchHref(match: ServerMatch) {
  return `/watch/${slugify(`${match.player1}-vs-${match.player2}`)}-${String(match.id).split(":").pop()}`;
}

function statusMeta(match: ServerMatch) {
  const status = normalizeStatus(match.status);
  if (status === "LIVE") return { label: "LIVE", className: "bg-red-600 text-white" };
  if (["FINISHED", "COMPLETED"].includes(status)) return { label: "Finished", className: "bg-zinc-200 text-zinc-700" };
  if (["SUSPENDED", "DELAYED"].includes(status)) return { label: "Delayed", className: "bg-amber-100 text-amber-800" };
  return { label: "Upcoming", className: "bg-sky-100 text-sky-800" };
}

function matchPriority(match: ServerMatch) {
  const status = normalizeStatus(match.status);
  if (status === "LIVE") return 0;
  if (["UPCOMING", "SCHEDULED", "NOT_STARTED"].includes(status)) return 1;
  return 2;
}

function sortMatches(matches: ServerMatch[]) {
  return [...matches].sort((a, b) => matchPriority(a) - matchPriority(b) || (a.startTime ? new Date(a.startTime).getTime() : Infinity) - (b.startTime ? new Date(b.startTime).getTime() : Infinity));
}

function ProviderBadges({ match }: { match: ServerMatch }) {
  if (!match.watchProviders.length) return <span className="text-xs font-semibold text-zinc-500">Broadcaster TBC</span>;
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="TV channels and streaming services">
      {match.watchProviders.slice(0, 3).map((provider) => (
        <span key={`${match.id}-${provider.name}`} className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-black text-zinc-800">
          <span aria-hidden="true" className="grid size-5 place-items-center rounded bg-zinc-950 text-[9px] text-white">{provider.name.slice(0, 2).toUpperCase()}</span>
          {provider.name}
        </span>
      ))}
    </div>
  );
}

function MatchCard({ match }: { match: ServerMatch }) {
  const status = statusMeta(match);
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-bold uppercase tracking-wide text-zinc-500">{match.tournament}</p>
        <span className={`shrink-0 rounded px-2 py-1 text-[10px] font-black uppercase ${status.className}`}>{status.label}</span>
      </div>
      <h3 className="mt-2 text-base font-black leading-tight text-zinc-950">{match.player1}<span className="mx-1.5 text-xs font-bold text-zinc-400">vs</span>{match.player2}</h3>
      <div className="mt-2 flex items-center justify-between gap-3">
        <time dateTime={match.startTime || undefined} className="shrink-0 text-sm font-black text-zinc-900"><LocalTvTime startTime={match.startTime} /></time>
        <ProviderBadges match={match} />
      </div>
      {match.watchProviders.length ? <Link href={matchHref(match)} className="mt-3 block rounded-lg bg-zinc-950 px-3 py-2 text-center text-sm font-black text-white hover:bg-zinc-800">Watch options</Link> : null}
    </article>
  );
}

export default async function TennisOnTvTodayPage() {
  const matches = await getServerMatchesWindow({ includeFinished: true, daysBack: 0, daysForward: 1, noStore: true, timeoutMs: 10000 });
  const now = new Date();
  const todayKey = dayKey(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = dayKey(tomorrow);
  const todayMatches = sortMatches(matches.filter((match) => matchDay(match) === todayKey));
  const tomorrowMatches = sortMatches(matches.filter((match) => matchDay(match) === tomorrowKey));
  const heroMatches = todayMatches.filter((match) => matchPriority(match) < 2).slice(0, 4);
  const grouped = Map.groupBy(todayMatches, (match) => match.tournament || "Other tennis");

  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" }, { "@type": "ListItem", position: 2, name: "Tennis on TV Today", item: "https://watchtennistoday.com/tennis-on-tv-today" }] };

  return (
    <main className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">Tennis on TV Today</h1>
        <p className="mt-1 text-sm text-zinc-600 sm:text-base">Live tennis matches on TV and streaming today with broadcasters, start times and tournaments.</p>
      </header>

      <section aria-labelledby="todays-matches-title" className="mt-4 rounded-2xl bg-zinc-950 p-3 text-white sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="todays-matches-title" className="text-xl font-black sm:text-2xl">Today&apos;s Matches on TV</h2>
          <span className="text-xs font-bold text-zinc-400">Updated live</span>
        </div>
        {heroMatches.length ? <div className="grid gap-2 sm:grid-cols-2">{heroMatches.map((match) => <MatchCard key={match.id} match={match} />)}</div> : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-black">No televised tennis matches scheduled today.</p>
            {tomorrowMatches.length ? <><p className="mt-1 text-sm text-zinc-400">Tomorrow&apos;s first listed matches:</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{tomorrowMatches.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} />)}</div></> : <p className="mt-1 text-sm text-zinc-400">Tomorrow&apos;s schedule is not available yet.</p>}
          </div>
        )}
      </section>

      {todayMatches.length ? <section aria-labelledby="schedule-title" className="mt-6">
        <h2 id="schedule-title" className="text-2xl font-black text-zinc-950">Today&apos;s TV Schedule</h2>
        <div className="mt-3 space-y-3">{Array.from(grouped.entries()).map(([tournament, tournamentMatches]) => (
          <section key={tournament} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <h3 className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-black text-zinc-950">{tournament}</h3>
            <div className="divide-y divide-zinc-100">{tournamentMatches.map((match) => { const status = statusMeta(match); return (
              <article key={match.id} className="grid gap-2 px-3 py-3 sm:grid-cols-[5rem_1fr_auto_auto] sm:items-center">
                <time dateTime={match.startTime || undefined} className="text-sm font-black"><LocalTvTime startTime={match.startTime} /></time>
                <Link href={matchHref(match)} className="font-bold text-zinc-950 hover:underline">{match.player1} <span className="text-xs text-zinc-400">vs</span> {match.player2}</Link>
                <ProviderBadges match={match} />
                <span className={`w-fit rounded px-2 py-1 text-[10px] font-black uppercase ${status.className}`}>{status.label}</span>
              </article>
            ); })}</div>
          </section>
        ))}</div>
      </section> : null}

      <section aria-labelledby="broadcasters-title" className="mt-7">
        <h2 id="broadcasters-title" className="text-xl font-black text-zinc-950">Popular broadcasters</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{popularBroadcasters.map((item) => <Link key={item.name} href={item.href} className="rounded-xl border border-zinc-200 bg-white p-3 text-center text-sm font-black text-zinc-900 hover:border-sky-400">{item.name}</Link>)}</div>
      </section>

      <section aria-labelledby="faq-title" className="mt-7">
        <h2 id="faq-title" className="text-xl font-black text-zinc-950">FAQ</h2>
        <div className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white px-4">{faq.map((item) => <details key={item.question} className="group py-3"><summary className="cursor-pointer list-none pr-6 font-bold text-zinc-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-zinc-400 group-open:rotate-45">+</span></summary><p className="pt-2 text-sm leading-6 text-zinc-600">{item.answer}</p></details>)}</div>
      </section>

      <section aria-labelledby="guide-title" className="mt-8 border-t border-zinc-200 pt-7">
        <h2 id="guide-title" className="text-2xl font-black text-zinc-950">Tennis TV and streaming guide</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">{editorialSections.map((section) => <article key={section.title}><h3 className="font-black text-zinc-950">{section.title}</h3><p className="mt-1 text-sm leading-6 text-zinc-600">{section.body}</p></article>)}</div>
      </section>

      <nav aria-label="Related tennis pages" className="mt-7 grid gap-2 border-t border-zinc-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {[{ href: "/watch-tennis-live-today", label: "Legal tennis streams today" }, { href: "/tennis-schedule-today", label: "Complete tennis schedule" }, { href: "/official-tennis-broadcasters-guide", label: "Official broadcasters guide" }, { href: "/tennis-order-of-play-today", label: "Order of play today" }].map((item) => <Link key={item.href} href={item.href} className="rounded-lg bg-zinc-100 px-3 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-200">{item.label}</Link>)}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema]) }} />
    </main>
  );
}

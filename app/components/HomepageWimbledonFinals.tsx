import Link from "next/link";
import { getServerMatchesWindow } from "@/app/lib/serverMatches";
import { selectWimbledonFinals, type WimbledonFinal } from "@/app/lib/wimbledonFinals";
import WimbledonFinalTime from "@/app/components/WimbledonFinalTime";
import { getOfficialWimbledonFinals } from "@/app/lib/wimbledonOfficial";

const nav = [["/wimbledon-live", "Live hub"], ["/wimbledon-schedule", "Schedule"], ["/wimbledon-order-of-play", "Order of play"], ["/wimbledon-results", "Results"], ["/where-to-watch-wimbledon", "Where to watch"]] as const;

function FinalCard({ final, label }: { final?: WimbledonFinal; label: string }) {
  if (!final) return <article className="rounded-2xl border border-white/10 bg-black/30 p-5"><h3 className="text-lg font-black">{label}</h3><p className="mt-6 text-zinc-400">Match data pending</p></article>;
  const absolute = final.startTime ? new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London", timeZoneName: "short" }).format(new Date(final.startTime)) : null;
  return <article className="min-w-0 rounded-2xl border border-white/15 bg-black/45 p-5">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-black">{final.eventLabel}</h3><span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${final.status === "live" ? "bg-red-500 text-white" : "bg-white/10 text-green-200"}`}>{final.status === "live" ? "LIVE" : final.providerStatus}</span></div>
    <div className="mt-5 space-y-3">{final.participants.map((side, index) => <div key={`${side.displayName}-${index}`} className={`flex min-w-0 items-center justify-between gap-3 rounded-xl p-3 ${final.winnerParticipantIndex === index ? "bg-green-400/15 ring-1 ring-green-300/40" : "bg-white/5"}`}>
      <div className="min-w-0"><p className="break-words text-lg font-black">{side.players.map((player, playerIndex) => <span key={player.name}>{playerIndex > 0 ? " / " : ""}{player.slug ? <Link className="hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" href={`/player/${player.slug}`}>{player.name}</Link> : player.name}{player.ranking ? <span className="ml-2 text-xs text-zinc-400">#{player.ranking}</span> : null}</span>)}</p>{final.winnerParticipantIndex === index ? <span className="text-xs font-black uppercase text-green-300">Champion</span> : null}</div>
    </div>)}</div>
    {final.score ? <p className="mt-4 break-words text-2xl font-black" aria-label={`Score ${final.score}`}>{final.score}{final.pointScore && final.status === "live" ? <span className="ml-3 text-base text-green-300">{final.pointScore}</span> : null}</p> : null}
    <div className="mt-4">{absolute && final.startTime ? <><WimbledonFinalTime startTime={final.startTime} active={final.status === "scheduled"} /><time dateTime={final.startTime} className="mt-1 block text-xs text-zinc-400">Official schedule (London): {absolute}</time></> : <p className="text-sm text-zinc-400">Start time to be confirmed</p>}</div>
    <div className="mt-5 flex flex-wrap gap-2"><Link href={final.matchUrl} className="rounded-full bg-green-400 px-4 py-2 text-sm font-black text-black focus:outline-none focus:ring-2 focus:ring-white">{final.status === "completed" ? "Final result" : "Match center"}</Link><Link href="/where-to-watch-wimbledon" className="rounded-full border border-white/20 px-4 py-2 text-sm font-black">Check coverage in your country</Link></div>
    {final.watchProviders.length ? <p className="mt-3 text-xs text-zinc-400">{final.watchProviders.length} official coverage {final.watchProviders.length === 1 ? "option" : "options"} listed; availability can vary by court and country.</p> : null}
  </article>;
}

export default async function HomepageWimbledonFinals() {
  const apiMatches = await getServerMatchesWindow({ includeFinished: true, includeRankings: true, daysBack: 3, daysForward: 7, revalidateSeconds: 60, timeoutMs: 10_000 });
  let finals = selectWimbledonFinals(apiMatches);
  if (!finals.some((item) => item.eventType === "womens-singles") || !finals.some((item) => item.eventType === "mens-singles")) {
    const officialMatches = await getOfficialWimbledonFinals();
    finals = selectWimbledonFinals([...apiMatches, ...officialMatches]);
  }
  const women = finals.find((item) => item.eventType === "womens-singles"); const men = finals.find((item) => item.eventType === "mens-singles"); const others = finals.filter((item) => !["womens-singles", "mens-singles"].includes(item.eventType));
  const live = finals.filter((item) => item.status === "live").length; const complete = finals.filter((item) => item.status === "completed").length;
  const title = live ? "Wimbledon Final Live" : women?.status === "completed" && men?.status === "completed" ? "Wimbledon Champions" : finals.some((item) => item.status === "scheduled") ? "Wimbledon Finals Weekend" : "Wimbledon Finals";
  return <section aria-labelledby="wimbledon-finals-title" className="mb-6 overflow-hidden rounded-3xl border border-green-500/50 bg-[#07150d] p-5 text-white shadow-2xl shadow-black/30 md:p-7">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-green-300">Championship center</p><h2 id="wimbledon-finals-title" className="mt-2 text-3xl font-black md:text-5xl">{title}</h2><p className="mt-2 text-zinc-300">{finals.length ? "Live provider data for Wimbledon's championship matches." : "Live final details are temporarily unavailable. Use the schedule, results and live hub for the latest updates."}</p></div>{finals.length ? <div className="flex gap-2 text-xs font-black"><span className="rounded-full bg-white/10 px-3 py-2">{live} live</span><span className="rounded-full bg-white/10 px-3 py-2">{complete} champions crowned</span><span className="rounded-full bg-white/10 px-3 py-2">{finals.length - complete} remaining</span></div> : null}</div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2"><FinalCard final={women} label="Ladies' Singles Final" /><FinalCard final={men} label="Gentlemen's Singles Final" /></div>
    {others.length ? <div className="mt-6"><h3 className="text-xl font-black">Other championship finals</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{others.map((final) => <Link key={final.id} href={final.matchUrl} className="rounded-xl border border-white/10 bg-black/30 p-4 hover:border-green-400"><p className="text-xs font-black uppercase text-green-300">{final.eventLabel}</p><p className="mt-2 break-words font-bold">{final.participants.map((item) => item.displayName).join(" vs ")}</p><p className="mt-2 text-sm text-zinc-400">{final.score || final.providerStatus}</p></Link>)}</div></div> : null}
    <nav aria-label="Wimbledon finals navigation" className="mt-6 flex flex-wrap gap-2">{nav.map(([href, label]) => <Link key={href} href={href} className="rounded-full border border-white/15 px-4 py-2 text-sm font-black hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400">{label}</Link>)}</nav>
  </section>;
}

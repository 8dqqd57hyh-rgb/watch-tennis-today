import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import LegalStreamingOptions from "@/components/LegalStreamingOptions";

export const metadata: Metadata = { title: "How to Watch Tennis in the USA | Legal Tennis Streaming Guide", description: "A US-focused guide to legal tennis streaming, TV packages, Grand Slam coverage checks and ATP/WTA viewing options.", alternates: { canonical: "https://watchtennistoday.com/watch-tennis-in-usa" } };

const rows = [
  ["Grand Slams", "Use event and country-specific broadcasters; ATP/WTA tour services usually do not include these rights."],
  ["ATP Tour", "Tennis TV is often the first official service to check, but blackout and country rules can apply."],
  ["WTA Tour", "Check WTA TV and local broadcasters because availability varies by market."],
  ["Live scores", "Use schedule and score pages for context, not as a substitute for licensed video rights."],
];
const faq = [
  { q: "Can I watch tennis free online?", a: "Only when an official broadcaster or tournament offers legal free coverage in your country. Do not assume a stream is free or legal because it appears in search results." },
  { q: "Which tennis streaming service is best?", a: "The best service depends on your country and the tournament. Grand Slams, ATP events and WTA events can be split across different rights holders." },
  { q: "Does this site host tennis streams?", a: "No. Watch Tennis Today provides schedule context, player pages and links to official or licensed viewing information." },
];

export default function Page() {
 const schema = [{ "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://watchtennistoday.com"},{"@type":"ListItem",position:2,name:"How to Watch Tennis in the USA",item:"https://watchtennistoday.com/watch-tennis-in-usa"}]}, {"@context":"https://schema.org","@type":"FAQPage", mainEntity: faq.map((item)=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))}];
 return <main className="mx-auto max-w-5xl p-4 text-zinc-900"><JsonLd data={schema} />
  <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500"><Link href="/">Home</Link><span>/</span><span>How to Watch Tennis in the USA</span></nav>
  <section className="rounded-3xl bg-zinc-950 p-8 text-white"><p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Legal streaming guide</p><h1 className="mt-3 text-4xl font-black md:text-6xl">How to Watch Tennis in the USA</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">A US-focused guide to legal tennis streaming, TV packages, Grand Slam coverage checks and ATP/WTA viewing options. This page is built for users who want a safe answer before paying for a subscription or clicking a live match link.</p></section>
  <article className="mt-8 space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-700 shadow-sm"><h2 className="text-2xl font-black text-zinc-950">How to choose a legal tennis stream</h2><p>Start with the tournament, not the player name. Tennis rights are sold by event, tour and territory, so the same player may appear on one service during an ATP or WTA event and on a different broadcaster during a Grand Slam. A safe viewing guide should explain that difference instead of pushing every visitor to the same link.</p><p>USA viewers should confirm the current broadcaster, subscription tier and device support before paying. Some providers include tennis in a general sports package, while others require a separate add-on. If a match is delayed by rain or moved to another court, the video feed may also move inside the provider app.</p><p>Watch Tennis Today does not host streams. The commercial opportunity here is trust: help users find legal viewing paths, collect player alerts with permission, and use affiliate links only when real partnerships exist in the configuration file. That approach protects AdSense quality and gives returning tennis fans a reason to come back.</p><p>For day-to-day use, combine this guide with <Link href="/tennis-schedule-today" className="font-bold text-green-700">today&apos;s schedule</Link>, <Link href="/live-tennis" className="font-bold text-green-700">live tennis</Link>, and player hubs for names like <Link href="/player/carlos-alcaraz" className="font-bold text-green-700">Carlos Alcaraz</Link> or <Link href="/player/iga-swiatek" className="font-bold text-green-700">Iga Swiatek</Link>.</p></article>
  <section className="mt-8"><LegalStreamingOptions country="usa" title="Recommended legal options for USA" /></section>
  <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">Comparison table</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b"><th className="p-3">Need</th><th className="p-3">Best first check</th></tr></thead><tbody>{rows.map((row)=><tr key={row[0]} className="border-b"><td className="p-3 font-bold">{row[0]}</td><td className="p-3 text-zinc-700">{row[1]}</td></tr>)}</tbody></table></div></section>
  <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">Internal guides</h2><div className="mt-4 flex flex-wrap gap-3"><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/wimbledon">Wimbledon hub</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/us-open">US Open hub</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/australian-open">Australian Open hub</Link><Link className="rounded-2xl bg-zinc-100 px-4 py-3 font-bold" href="/tennis-guides">Tennis guides</Link></div></section>
  <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">FAQ</h2><div className="mt-4 space-y-4">{faq.map((item)=><div key={item.q}><h3 className="font-black">{item.q}</h3><p className="mt-1 text-sm leading-7 text-zinc-700">{item.a}</p></div>)}</div></section>
 </main>;
}

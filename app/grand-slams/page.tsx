import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";

const SITE_URL = "https://watchtennistoday.com";

export const metadata: Metadata = {
  title: "Grand Slam Tennis Guides | Watch Tennis Today",
  description:
    "Grand Slam tennis hubs for Wimbledon, Roland Garros, the Australian Open and the US Open, with live, schedule and legal viewing links.",
  alternates: { canonical: `${SITE_URL}/grand-slams` },
};

const slamLinks = [
  { href: "/wimbledon", label: "Wimbledon", note: "Schedule, live, results, draw and country viewing guides." },
  { href: "/french-open", label: "Roland Garros", note: "French Open hub, order of play and streaming guidance." },
  { href: "/australian-open", label: "Australian Open", note: "Australian Open viewing and tournament context." },
  { href: "/us-open", label: "US Open", note: "US Open viewing and tournament context." },
];

export default function GrandSlamsPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Grand Slam Tennis Guides",
    description: metadata.description,
    url: `${SITE_URL}/grand-slams`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Grand Slams", item: `${SITE_URL}/grand-slams` },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-zinc-950">
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Grand Slams</span>
      </nav>
      <section className="rounded-3xl bg-zinc-950 p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Tennis majors</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Grand Slam Tennis Guides</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
          Start here for major tournament hubs, then move into schedules, order of play, live scores, results and legal broadcaster checks.
        </p>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {slamLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-emerald-400"
          >
            <h2 className="text-2xl font-black">{link.label}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">{link.note}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

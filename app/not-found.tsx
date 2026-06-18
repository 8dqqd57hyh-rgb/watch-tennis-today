import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Watch Tennis Today",
  description:
    "Find today's live tennis matches, schedules, player pages and tennis streaming guides.",
  robots: { index: false, follow: true },
};

const recoveryLinks = [
  {
    href: "/live-tennis",
    title: "Live tennis today",
    description: "See ATP and WTA matches happening now and later today.",
  },
  {
    href: "/today",
    title: "Today's tennis schedule",
    description: "Browse today's tennis order of play and match cards.",
  },
  {
    href: "/players",
    title: "Player pages",
    description: "Find schedules and watch information for top tennis players.",
  },
  {
    href: "/tennis-tournaments",
    title: "Tournament hub",
    description: "Explore Grand Slam, ATP and WTA tournament pages.",
  },
  {
    href: "/tennis-guides",
    title: "Tennis guides",
    description: "Read legal streaming, schedule and tennis TV guides.",
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-green-300">
          404
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
          This tennis page is not available.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
          The match, player or guide may have moved, expired, or never existed. Use one of the main tennis hubs below to keep browsing.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {recoveryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-green-400 hover:bg-zinc-900"
            >
              <h2 className="text-xl font-black text-white">{link.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

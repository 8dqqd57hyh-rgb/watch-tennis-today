import Link from "next/link";
import type { RelatedContentLink } from "@/src/lib/intelligence/types";
import type { WatchAvailability } from "@/src/lib/enrichment";

export type QuickFact = { label: string; value: string | number | null | undefined };

export function EnrichmentQuickFacts({
  title = "Quick facts",
  eyebrow = "Entity intelligence",
  facts,
  dark = false,
}: {
  title?: string;
  eyebrow?: string;
  facts: QuickFact[];
  dark?: boolean;
}) {
  const shell = dark
    ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white"
    : "rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-sm";
  const card = dark
    ? "rounded-2xl border border-zinc-800 bg-black p-4"
    : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4";
  const muted = dark ? "text-zinc-500" : "text-zinc-500";

  return (
    <section className={shell}>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600 dark:text-green-400">{eyebrow}</p>
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {facts.filter((fact) => fact.value !== undefined && fact.value !== null && String(fact.value).trim() !== "").map((fact) => (
          <div key={fact.label} className={card}>
            <p className={`text-xs font-black uppercase tracking-wide ${muted}`}>{fact.label}</p>
            <p className="mt-2 text-lg font-black leading-tight">{String(fact.value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EnrichmentLinkGrid({
  title,
  eyebrow = "Related content",
  groups,
  dark = false,
}: {
  title: string;
  eyebrow?: string;
  groups: { title: string; links: RelatedContentLink[] }[];
  dark?: boolean;
}) {
  const visibleGroups = groups.filter((group) => group.links.length > 0);
  if (!visibleGroups.length) return null;

  const shell = dark
    ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white"
    : "rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-sm";
  const groupShell = dark
    ? "rounded-2xl border border-zinc-800 bg-black p-4"
    : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4";
  const linkClass = dark
    ? "rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-200 hover:border-green-400"
    : "rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-black text-zinc-800 hover:border-green-500";

  return (
    <section className={shell}>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600 dark:text-green-400">{eyebrow}</p>
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visibleGroups.map((group) => (
          <div key={group.title} className={groupShell}>
            <h3 className="font-black">{group.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.links.slice(0, 10).map((link) => (
                <Link key={link.id} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EnrichmentWatchSummary({
  availability,
  title = "Watching options",
  summary,
  dark = false,
}: {
  availability: WatchAvailability;
  title?: string;
  summary?: string;
  dark?: boolean;
}) {
  const shell = dark
    ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white"
    : "rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-sm";

  return (
    <section className={shell}>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600 dark:text-green-400">Coverage summary</p>
      <h2 className="text-2xl font-black">{title}</h2>
      {summary ? <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-300">{summary}</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
          <p className="text-xs font-black uppercase text-zinc-500">Countries</p>
          <p className="mt-2 text-2xl font-black">{availability.countries.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
          <p className="text-xs font-black uppercase text-zinc-500">Broadcasters</p>
          <p className="mt-2 text-2xl font-black">{availability.broadcasters.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
          <p className="text-xs font-black uppercase text-zinc-500">Free route</p>
          <p className="mt-2 text-lg font-black">{availability.hasFreeOption ? "Listed" : "Not listed"}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
          <p className="text-xs font-black uppercase text-zinc-500">Subscription</p>
          <p className="mt-2 text-lg font-black">{availability.requiresSubscription ? "Usually required" : "Varies"}</p>
        </div>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
        Last verified: {availability.lastVerified || "not matched yet"} · Confidence: {availability.confidence || "needs check"}
      </p>
    </section>
  );
}

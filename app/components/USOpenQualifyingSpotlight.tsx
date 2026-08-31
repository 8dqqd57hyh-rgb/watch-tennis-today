import Link from "next/link";

export default function USOpenQualifyingSpotlight() {
  return (
    <section aria-labelledby="us-open-spotlight-title" className="mb-6 overflow-hidden rounded-3xl border border-blue-400/35 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_42%),linear-gradient(135deg,#18181b,#09090b)] p-5 md:p-7" data-testid="us-open-spotlight">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">US Open 2026</p>
          <h2 id="us-open-spotlight-title" className="mt-3 text-2xl font-black md:text-4xl">Follow the US Open live</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base">Live matches, today&apos;s schedule, results and legal viewing options in one place.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/us-open" className="rounded-full bg-blue-400 px-5 py-3 text-sm font-black text-black hover:bg-blue-300">US Open hub</Link>
          <Link href="/today" className="rounded-full border border-blue-400/35 px-5 py-3 text-sm font-black text-blue-100 hover:border-blue-300">Today&apos;s matches</Link>
        </div>
      </div>
    </section>
  );
}

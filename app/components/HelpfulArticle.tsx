import Link from "next/link";

type Section = {
  title: string;
  body: string[];
};

type HelpfulArticleProps = {
  eyebrow: string;
  title: string;
  description: string;
  updated?: string;
  sections: Section[];
  related?: { href: string; label: string }[];
};

export default function HelpfulArticle({
  eyebrow,
  title,
  description,
  updated = "June 2026",
  sections,
  related = [],
}: HelpfulArticleProps) {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-emerald-700 hover:text-emerald-900">
          ← Back to Watch Tennis Today
        </Link>

        <header className="mt-8 rounded-[2rem] bg-zinc-950 p-8 text-white shadow-sm">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{description}</p>
          <p className="mt-5 text-sm font-semibold text-zinc-500">Last reviewed: {updated}</p>
        </header>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="mb-4 text-2xl font-black tracking-tight text-zinc-950">{section.title}</h2>
              <div className="space-y-4 text-base leading-8 text-zinc-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {related.length > 0 && (
          <aside className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
            <h2 className="mb-4 text-2xl font-black text-zinc-950">Useful next reads</h2>
            <div className="flex flex-wrap gap-3">
              {related.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-zinc-950 shadow-sm ring-1 ring-zinc-200 hover:ring-emerald-400">
                  {item.label} →
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </main>
  );
}

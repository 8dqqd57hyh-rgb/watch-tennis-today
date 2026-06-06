import Link from "next/link";

type LinkItem = {
  href: string;
  label: string;
};

type AdSenseEditorialBlockProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  paragraphs: string[];
  checklist?: string[];
  links?: LinkItem[];
};

export default function AdSenseEditorialBlock({
  eyebrow = "Editorial guide",
  title,
  intro,
  paragraphs,
  checklist = [],
  links = [],
}: AdSenseEditorialBlockProps) {
  return (
    <section className="my-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-7 md:p-9">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-green-400">
        {eyebrow}
      </p>
      <h2 className="mb-4 text-3xl font-black md:text-4xl">{title}</h2>
      <p className="mb-6 max-w-4xl text-lg leading-8 text-zinc-300">{intro}</p>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-zinc-300 leading-8">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <aside className="rounded-3xl border border-zinc-800 bg-black p-6">
          <h3 className="mb-4 text-xl font-black">How to use this page</h3>
          {checklist.length > 0 ? (
            <ul className="space-y-3 text-sm font-semibold leading-6 text-zinc-300">
              {checklist.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          ) : null}

          {links.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-black text-zinc-200 hover:border-green-500 hover:text-green-400"
                >
                  {item.label} →
                </Link>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

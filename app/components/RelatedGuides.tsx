import Link from "next/link";
import type { GuideArticle } from "@/app/guides/articles";

type RelatedGuideLink = {
  href: string;
  title: string;
  description: string;
  category?: string;
};

type RelatedGuidesProps = {
  title?: string;
  eyebrow?: string;
  guides: Array<GuideArticle | RelatedGuideLink>;
  className?: string;
};

function toGuideLink(guide: GuideArticle | RelatedGuideLink): RelatedGuideLink {
  if ("slug" in guide) {
    return {
      href: `/guides/${guide.slug}`,
      title: guide.title,
      description: guide.description,
      category: guide.category,
    };
  }

  return guide;
}

export default function RelatedGuides({
  title = "Related guides",
  eyebrow,
  guides,
  className = "",
}: RelatedGuidesProps) {
  const guideLinks = guides.map(toGuideLink).slice(0, 8);

  if (guideLinks.length === 0) return null;

  return (
    <section className={`rounded-3xl border border-zinc-800 bg-zinc-950 p-6 ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {guideLinks.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-2xl border border-zinc-800 p-4 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
          >
            {guide.category ? (
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                {guide.category}
              </span>
            ) : null}
            <span className="font-black">{guide.title}</span>
            <span className="mt-2 block leading-6 text-zinc-500">{guide.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

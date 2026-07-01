import Link from "next/link";

export type RelatedPageLink = {
  href: string;
  label: string;
  description?: string;
  eyebrow?: string;
};

type RelatedPagesProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  links: RelatedPageLink[];
  currentPath?: string;
  className?: string;
  variant?: "dark" | "light";
};

function normalizeHref(href: string) {
  const [path] = href.split(/[?#]/);
  const normalized = path && path.length > 1 ? path.replace(/\/+$/, "") : path;

  return normalized || "/";
}

function uniqueRelatedLinks(links: RelatedPageLink[], currentPath?: string) {
  const seen = new Set<string>();
  const current = currentPath ? normalizeHref(currentPath) : null;
  const result: RelatedPageLink[] = [];

  for (const link of links) {
    const href = normalizeHref(link.href);

    if (!href.startsWith("/")) continue;
    if (current && href === current) continue;
    if (seen.has(href)) continue;

    seen.add(href);
    result.push({ ...link, href });

    if (result.length === 8) break;
  }

  return result;
}

export default function RelatedPages({
  title = "Related pages",
  eyebrow,
  description,
  links,
  currentPath,
  className = "",
  variant = "dark",
}: RelatedPagesProps) {
  const relatedLinks = uniqueRelatedLinks(links, currentPath);

  if (relatedLinks.length === 0) return null;

  const isLight = variant === "light";

  return (
    <section
      className={[
        "rounded-3xl border p-6",
        isLight
          ? "border-slate-200 bg-white text-slate-950 shadow-sm"
          : "border-zinc-800 bg-zinc-950 text-white",
        className,
      ].filter(Boolean).join(" ")}
      data-testid="related-pages"
    >
      {eyebrow ? (
        <p className={`mb-2 text-xs font-black uppercase tracking-[0.2em] ${isLight ? "text-emerald-700" : "text-emerald-300"}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-black">{title}</h2>
      {description ? (
        <p className={`mt-3 max-w-3xl text-sm leading-7 ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
          {description}
        </p>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {relatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "rounded-2xl border p-4 text-sm transition",
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-900 hover:border-emerald-500 hover:bg-white"
                : "border-zinc-800 bg-black text-zinc-300 hover:border-emerald-400 hover:text-white",
            ].join(" ")}
          >
            {link.eyebrow ? (
              <span className={`mb-2 block text-xs font-black uppercase tracking-[0.16em] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                {link.eyebrow}
              </span>
            ) : null}
            <span className="block font-black">{link.label}</span>
            {link.description ? (
              <span className={`mt-2 block leading-6 ${isLight ? "text-slate-600" : "text-zinc-500"}`}>
                {link.description}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGuideArticle,
  getGuideArticleDates,
  getGuideReadingTime,
  getGuideSourceReferences,
  getRelatedGuides,
  guideArticles,
} from "../articles";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return guideArticles
    .filter((article) => Boolean(article?.slug))
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Watch Tennis Today`,
    description: article.description,
    alternates: { canonical: `https://watchtennistoday.com/guides/${article.slug}` },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) notFound();

  const related = getRelatedGuides(article, 4);
  const { publishedDate, updatedDate } = getGuideArticleDates(article);
  const readingTime = getGuideReadingTime(article);
  const sourceReferences = getGuideSourceReferences(article);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: publishedDate,
    dateModified: updatedDate,
    author: { "@type": "Organization", name: "Watch Tennis Today", url: "https://watchtennistoday.com/authors/watch-tennis-today" },
    publisher: { "@type": "Organization", name: "Watch Tennis Today", url: "https://watchtennistoday.com" },
    mainEntityOfPage: `https://watchtennistoday.com/guides/${article.slug}`,
    articleSection: article.category,
    wordCount: [article.intro, ...article.sections.map((section) => section.body)].join(" ").split(/\s+/).length,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" },
      { "@type": "ListItem", position: 2, name: "Tennis Guides", item: "https://watchtennistoday.com/tennis-guides" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://watchtennistoday.com/guides/${article.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className="mx-auto max-w-4xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/tennis-guides" className="hover:text-white">Tennis Guides</Link>
          <span>/</span>
          <span className="text-white">{article.title}</span>
        </nav>

        <header className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">{article.category} guide</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">{article.description}</p>
          <dl className="mt-6 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <dt className="font-black uppercase tracking-wide text-zinc-500">Published</dt>
              <dd className="mt-1">{publishedDate}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <dt className="font-black uppercase tracking-wide text-zinc-500">Last updated</dt>
              <dd className="mt-1">{updatedDate}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <dt className="font-black uppercase tracking-wide text-zinc-500">Reading time</dt>
              <dd className="mt-1">{readingTime} minutes</dd>
            </div>
          </dl>
        </header>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-lg leading-9 text-zinc-300">
          <h2 className="mb-3 text-2xl font-black text-white">What this guide helps you do</h2>
          <p>{article.intro}</p>
        </section>

        <div className="mt-8 space-y-7 text-lg leading-9 text-zinc-300">
          {article.sections.map((section) => (
            <section key={`${article.slug}-${section.heading}`} className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h2 className="mb-3 text-2xl font-black text-white">{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black text-white">FAQ</h2>
          <div className="mt-5 space-y-5">
            {article.faq.map((item) => (
              <div key={item.question} className="border-t border-zinc-800 pt-5">
                <h3 className="text-lg font-black text-white">{item.question}</h3>
                <p className="mt-2 leading-8 text-zinc-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black text-white">Sources and review notes</h2>
          <p className="mt-3 leading-8 text-zinc-300">
            This guide is editorial content for tennis fans. Rules, rankings and broadcast availability can change, so readers should verify match-specific details with official tournament or broadcaster sources before making viewing decisions.
          </p>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {sourceReferences.map((source) => (
              <li key={source}>• {source}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
            <Link href="/editorial-policy" className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-200 hover:border-emerald-300">Editorial policy</Link>
            <Link href="/how-we-source-data" className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-200 hover:border-emerald-300">How we source data</Link>
            <Link href="/how-we-verify-streams" className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-200 hover:border-emerald-300">How we verify streams</Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Related guides</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link key={item.slug} href={`/guides/${item.slug}`} className="rounded-2xl border border-zinc-800 p-4 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">
                  <span className="font-black">{item.title}</span>
                  <span className="mt-2 block text-zinc-500">{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <aside className="mt-10 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6 text-zinc-300">
          <h2 className="text-2xl font-black text-white">Our legal-streaming rule</h2>
          <p className="mt-3 leading-8">
            Watch Tennis Today does not host live streams, embed copyrighted broadcasts or claim that every match is available for free. We help readers understand schedules, match context and where to verify official broadcaster availability.
          </p>
        </aside>
      </article>
    </main>
  );
}

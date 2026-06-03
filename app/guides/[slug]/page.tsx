import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideArticle, guideArticles } from "../articles";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
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

  const related = guideArticles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: "Watch Tennis Today" },
    publisher: { "@type": "Organization", name: "Watch Tennis Today" },
    mainEntityOfPage: `https://watchtennistoday.com/guides/${article.slug}`,
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

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="mx-auto max-w-4xl">
        <Link href="/guides" className="text-zinc-400 hover:text-white">← All guides</Link>
        <header className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">{article.category} guide</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">{article.description}</p>
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

        {related.length > 0 && (
          <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Related guides</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/guides/${item.slug}`} className="rounded-2xl border border-zinc-800 p-4 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">
                  <span className="font-black">{item.title}</span>
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

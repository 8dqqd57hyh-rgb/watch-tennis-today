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

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/guides" className="text-zinc-400 hover:text-white">← All guides</Link>
        <header className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Tennis guide</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">{article.description}</p>
        </header>
        <div className="mt-8 space-y-7 text-lg leading-9 text-zinc-300">
          {article.sections.map((section, index) => (
            <section key={`${article.slug}-${index}`} className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h2 className="mb-3 text-2xl font-black text-white">{index === 0 ? "Quick answer" : `Point ${index + 1}`}</h2>
              <p>{section}</p>
            </section>
          ))}
        </div>
        <aside className="mt-10 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6 text-zinc-300">
          <h2 className="text-2xl font-black text-white">Our legal-streaming rule</h2>
          <p className="mt-3 leading-8">
            Watch Tennis Today does not host live streams or embed copyrighted broadcasts. We help readers understand schedules, match context and where to verify official broadcaster availability.
          </p>
        </aside>
      </article>
    </main>
  );
}

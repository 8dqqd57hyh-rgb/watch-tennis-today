import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import AuthorBox from "@/app/components/AuthorBox";
import RelatedGuides from "@/app/components/RelatedGuides";
import { notFound } from "next/navigation";
import {
  authorProfile,
  buildArticleAuthorSchema,
  buildOrganizationSchema,
} from "@/data/authorProfile";
import {
  getGuideArticle,
  getGuideArticleDates,
  getGuideReadingTime,
  getGuideSourceReferences,
  getRelatedGuides,
  publishedGuideArticles,
} from "../articles";
import { robotsFor } from "@/app/lib/technicalSeo";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return publishedGuideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Watch Tennis Today`,
    description: article.description,
    robots: robotsFor({ index: true }),
    alternates: { canonical: `https://watchtennistoday.com/guides/${article.slug}` },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) notFound();

  const related = getRelatedGuides(article, 6);
  const supplementalLinkMap: Record<string, Array<{ href: string; label: string; description: string }>> = {
    "tennis-retirement-walkover-withdrawal": [
      {
        href: "/tennis-glossary",
        label: "Tennis glossary",
        description: "Quick definitions for RET, walkover, withdrawal and other tennis terms.",
      },
      {
        href: "/tennis-scoring-explained",
        label: "Tennis scoring explained",
        description: "A broader scoring guide for points, games, sets and match results.",
      },
    ],
    "tennis-qualifying-rounds-explained": [
      {
        href: "/tennis-glossary",
        label: "Tennis glossary",
        description: "Quick definitions for qualifier, lucky loser, wild card, seed and draw terms.",
      },
      {
        href: "/tennis-guides",
        label: "Tennis guides",
        description: "The full guide hub for rules, rankings, tournament structure and legal viewing context.",
      },
    ],
  };
  const supplementalLinks = supplementalLinkMap[article.slug] || [];
  const isAtpLevelsGuide = article.slug === "masters-1000-500-250-explained";
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
    author: buildArticleAuthorSchema(),
    publisher: buildOrganizationSchema(),
    mainEntityOfPage: `https://watchtennistoday.com/guides/${article.slug}`,
    articleSection: article.category,
    wordCount: [article.intro, ...article.sections.map((section) => section.body)].join(" ").split(/\s+/).length,
  };

  const personSchema = {
    "@context": "https://schema.org",
    ...buildArticleAuthorSchema(),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
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
          <p className="mt-4 text-sm font-semibold text-zinc-400">
            By{" "}
            <Link href="/authors/watch-tennis-today" className="text-emerald-300 hover:text-white">
              {authorProfile.name}
            </Link>
            {" "}for Watch Tennis Today
          </p>
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

        {isAtpLevelsGuide ? (
          <section className="mt-8 overflow-hidden rounded-3xl border border-emerald-800 bg-zinc-950" aria-labelledby="atp-levels-comparison">
            <div className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">Quick comparison</p>
              <h2 id="atp-levels-comparison" className="mt-2 text-2xl font-black text-white">Masters 1000 vs ATP 500 vs ATP 250</h2>
              <p className="mt-2 text-zinc-400">The category signals the champion&apos;s usual ranking reward and the event&apos;s place in the ATP calendar.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-left text-sm">
                <thead className="border-y border-zinc-800 bg-black text-zinc-400">
                  <tr><th className="px-6 py-3">Level</th><th className="px-6 py-3">Champion points</th><th className="px-6 py-3">Typical role</th><th className="px-6 py-3">Field</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-200">
                  <tr><th className="px-6 py-4 text-white">Masters 1000</th><td className="px-6 py-4">1,000</td><td className="px-6 py-4">Elite regular-tour event</td><td className="px-6 py-4">Usually deepest</td></tr>
                  <tr><th className="px-6 py-4 text-white">ATP 500</th><td className="px-6 py-4">500</td><td className="px-6 py-4">Major ranking week</td><td className="px-6 py-4">Often very strong</td></tr>
                  <tr><th className="px-6 py-4 text-white">ATP 250</th><td className="px-6 py-4">250</td><td className="px-6 py-4">Tour title and ranking opportunity</td><td className="px-6 py-4">More variable</td></tr>
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 border-t border-zinc-800 p-6 sm:grid-cols-2">
              <Link href="/today" data-track-event="guide_next_step_opened" data-track-area="atp_levels_comparison" className="rounded-xl bg-emerald-400 px-4 py-3 text-center font-black text-black hover:bg-emerald-300">See today&apos;s ATP matches</Link>
              <Link href="/tennis-tournaments" data-track-event="guide_next_step_opened" data-track-area="atp_levels_comparison" className="rounded-xl border border-zinc-700 px-4 py-3 text-center font-black text-white hover:border-emerald-400">Explore tournament levels</Link>
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-lg leading-9 text-zinc-300">
          <h2 className="mb-3 text-2xl font-black text-white">What this guide helps you do</h2>
          <p>{article.intro}</p>
        </section>

        <div className="mt-8 space-y-7 text-lg leading-9 text-zinc-300">
          {article.sections.map((section, index) => (
            <section key={`${article.slug}-${section.heading}`} className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h2 className="mb-3 text-2xl font-black text-white">{section.heading}</h2>
              <p>{section.body}</p>
              {isAtpLevelsGuide && index === 0 ? (
                <div className="mt-5 flex flex-wrap gap-3 border-t border-zinc-800 pt-5 text-sm">
                  <Link href="/today" data-track-event="guide_next_step_opened" data-track-area="guide_first_section" className="rounded-full bg-emerald-400 px-4 py-2 font-black text-black hover:bg-emerald-300">What&apos;s playing today?</Link>
                  <Link href="/tennis-calendar" data-track-event="guide_next_step_opened" data-track-area="guide_first_section" className="rounded-full border border-zinc-700 px-4 py-2 font-black text-white hover:border-emerald-400">View the tennis calendar</Link>
                </div>
              ) : null}
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

        <div className="mt-10">
          <EmailCapture
            title="Get useful tennis guide updates"
            description="Get low-noise updates when major schedule, rules or legal viewing guides are improved."
            placeholder="Email for guide updates"
            buttonText="Get updates"
            contextType="guide"
            contextValue={article.slug}
            dark
          />
        </div>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black text-white">Sources and review notes</h2>
          <p className="mt-3 leading-8 text-zinc-300">
            This guide is editorial content for tennis fans. Rules, rankings and broadcast availability can change, so readers should verify match-specific details with official tournament or broadcaster sources before making viewing decisions.
          </p>
          <p className="mt-3 leading-8 text-zinc-300">
            Last updated by {authorProfile.name} on {updatedDate}. The review focuses on current tennis rules context, official viewing routes and whether any schedule or broadcaster claims need more cautious wording.
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

        <AuthorBox />

        <RelatedGuides guides={related} className="mt-10" />

        {supplementalLinks.length > 0 ? (
          <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Useful tennis basics</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {supplementalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-zinc-800 p-4 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  <span className="font-black">{item.label}</span>
                  <span className="mt-2 block leading-6 text-zinc-500">{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

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

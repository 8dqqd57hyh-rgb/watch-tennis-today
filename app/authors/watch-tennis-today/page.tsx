import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  authorProfile,
  buildAuthorPersonSchema,
  buildOrganizationSchema,
  siteUrl,
} from "@/data/authorProfile";
import { publishedGuideArticles } from "@/app/guides/articles";

export const metadata: Metadata = {
  title: "Angelika Sokolova | Founder of Watch Tennis Today",
  description:
    "Meet Angelika Sokolova, founder of Watch Tennis Today, and learn how she researches tennis schedules, broadcasters and legal streaming availability.",
  alternates: { canonical: `${siteUrl}/authors/watch-tennis-today` },
  openGraph: {
    title: "Angelika Sokolova | Watch Tennis Today",
    description:
      "Founder profile, tennis research process and recent Watch Tennis Today articles.",
    url: `${siteUrl}/authors/watch-tennis-today`,
    type: "profile",
    images: [
      {
        url: authorProfile.image,
        width: 800,
        height: 1199,
        alt: `${authorProfile.name}, founder of Watch Tennis Today`,
      },
    ],
  },
};

export default function AuthorPage() {
  const recentArticles = publishedGuideArticles.slice(0, 6);
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${authorProfile.url}#profile-page`,
        name: `${authorProfile.name} author profile`,
        url: authorProfile.url,
        description: metadata.description,
        mainEntity: { "@id": `${authorProfile.url}#person` },
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      buildAuthorPersonSchema(),
      buildOrganizationSchema(),
    ],
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-5xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Angelika Sokolova</span>
        </nav>

        <section className="mt-10 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[360px] bg-zinc-900">
              <Image
                src={authorProfile.imagePath}
                alt={`${authorProfile.name}, founder of Watch Tennis Today`}
                fill
                preload
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 md:p-10">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                Founder and author
              </p>
              <h1 className="text-4xl font-black leading-tight md:text-6xl">
                {authorProfile.name}
              </h1>
              <p className="mt-3 text-lg font-bold text-zinc-200">
                {authorProfile.role}
              </p>
              <p className="mt-6 text-lg leading-9 text-zinc-300">
                {authorProfile.bio}
              </p>
              <p className="mt-5 leading-8 text-zinc-400">
                {authorProfile.researchNote}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Areas of expertise</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">
              {authorProfile.expertise.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Editorial approach</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Angelika avoids fake credentials, guaranteed stream promises and
              unsupported claims about TV rights. Pages are written to help fans
              check official tournament schedules, licensed broadcasters and
              country-specific availability before making a viewing decision.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
              <Link href="/editorial-policy" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">
                Editorial policy
              </Link>
              <Link href="/how-we-source-data" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">
                Data sources
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black">Recent articles</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recentArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className="rounded-2xl border border-zinc-800 bg-black p-5 transition hover:border-emerald-400"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                  {article.category}
                </p>
                <h3 className="mt-2 text-xl font-black">{article.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

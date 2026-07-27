import type { Metadata } from "next";
import Link from "next/link";
import {
  BROADCAST_REPORT_CSV_PATH,
  BROADCAST_REPORT_PATH,
  getBroadcastResearchSummary,
} from "@/app/lib/broadcastResearch";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import {
  getNormalizedBroadcastRecords,
  type TennisBroadcastConfidence,
} from "@/src/data/tennisBroadcasts";

const title = "Tennis Broadcast Access Report: Country-by-Country Dataset";
const description =
  "Explore and download a source-backed dataset of tennis broadcasters by country, competition, confidence level and verification date.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl(BROADCAST_REPORT_PATH) },
  openGraph: {
    title,
    description,
    type: "article",
    url: canonicalUrl(BROADCAST_REPORT_PATH),
  },
  twitter: { card: "summary_large_image", title, description },
};

const confidenceCopy: Record<TennisBroadcastConfidence, { label: string; explanation: string }> = {
  confirmed: {
    label: "Confirmed",
    explanation: "The reviewed source directly supports the country and competition mapping.",
  },
  partial: {
    label: "Partial",
    explanation: "The source supports part of the mapping, but viewers should confirm local access details.",
  },
  needs_check: {
    label: "Needs check",
    explanation: "The likely route is recorded, but match-week confirmation is still required.",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function TennisBroadcastAccessReportPage() {
  const records = getNormalizedBroadcastRecords();
  const summary = getBroadcastResearchSummary(records);
  const countrySummaries = Array.from(
    records.reduce((countries, record) => {
      const current = countries.get(record.countryCode) ?? {
        code: record.countryCode,
        name: record.countryName,
        slug: record.countrySlug,
        records: 0,
        confirmed: 0,
        officialSources: new Set<string>(),
      };
      current.records += 1;
      if (record.confidence === "confirmed") current.confirmed += 1;
      current.officialSources.add(record.officialUrl);
      countries.set(record.countryCode, current);
      return countries;
    }, new Map<string, { code: string; name: string; slug: string; records: number; confirmed: number; officialSources: Set<string> }>()),
  )
    .map(([, country]) => country)
    .sort((a, b) => a.name.localeCompare(b.name));

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: title,
    description,
    url: canonicalUrl(BROADCAST_REPORT_PATH),
    dateModified: summary.latestVerified,
    creator: {
      "@type": "Organization",
      name: "Watch Tennis Today",
      url: canonicalUrl("/"),
    },
    spatialCoverage: countrySummaries.map((country) => country.name),
    variableMeasured: [
      "Country",
      "Competition",
      "Broadcaster",
      "Streaming service",
      "Official source URL",
      "Access requirements",
      "Confidence",
      "Last verified",
    ],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: canonicalUrl(BROADCAST_REPORT_CSV_PATH),
    },
    license: canonicalUrl("/terms"),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Tennis Broadcast Access Report", item: canonicalUrl(BROADCAST_REPORT_PATH) },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />

      <article className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-zinc-200">Research</span>
        </nav>

        <header className="mt-6 rounded-[2rem] border border-emerald-900 bg-emerald-950/30 p-7 md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Open research dataset</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Tennis Broadcast Access Report</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            A country-by-country research snapshot of legal viewing routes for the four Grand Slams, ATP Tour and WTA Tour. Every row includes an official source, a confidence label and a verification date.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={BROADCAST_REPORT_CSV_PATH} download className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black hover:bg-white">
              Download the CSV
            </a>
            <Link href="/how-we-source-data" className="rounded-full border border-zinc-600 px-5 py-3 font-black hover:border-white">
              Read our sourcing policy
            </Link>
          </div>
          <p className="mt-5 text-sm text-zinc-400">Dataset last verified: {formatDate(summary.latestVerified)}</p>
        </header>

        <section aria-labelledby="snapshot-heading" className="mt-8">
          <h2 id="snapshot-heading" className="text-3xl font-black">Dataset snapshot</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [summary.recordCount, "country/competition records"],
              [summary.countryCount, "countries researched"],
              [summary.broadcasterCount, "named broadcasters"],
              [summary.tournamentCount, "competition groups"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                <p className="text-4xl font-black text-emerald-300">{value}</p>
                <p className="mt-2 text-zinc-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="confidence-heading" className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <h2 id="confidence-heading" className="text-3xl font-black">What the confidence labels mean</h2>
          <p className="mt-3 max-w-4xl leading-7 text-zinc-300">
            Broadcast rights are territorial and can change. A row is not presented as guaranteed access to every match or court. Check the linked official source before subscribing.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(Object.entries(confidenceCopy) as Array<[TennisBroadcastConfidence, (typeof confidenceCopy)[TennisBroadcastConfidence]]>).map(([key, item]) => (
              <div key={key} className="rounded-2xl border border-zinc-800 p-5">
                <p className="font-black text-white">{item.label}: {summary.confidenceCounts[key]} rows</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="coverage-heading" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="coverage-heading" className="text-3xl font-black">Coverage by country</h2>
              <p className="mt-2 text-zinc-400">Counts reflect published dataset rows, not the number of matches available.</p>
            </div>
            <a href={BROADCAST_REPORT_CSV_PATH} download className="font-black text-emerald-300 hover:text-white">Download all row-level data →</a>
          </div>
          <div className="mt-5 overflow-x-auto rounded-3xl border border-zinc-800">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead className="bg-zinc-900 text-sm uppercase tracking-wide text-zinc-400">
                <tr>
                  <th className="px-5 py-4">Country</th>
                  <th className="px-5 py-4">Records</th>
                  <th className="px-5 py-4">Confirmed</th>
                  <th className="px-5 py-4">Official source URLs</th>
                  <th className="px-5 py-4">Country guide</th>
                </tr>
              </thead>
              <tbody>
                {countrySummaries.map((country) => (
                  <tr key={country.code} className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
                    <th scope="row" className="px-5 py-4 font-black text-white">{country.name}</th>
                    <td className="px-5 py-4">{country.records}</td>
                    <td className="px-5 py-4">{country.confirmed}</td>
                    <td className="px-5 py-4">{country.officialSources.size}</td>
                    <td className="px-5 py-4"><Link href={`/watch-tennis-in/${country.slug}`} className="font-bold text-emerald-300 hover:text-white">View guide</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="method-heading" className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 id="method-heading" className="text-3xl font-black">Methodology</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-zinc-300">
              <li>Separate each country and competition into an individual research row.</li>
              <li>Record the named broadcaster or service and its official source URL.</li>
              <li>Label access requirements only when supported by the reviewed information.</li>
              <li>Assign a confidence level and retain the row-level verification date.</li>
              <li>Publish uncertain rows instead of presenting them as confirmed facts.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Reuse and corrections</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Researchers and publishers may cite this report and link to its canonical URL. The CSV is provided for analysis; attribution to Watch Tennis Today is appreciated. Rights can change after publication, so retain the confidence and verification fields when reusing rows.
            </p>
            <p className="mt-4 leading-7 text-zinc-300">
              Found an outdated mapping? Send the affected row, country and an official correction source through our contact page.
            </p>
            <Link href="/contact" className="mt-5 inline-block font-black text-emerald-300 hover:text-white">Submit a correction →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

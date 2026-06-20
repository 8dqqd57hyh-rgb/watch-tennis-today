import Link from "next/link";

export const metadata = {
  title: "Editorial Policy | Watch Tennis Today",
  description:
    "Learn how Watch Tennis Today creates, reviews and updates tennis schedule, broadcaster and streaming guide content.",
  alternates: {
    canonical: "https://watchtennistoday.com/editorial-policy",
  },
};

export const dynamic = "force-dynamic";
export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          Editorial Policy
        </h1>

        <section className="mt-8 space-y-6 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today is created to help tennis fans find match
            schedules, tournament pages and legal broadcaster information more
            easily. Our goal is to make tennis viewing information clearer,
            safer and more useful.
          </p>

          <h2 className="text-2xl font-bold text-white">
            How we create content
          </h2>

          <p>
            Pages are written around practical tennis viewing questions, such as
            where a match may be shown, how tournament coverage works, and which
            official sources fans should check before watching.
          </p>

          <h2 className="text-2xl font-bold text-white">
            How we review information
          </h2>

          <p>
            Broadcast rights, schedules and match times can change. We aim to
            review key pages regularly and update information when official
            broadcasters, tournaments or data sources provide new details.
          </p>

          <h2 className="text-2xl font-bold text-white">
            Use of external sources
          </h2>

          <p>
            When available, we prefer official tournament websites, broadcaster
            pages, league or tour information, and reputable tennis data sources.
            Users should always confirm final availability directly with the
            relevant broadcaster or streaming service.
          </p>

          <h2 className="text-2xl font-bold text-white">
            Corrections
          </h2>

          <p>
            If you notice incorrect or outdated information, please contact us
            with the page URL, the country or tournament involved, and the
            official source showing the updated details.
          </p>

          <a
            href="/contact"
            className="inline-block text-white underline underline-offset-4"
          >
            Contact us about a correction
          </a>
        </section>
      </div>
    </main>
  );
}

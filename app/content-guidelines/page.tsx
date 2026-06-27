
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Content Guidelines",
  description: "Editorial and content quality standards for Watch Tennis Today.",
  alternates: { canonical: "https://watchtennistoday.com/content-guidelines" },
};

export default function ContentGuidelinesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Content Guidelines</h1>

      <div className="space-y-5 text-lg leading-8">
        <p>
          Watch Tennis Today publishes independently written tennis information,
          schedules, streaming availability guides and tournament coverage.
        </p>

        <p>
          We do not host copyrighted broadcasts or provide unauthorized streams.
          Our content is created for informational and editorial purposes.
        </p>

        <p>
          We prioritize accuracy, transparency, manual review and clear sourcing
          when publishing tennis schedules, player pages and tournament information.
        </p>

        <p>
          Content may be updated throughout the day as matches, schedules or
          broadcaster availability changes.
        </p>

        <p>
          Our goal is to help tennis fans discover where matches are legally
          available in their region.
        </p>
      </div>
    </main>
  );
}

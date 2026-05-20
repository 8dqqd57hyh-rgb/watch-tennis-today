export const metadata = {
  title: "How We Source Data | Watch Tennis Today",
  description:
    "Learn how Watch Tennis Today sources tennis schedules, match information and broadcaster details.",
  alternates: {
    canonical: "https://watchtennistoday.com/how-we-source-data",
  },
};

export default function HowWeSourceDataPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          How We Source Data
        </h1>

        <section className="mt-8 space-y-6 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today uses tennis schedule data, tournament information
            and broadcaster references to help fans find legal ways to follow
            tennis matches. Because tennis coverage changes often, every listing
            should be treated as a helpful guide rather than a final guarantee.
          </p>

          <h2 className="text-2xl font-bold text-white">
            Match and schedule data
          </h2>

          <p>
            Match pages and schedule pages may use tennis data providers,
            tournament information and public schedule references. Match times,
            courts and player participation can change due to weather,
            withdrawals, delays or tournament decisions.
          </p>

          <h2 className="text-2xl font-bold text-white">
            Broadcaster information
          </h2>

          <p>
            Broadcaster pages are created to point users toward official and
            legal viewing options. Availability may depend on country,
            subscription type, device, tournament and local rights agreements.
          </p>

          <h2 className="text-2xl font-bold text-white">
            Why information can change
          </h2>

          <p>
            Tennis schedules are especially dynamic. Matches may move courts,
            start later than expected or be suspended and resumed later. Broadcast
            platforms may also change their listings close to match time.
          </p>

          <h2 className="text-2xl font-bold text-white">
            What users should verify
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Final match time on the tournament or broadcaster website</li>
            <li>Whether the match is included in their subscription</li>
            <li>Whether the stream is available in their country</li>
            <li>Whether a broadcaster requires a TV package or streaming plan</li>
          </ul>

          <h2 className="text-2xl font-bold text-white">
            Corrections and updates
          </h2>

          <p>
            If you find outdated or incorrect information, please send the page
            link and the official source showing the updated details.
          </p>

          <a
            href="/contact"
            className="inline-block text-white underline underline-offset-4"
          >
            Contact us about data corrections
          </a>
        </section>
      </div>
    </main>
  );
}
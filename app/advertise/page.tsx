export const metadata = {
  title: "Advertise & Partnerships | Watch Tennis Today",
  description:
    "Partner with Watch Tennis Today to reach tennis fans looking for live matches, TV schedules and streaming options.",
};

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          Advertise & Partnerships
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-8">
          Watch Tennis Today helps tennis fans find live matches, TV channels,
          tournament schedules and legal streaming options.
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6">
          <h2 className="text-3xl font-black mb-3">
            Partnership Opportunities
          </h2>

          <ul className="text-zinc-300 leading-8 list-disc pl-6">
            <li>Streaming service partnerships</li>
            <li>Sports media collaborations</li>
            <li>Affiliate placements</li>
            <li>Sponsored tennis guides</li>
            <li>Display advertising</li>
          </ul>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-3">
            Contact
          </h2>

          <p className="text-zinc-300 leading-8">
            For partnerships, sponsorships or advertising inquiries, contact:
          </p>

          <a
            href="mailto:anzhalika_sokalava@icloud.com"
            className="inline-block mt-5 bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
          >
            anzhalika_sokalava@icloud.com
          </a>
        </section>
      </div>
    </main>
  );
}

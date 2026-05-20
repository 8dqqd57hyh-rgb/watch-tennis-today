export const metadata = {
  title: "Contact | Watch Tennis Today",
  description:
    "Contact Watch Tennis Today for questions about tennis schedules, broadcaster information, streaming guides and website feedback.",
  alternates: {
    canonical: "https://watchtennistoday.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">Contact</h1>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today helps tennis fans find live match information,
            tournament schedules, broadcaster guides and legal ways to watch
            tennis online.
          </p>

          <p>
            If you notice outdated match information, incorrect broadcaster
            details, broken links or have suggestions for improving the site,
            you can contact us by email.
          </p>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white mb-3">
              Email
            </h2>

            <p>
              <a
                href="mailto:anzhalika_sokalava@icloud.com"
                className="text-green-400 hover:text-green-300 font-bold"
              >
                anzhalika_sokalava@icloud.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              Corrections and updates
            </h2>

            <p>
              Tennis schedules, match statuses and broadcaster availability can
              change quickly. We try to keep information useful and accurate,
              but users should always confirm final availability with official
              broadcasters, tournaments or streaming providers.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
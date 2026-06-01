export const metadata = {
  title: "Contact | Watch Tennis Today",
  description:
    "Contact Watch Tennis Today for corrections, broadcaster updates, advertising questions or general feedback.",
  alternates: {
    canonical: "https://watchtennistoday.com/contact",
  },
};

export const dynamic = "force-dynamic";
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          Contact Watch Tennis Today
        </h1>

        <p className="text-zinc-300 mt-4 text-lg leading-relaxed">
          Use this page to contact Watch Tennis Today about corrections,
          broadcaster updates, partnership requests or general feedback.
        </p>

        <section className="mt-10 space-y-6 text-zinc-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              What you can contact us about
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>Incorrect broadcaster or streaming information</li>
              <li>Outdated match, tournament or schedule details</li>
              <li>Country-specific tennis viewing updates</li>
              <li>Advertising or sponsorship questions</li>
              <li>General website feedback</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Email
            </h2>

            <p>
              You can contact the site team by email:
            </p>

            <p className="mt-3">
              <a
                href="mailto:anzhalika_sokalava@icloud.com"
                className="text-white underline underline-offset-4"
              >
                anzhalika_sokalava@icloud.com
              </a>
            </p>

            <p className="mt-4 text-sm text-zinc-400">
              Please include the page URL and country if your message is about
              broadcaster availability or schedule corrections.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Editorial corrections
            </h2>

            <p>
              Tennis broadcast rights and schedules can change. If you notice
              incorrect information, please send the relevant page link and the
              official source where the updated information can be checked.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Terms of Use | Watch Tennis Today",
  description:
    "Terms of use for Watch Tennis Today, including website usage, external links and tennis streaming information.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          Terms of Use
        </h1>

        <p className="text-zinc-400 mb-6">
          Last updated: May 14, 2026
        </p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              1. Use of this website
            </h2>
            <p>
              Watch Tennis Today provides tennis schedules, match information,
              broadcaster references and links to external websites. By using
              this website, you agree to use it only for lawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              2. No streaming hosted by us
            </h2>
            <p>
              Watch Tennis Today does not host, broadcast, retransmit or provide
              unauthorized tennis streams. We provide information about official
              broadcasters, TV channels and legal streaming options where
              available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              3. External links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the content, availability, pricing, subscription
              terms or policies of those external websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              4. Accuracy of information
            </h2>
            <p>
              We try to keep tennis schedules, broadcaster information and match
              data accurate and up to date, but we cannot guarantee that all
              information will always be complete, current or error-free.
              Broadcasting rights may change by country, tournament and provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              5. Affiliate and advertising disclosure
            </h2>
            <p>
              Watch Tennis Today may display advertisements or include affiliate
              links in the future. If we use affiliate links, we may earn a
              commission when users click or purchase through those links, at no
              additional cost to the user.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              6. Changes to these terms
            </h2>
            <p>
              We may update these Terms of Use from time to time. Continued use
              of the website after changes means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              7. Contact
            </h2>
            <p>
              If you have questions about these Terms of Use, please contact us
              through the Contact page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

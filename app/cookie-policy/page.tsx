import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Watch Tennis Today",
  description:
    "Cookie Policy for Watch Tennis Today, including analytics, advertising, affiliate links and browser cookie controls.",
  alternates: {
    canonical: "https://watchtennistoday.com/cookie-policy",
  },
};

export const dynamic = "force-dynamic";
export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-6">Cookie Policy</h1>

        <p className="text-zinc-400 mb-8">Last updated: May 20, 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              1. What cookies are
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help websites remember information, measure usage
              and improve performance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              2. How we use cookies
            </h2>
            <p>
              Watch Tennis Today may use cookies and similar technologies for
              website functionality, analytics, advertising, affiliate tracking,
              performance measurement and security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              3. Analytics cookies
            </h2>
            <p>
              Analytics tools may help us understand which pages visitors use,
              how users find the website, what content is helpful and where the
              site can be improved. Analytics information is generally used in
              aggregate form.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              4. Advertising cookies
            </h2>
            <p>
              Advertising partners, including Google AdSense where applicable,
              may use cookies or similar technologies to serve ads, measure ad
              performance, prevent fraud and personalize advertising where
              permitted by law and user settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              5. Affiliate cookies
            </h2>
            <p>
              Some external affiliate partners may use cookies or tracking
              technologies to recognize referrals from this website. These
              cookies are controlled by the relevant third-party partner and are
              subject to their own policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              6. Managing cookies
            </h2>
            <p>
              You can control or delete cookies through your browser settings.
              You may also be able to manage advertising personalization through
              Google or other advertising partner settings. Disabling cookies may
              affect some website features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              7. More information
            </h2>
            <p>
              For more details about how information may be collected and used,
              please read our{" "}
              <a
                href="/privacy"
                className="text-green-400 hover:text-green-300 font-bold"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

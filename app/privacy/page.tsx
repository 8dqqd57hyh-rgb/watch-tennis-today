import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Watch Tennis Today",
  description:
    "Privacy Policy for Watch Tennis Today, including analytics, cookies and external websites.",
  alternates: {
  canonical: "https://watchtennistoday.com/privacy",
},
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-6">
          Privacy Policy
        </h1>

        <p className="text-zinc-400 mb-8">
          Last updated: June 3, 2026
        </p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              1. Overview
            </h2>
            <p>
              Watch Tennis Today helps visitors find official tennis
              broadcasters and streaming services by country, tournament and
              player. This Privacy Policy
              explains how information may be collected and used when you visit
              this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              2. Information we may collect
            </h2>
            <p>
              We may collect limited technical and usage information, such as
              pages visited, device type, browser type, approximate location,
              referral source and interactions with website content. This
              information is used to understand website performance and improve
              the user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              3. Analytics
            </h2>
            <p>
              We may use analytics tools, including Google Analytics or similar
              services, to understand how visitors use the website. Analytics
              tools may use cookies or similar technologies to measure traffic,
              page performance and user behavior in aggregate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              4. Advertising
            </h2>
            <p>
              Watch Tennis Today does not display advertisements and does not
              use advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              5. Cookies
            </h2>
            <p>
              Cookies are small files stored on your device. They may be used
              for analytics, performance measurement and basic website
              functionality. You can control or
              disable cookies through your browser settings, but some website
              features may not work as expected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              6. Affiliate links
            </h2>
            <p>
              Watch Tennis Today does not use affiliate links and does not earn
              commissions from links to broadcasters or other services. We
              point readers toward legal viewing options and do not host tennis
              streams.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              7. External websites
            </h2>
            <p>
              This website may link to third-party broadcasters, streaming
              services, tournament websites and other
              external resources. We are not responsible for the privacy
              practices, content, pricing or availability of external websites.
              Please review their policies before using those services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              8. Data sharing
            </h2>
            <p>
              We do not sell personal information. Limited information may be
              processed by analytics, hosting or security
              service providers as necessary to operate and improve the website.
            </p>
          </section>


          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              9. Your choices
            </h2>
            <p>
              You can adjust cookie preferences in your browser and use available
              device privacy controls. If you are in
              a region with additional privacy rights, you may contact us through
              the Contact page with a privacy-related request.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              10. Contact
            </h2>
            <p>
              If you have questions about this Privacy Policy, you can contact
              us through the Contact page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

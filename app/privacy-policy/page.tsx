export const metadata = {
  title: "Privacy Policy | Watch Tennis Today",
  description:
    "Privacy policy for Watch Tennis Today.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          Privacy Policy
        </h1>

        <div className="space-y-5 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today provides tennis schedules,
            broadcaster information and links to official
            streaming sources.
          </p>

          <p>
            We may use analytics tools to understand how visitors
            use the website, improve content and monitor site
            performance.
          </p>

          <p>
            We do not sell personal information. External links may
            lead to third-party websites with their own privacy
            policies and terms.
          </p>

          <p>
            If affiliate links are added in the future, we may earn
            a commission when users click or purchase through those
            links, at no additional cost to the user.
          </p>

          <p>
            For questions, contact us through the contact information
            provided on the website.
          </p>
        </div>
      </div>
    </main>
  );
}

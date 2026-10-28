export const metadata = {
  title: "Affiliate Disclosure | Watch Tennis Today",
  description:
    "Affiliate disclosure for Watch Tennis Today: we do not use affiliate links or earn commissions.",
  alternates: { canonical: "https://watchtennistoday.com/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">Affiliate Disclosure</h1>

      <p className="mb-4 text-zinc-300">
        Watch Tennis Today does not use affiliate links and does not display
        advertisements. We do not earn a commission when you click a link to a
        broadcaster, streaming service or other provider.
      </p>

      <p className="mb-4 text-zinc-300">
        The site is supported by optional donations, which never affect which
        services we list.
      </p>

      <p className="mb-4 text-zinc-300">
        We only aim to recommend services that are relevant to tennis fans, such
        as streaming platforms, sports TV services, or VPN providers for
        accessing official tennis coverage while traveling.
      </p>

      <p className="text-zinc-300">
        Our content is written for informational purposes. Always check the
        official broadcaster or service provider for the latest availability,
        pricing, and terms.
      </p>
    </main>
  );
}

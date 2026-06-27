export const metadata = {
  title: "Affiliate Disclosure | Watch Tennis Today",
  description:
    "Affiliate disclosure for Watch Tennis Today. Learn how we may earn commissions from links on our website.",
  alternates: { canonical: "https://watchtennistoday.com/affiliate-disclosure" },
};

export const dynamic = "force-dynamic";
export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">Affiliate Disclosure</h1>

      <p className="mb-4 text-zinc-300">
        Watch Tennis Today may contain affiliate links. This means we may earn a
        commission if you click a link and purchase a product or service.
      </p>

      <p className="mb-4 text-zinc-300">
        This does not cost you anything extra. It helps support the site and
        allows us to keep publishing tennis schedules, live match guides, and
        streaming information.
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
